export enum TopLevelPaths {
  AUTH = 'auth',
  ADMIN_DASHBOARD = 'admin-dashboard',
  CLERK_DASHBOARD = 'clerk-dashboard',
  DRIVER_DASHBOARD = 'driver-dashboard',
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
  UNAUTHORIZED = 'unauthorized',
}

export enum AdminPaths {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  PARKING = 'parking',
  PARKING_DETAILS = `parking/:parkingLotId`,
  RESERVATIONS = 'reservations',
  CREATE_PARKING = `create-parking-lot`,
  DRIVERS = 'drivers',
  DRIVER_DETAILS = 'drivers/:id',
}
export enum ClerkPaths {
  DASHBOARD = 'dashboard',
}
export enum DriverPaths {
  DASHBOARD = 'dashboard',
  RESERVATIONS = 'reservations',
  PARKING_LOTS = 'parking-lots',
  VEHICLES = 'vehicles',
  CREATE_RESERVATION = 'create-reservation',
}
