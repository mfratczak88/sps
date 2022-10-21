export enum TopLevelPaths {
  AUTH = 'auth',
  ADMIN_DASHBOARD = 'admin-dashboard',
  ERROR = 'error',
}
export enum AuthPaths {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  FORGOT_PASSWORD = 'forgot-password',
  CONFIRM_ACCOUNT = 'confirm-account/:activationGuid',
  RESEND_ACTIVATION_LINK = 'resend-activation-link',
}
export enum ErrorPaths {
  NOT_FOUND = 'not-found',
  INTERNAL_SERVER_ERROR = 'internal-server-error',
}
export enum AdminPaths {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  PARKING = 'parking',
  RESERVATIONS = 'reservations',
}
