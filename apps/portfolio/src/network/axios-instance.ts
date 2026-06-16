import { AxiosClientFactory, getStore } from '@sonhoseong/mfa-lib';
import { InternalAxiosRequestConfig } from 'axios';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const getAccessToken = () => getStore().getState().app.accessToken;

const supabaseRequestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = getAccessToken();
    config.headers['apikey'] = SUPABASE_ANON_KEY;
    config.headers['Authorization'] = `Bearer ${accessToken || SUPABASE_ANON_KEY}`;
    config.headers['Content-Type'] = 'application/json';
    config.headers['Prefer'] = 'return=representation';
    return config;
};

export const supabaseAxios = AxiosClientFactory.createClient(
    { hostUrl: SUPABASE_URL, basePath: '/rest/v1' },
    supabaseRequestHandler
);
