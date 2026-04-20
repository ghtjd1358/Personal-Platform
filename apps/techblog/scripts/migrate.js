#!/usr/bin/env node
/**
 * TechBlog Database Migration Script
 *
 * Usage:
 *   npm run migrate         - Show migration SQL and instructions
 *   npm run migrate:check   - Check database connection
 *
 * Environment variables required:
 *   REACT_APP_SUPABASE_URL
 *   REACT_APP_SUPABASE_ANON_KEY
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// SQL file paths
const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const SEED_DIR = path.join(__dirname, '../supabase/seed');

/**
 * Read all SQL files from a directory
 */
function readSqlFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(filename => ({
      name: filename,
      path: path.join(dir, filename),
      content: fs.readFileSync(path.join(dir, filename), 'utf8'),
    }));
}

/**
 * Check database connection
 */
async function checkConnection() {
  log.title('🔌 Checking Supabase Connection');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log.error('Missing environment variables:');
    if (!SUPABASE_URL) log.error('  - REACT_APP_SUPABASE_URL');
    if (!SUPABASE_KEY) log.error('  - REACT_APP_SUPABASE_ANON_KEY');
    return false;
  }

  log.info(`URL: ${SUPABASE_URL}`);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (response.ok) {
      log.success('Connection successful!');
      return true;
    } else {
      log.error(`Connection failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (err) {
    log.error(`Connection error: ${err.message}`);
    return false;
  }
}

/**
 * Check if tables exist
 */
async function checkTables() {
  log.title('📋 Checking Existing Tables');

  const tables = ['jobs', 'job_applications', 'job_notes', 'calendar_events', 'job_bookmarks'];

  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });

      if (response.ok) {
        log.success(`${table} - exists`);
      } else if (response.status === 404) {
        log.warn(`${table} - not found (needs migration)`);
      } else {
        log.warn(`${table} - ${response.status}`);
      }
    } catch (err) {
      log.error(`${table} - error: ${err.message}`);
    }
  }
}

/**
 * Show migration SQL
 */
function showMigrationSql() {
  log.title('📄 Migration SQL Files');

  const migrations = readSqlFiles(MIGRATIONS_DIR);
  const seeds = readSqlFiles(SEED_DIR);

  if (migrations.length === 0) {
    log.warn('No migration files found');
    return;
  }

  console.log('─'.repeat(60));

  for (const file of migrations) {
    console.log(`\n${colors.bright}📁 ${file.name}${colors.reset}`);
    console.log('─'.repeat(60));
    console.log(file.content);
    console.log('─'.repeat(60));
  }

  if (seeds.length > 0) {
    log.title('🌱 Seed Data Files');

    for (const file of seeds) {
      console.log(`\n${colors.bright}📁 ${file.name}${colors.reset}`);
      console.log('─'.repeat(60));
      console.log(file.content);
      console.log('─'.repeat(60));
    }
  }
}

/**
 * Show instructions
 */
function showInstructions() {
  log.title('📝 Migration Instructions');

  console.log(`
To apply the migration, follow these steps:

${colors.bright}Option 1: Supabase Dashboard (Recommended)${colors.reset}
  1. Go to: ${colors.cyan}${SUPABASE_URL?.replace('.supabase.co', '.supabase.co/project/default/sql')}${colors.reset}
  2. Open SQL Editor
  3. Copy and paste the migration SQL above
  4. Click "Run"

${colors.bright}Option 2: Supabase CLI${colors.reset}
  1. Install: npm install -g supabase
  2. Login: supabase login
  3. Link: supabase link --project-ref <your-project-id>
  4. Push: supabase db push

${colors.bright}Option 3: psql (Direct PostgreSQL)${colors.reset}
  1. Get connection string from Supabase Dashboard > Settings > Database
  2. Run: psql <connection-string> -f supabase/migrations/001_initial_schema.sql

${colors.yellow}⚠ After migration, run seeds if needed:${colors.reset}
  psql <connection-string> -f supabase/seed/001_jobs_seed.sql
`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';

  console.log(`
${colors.bright}╔═══════════════════════════════════════════════╗
║       TechBlog Database Migration Tool        ║
╚═══════════════════════════════════════════════╝${colors.reset}
`);

  switch (command) {
    case 'check':
      await checkConnection();
      await checkTables();
      break;

    case 'migrate':
    default:
      const connected = await checkConnection();
      if (connected) {
        await checkTables();
      }
      showMigrationSql();
      showInstructions();
      break;
  }
}

main().catch(err => {
  log.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
