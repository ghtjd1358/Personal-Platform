/**
 * Application API Module
 *
 * CRUD operations for job applications
 */

export {
  getApplications,
  getApplicationById,
  type ApplicationSearchParams,
} from './get-applications';

export {
  createApplication,
  type CreateApplicationInput,
} from './create-application';

export {
  updateApplication,
  updateApplicationStatus,
  updateApplicationResult,
  type UpdateApplicationInput,
} from './update-application';

export { deleteApplication } from './delete-application';
