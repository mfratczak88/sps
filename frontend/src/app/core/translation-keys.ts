export enum AuthTranslationKeys {
  RESEND_EMAIL_VERIFICATION = 'AUTH.RESEND_EMAIL_VERIFICATION',
  LINK_EXPIRED = 'AUTH.LINK_EXPIRED',
  FORGOT_PASSWORD = 'AUTH.FORGOT_PASSWORD',
  DONT_HAVE_AN_ACCOUNT = 'AUTH.DONT_HAVE_AN_ACCOUNT',
  SIGN_IN_TITLE = 'AUTH.SIGN_IN_TITLE',
  SIGN_IN = 'AUTH.SIGN_IN',
  SIGN_UP_TITLE = 'AUTH.SIGN_UP_TITLE',
  SIGN_UP = 'AUTH.SIGN_UP',
  SIGN_IN_WITH_EMAIL = 'AUTH.SIGN_IN_WITH_EMAIL',
  SIGN_IN_WITH_GOOGLE = 'AUTH.SIGN_IN_WITH_GOOGLE',
  ENTER_YOUR_EMAIL = 'AUTH.ENTER_YOUR_EMAIL',
  ENTER_YOUR_PASSWORD = 'AUTH.ENTER_YOUR_PASSWORD',
  ALREADY_HAVE_ACCOUNT = 'AUTH.ALREADY_HAVE_ACCOUNT',
  SIGN_UP_DISCLAIMER = 'AUTH.SIGN_UP_DISCLAIMER',
  TERMS_AND_CONDITIONS = 'AUTH.TERMS_AND_CONDITIONS',
  ENTER_YOUR_NAME = 'AUTH.ENTER_YOUR_NAME',
  WE_CAN_SEND_A_NEW_ONE = 'AUTH.WE_CAN_SEND_A_NEW_ONE',
}
export enum FormErrorKeys {
  REQUIRED = 'FORM_ERROR.REQUIRED',
  MIN_LENGTH = 'FORM_ERROR.MIN_LENGTH',
  MAX_LENGTH = 'FORM_ERROR.MAX_LENGTH',
  EMAIL = 'FORM_ERROR.EMAIL',
  MIN = 'FORM_ERROR.MIN',
  MAX = 'FORM_ERROR.MAX',
  HOUR_FROM_GREATER_THAN_HOUR_TO = 'FORM_ERROR.HOUR_FROM_GREATER_THAN_HOUR_TO',
  NONE_CHECKBOX_SELECTED = 'FORM_ERROR.NONE_CHECKBOX_SELECTED',
  VEHICLE_ALREADY_ADDED = 'FORM_ERROR.VEHICLE_ALREADY_ADDED',
  LOT_CLOSED_ON_THIS_DAY = 'FORM_ERROR.LOT_CLOSED_ON_THIS_DAY',
}
export enum ToastKeys {
  CHECK_EMAIL = 'TOAST.CHECK_EMAIL',
  EMAIL_VERIFIED = 'TOAST.EMAIL_VERIFIED',
  DISMISS = 'TOAST.DISMISS',
  ROLE_CHANGED = 'TOAST.ROLE_CHANGED',
  CAPACITY_CHANGED = 'TOAST.CAPACITY_CHANGED',
  HOURS_CHANGED = 'TOAST.HOURS_CHANGED',
  PARKING_LOT_CREATED = 'TOAST.PARKING_LOT_CREATED',
  PARKING_LOT_ASSIGNED = 'TOAST.PARKING_LOT_ASSIGNED',
  PARKING_LOT_ASSIGNMENT_REMOVED = 'TOAST.PARKING_LOT_ASSIGNMENT_REMOVED',
  VEHICLE_ADDED = 'TOAST.VEHICLE_ADDED',
  RESERVATION_CREATED = 'TOAST.RESERVATION_CREATED',
  RESERVATION_CONFIRMED = 'TOAST.RESERVATION_CONFIRMED',
  RESERVATION_CANCELLED = 'TOAST.RESERVATION_CANCELLED',
  RESERVATION_TIME_CHANGED = 'TOAST.RESERVATION_TIME_CHANGED',
}
export enum ErrorKeys {
  INTERNAL_SERVER_ERROR = 'ERROR.INTERNAL_SERVER_ERROR',
  UNKNOWN_ERROR = 'ERROR.UNKNOWN_ERROR',
  PAGE_NOT_FOUND = 'ERROR.PAGE_NOT_FOUND',
  PAGE_NOT_FOUND_TEXT = 'ERROR.PAGE_NOT_FOUND_TEXT',
  TO_HOME_PAGE = 'ERROR.TO_HOME_PAGE',
  UNAUTHORIZED = 'ERROR.UNAUTHORIZED',
  UNAUTHORIZED_TEXT = 'ERROR.UNAUTHORIZED_TEXT',
}
export enum SharedKeys {
  HEY_USER = 'SHARED.HEY_USER',
  SIGN_OUT = 'SHARED.SIGN_OUT',
}
export enum DrawerKeys {
  DASHBOARD = 'DRAWER.DASHBOARD',
  PARKING = 'DRAWER.PARKING',
  RESERVATIONS = 'DRAWER.RESERVATIONS',
  RESERVATION_DETAILS = 'DRAWER.RESERVATION_DETAILS',
  CREATE_RESERVATION = 'DRAWER.CREATE_RESERVATION',
  USERS = 'DRAWER.USERS',
  CREATE_PARKING = 'DRAWER.CREATE_PARKING',
  PARKING_DETAILS = 'DRAWER.PARKING_DETAILS',
  DRIVERS = 'DRAWER.DRIVERS',
  VEHICLES = 'DRAWER.VEHICLES',
}
export enum AdminKeys {
  RESERVATIONS_TITLE = 'ADMIN.RESERVATIONS_TITLE',
  RESERVATIONS_SUBTITLE = 'ADMIN.RESERVATIONS_SUBTITLE',
  PARKING_TITLE = 'ADMIN.PARKING_TITLE',
  PARKING_SUBTITLE = 'ADMIN.PARKING_SUBTITLE',
  USERS_TITLE = 'ADMIN.USERS_TITLE',
  USERS_SUBTITLE = 'ADMIN.USERS_SUBTITLE',
  ASSIGN_USER_ROLE_DIALOG_TITLE = 'ADMIN.ASSIGN_USER_ROLE_DIALOG_TITLE',
  ASSIGN_USER_ROLE_DIALOG_TEXT = 'ADMIN.ASSIGN_USER_ROLE_DIALOG_TEXT',
  COLUMN_EMAIL = 'ADMIN.COLUMN_EMAIL',
  COLUMN_NAME = 'ADMIN.COLUMN_NAME',
  COLUMN_ROLE = 'ADMIN.COLUMN_ROLE',
  COLUMN_EDIT = 'ADMIN.COLUMN_EDIT',
  COLUMN_DETAILS = 'ADMIN.COLUMN_DETAILS',
  COLUMN_ADDRESS = 'ADMIN.COLUMN_ADDRESS',
  CAPACITY = 'ADMIN.COLUMN_CAPACITY',
  PARKING_LOTS_TABLE_HEADER = 'ADMIN.PARKING_LOTS_TABLE_HEADER',
  USERS_TABLE_HEADER = 'ADMIN.USERS_TABLE_HEADER',
  PLACES = 'ADMIN.PLACES',
  CHANGE_HOURS_OF_OPERATION = 'ADMIN.CHANGE_HOURS_OF_OPERATION',
  HOUR_FROM = 'ADMIN.HOUR_FROM',
  HOUR_TO = 'ADMIN.HOUR_TO',
  CHANGE_CAPACITY = 'ADMIN.CHANGE_CAPACITY',
  CREATE_NEW_PARKING_LOT = 'ADMIN.CREATE_NEW_PARKING_LOT',
  CREATE_NEW_PARKING_LOT_SUB_TITLE = 'ADMIN.CREATE_NEW_PARKING_LOT_SUB_TITLE',
  FILL_OUT_ADDRESS = 'ADMIN.FILL_OUT_ADDRESS',
  CITY = 'ADMIN.CITY',
  STREET_NAME = 'ADMIN.STREET_NAME',
  STREET_NUMBER = 'ADMIN.STREET_NUMBER',
  FILL_OUT_OPERATION_HOURS = 'ADMIN.FILL_OUT_OPERATION_HOURS',
  PREVIOUS = 'ADMIN.PREVIOUS',
  FILL_OUT_CAPACITY = 'ADMIN.FILL_OUT_CAPACITY',
  DRIVERS = 'ADMIN.DRIVERS',
  NAME = 'ADMIN.NAME',
  EMAIL = 'ADMIN.EMAIL',
  ASSIGNED_PARKING_LOTS = 'ADMIN.ASSIGNED_PARKING_LOTS',
  DRIVER_DETAILS = 'ADMIN.DRIVER_DETAILS',
  ASSIGN_PARKING_LOT_DIALOG_TITLE = 'ADMIN.ASSIGN_PARKING_LOT_DIALOG_TITLE',
  ASSIGN_PARKING_LOT_DIALOG_DESC = 'ADMIN.ASSIGN_PARKING_LOT_DIALOG_DESC',
  DRIVERS_SUBTITLE = 'ADMIN.DRIVERS_SUBTITLE',
  REMOVE_ASSIGNMENT = 'ADMIN.REMOVE_ASSIGNMENT',
  DAYS = 'ADMIN.DAYS',
  VALID_FROM = 'ADMIN.VALID_FROM',
}
export enum RoleKeys {
  ADMIN = 'ROLE.ADMIN',
  CLERK = 'ROLE.CLERK',
  DRIVER = 'ROLE.DRIVER',
}
export enum MiscKeys {
  CANCEL = 'MISC.CANCEL',
  ASSIGN = 'MISC.ASSIGN',
  SELECT = 'MISC.SELECT',
  SEARCH = 'MISC.SEARCH',
  ADD = 'MISC.ADD',
  CHANGE = 'MISC.CHANGE',
  SAVE = 'MISC.SAVE',
  BACK = 'MISC.BACK',
  PREVIOUS = 'MISC.PREVIOUS',
  RESET = 'MISC.RESET',
  NEXT = 'MISC.NEXT',
  HOURS = 'MISC.HOURS',
  CONFIRM = 'MISC.CONFIRM',
  CREATE = 'MISC.CREATE',
}
export enum PaginationKeys {
  FIRST_PAGE_LABEL = 'PAGINATION.FIRST_PAGE_LABEL',
  RANGE_LABEL = 'PAGINATION.RANGE_LABEL',
  ITEMS_PER_PAGE_LABEL = 'PAGINATION.ITEMS_PER_PAGE_LABEL',
  LAST_PAGE_LABEL = 'PAGINATION.LAST_PAGE_LABEL',
  NEXT_PAGE_LABEL = 'PAGINATION.NEXT_PAGE_LABEL',
  PREVIOUS_PAGE_LABEL = 'PAGINATION.PREVIOUS_PAGE_LABEL',
}
export enum WeekDays {
  MONDAY = 'WEEKDAYS.MONDAY',
  TUESDAY = 'WEEKDAYS.TUESDAY',
  WEDNESDAY = 'WEEKDAYS.WEDNESDAY',
  THURSDAY = 'WEEKDAYS.THURSDAY',
  FRIDAY = 'WEEKDAYS.FRIDAY',
  SATURDAY = 'WEEKDAYS.SATURDAY',
  SUNDAY = 'WEEKDAYS.SUNDAY',
}
export enum WeekDaysShort {
  MONDAY = 'WEEKDAYS.MONDAY_SHORT',
  TUESDAY = 'WEEKDAYS.TUESDAY_SHORT',
  WEDNESDAY = 'WEEKDAYS.WEDNESDAY_SHORT',
  THURSDAY = 'WEEKDAYS.THURSDAY_SHORT',
  FRIDAY = 'WEEKDAYS.FRIDAY_SHORT',
  SATURDAY = 'WEEKDAYS.SATURDAY_SHORT',
  SUNDAY = 'WEEKDAYS.SUNDAY_SHORT',
}
export enum DriverKeys {
  ADD_VEHICLE_DIALOG_TITLE = 'DRIVER.ADD_VEHICLE_DIALOG_TITLE',
  LICENSE_PLATE = 'DRIVER.LICENSE_PLATE',
  VEHICLES = 'DRIVER.VEHICLES',
  VEHICLES_ADD_PROMPT = 'DRIVER.VEHICLES_ADD_PROMPT',
  AVAILABLE_LOTS = 'DRIVER.AVAILABLE_LOTS',
  AVAILABLE_LOTS_INFO = 'DRIVER.AVAILABLE_LOTS_INFO',
  REQUEST_ACCESS = 'DRIVER.REQUEST_ACCESS',
  REQUEST_ACCESS_INFO = 'DRIVER.REQUEST_ACCESS_INFO',
  RESERVE = 'DRIVER.RESERVE',
  SELECT_PARKING_LOT = 'DRIVER.SELECT_PARKING_LOT',
  PARKING_LOT = 'DRIVER.PARKING_LOT',
  CHOSE_A_DATE = 'DRIVER.CHOSE_A_DATE',
  DATE = 'DRIVER.DATE',
  MAKE_RESERVATION_TITLE = 'DRIVER.MAKE_RESERVATION_TITLE',
  MAKE_RESERVATION_SUBTITLE = 'DRIVER.MAKE_RESERVATION_SUBTITLE',
  CHOOSE_VEHICLE = 'DRIVER.CHOOSE_VEHICLE',
  VEHICLE = 'DRIVER.VEHICLE',
  DUE_NEXT = 'DRIVER.DUE_NEXT',
  DUE_NEXT_PROMPT = 'DRIVER.DUE_NEXT_PROMPT',
  CONFIRM_PROMPT = 'DRIVER.CONFIRM_PROMPT',
  CONFIRM_TITLE = 'DRIVER.CONFIRM_TITLE',
  TIME_TO_CONFIRM = 'DRIVER.TIME_TO_CONFIRM',
  REJECT = 'DRIVER.REJECT',
  RESERVATIONS = 'DRIVER.RESERVATIONS',
  CHANGE_TIME = 'DRIVER.CHANGE_TIME',
  CANCEL_RESERVATION = 'DRIVER.CANCEL_RESERVATION',
  CANCEL_RESERVATION_QUESTION = 'DRIVER.CANCEL_RESERVATION_QUESTION',
  CONFIRM_RESERVATION = 'DRIVER.CONFIRM_RESERVATION',
  CONFIRM_RESERVATION_QUESTION = 'DRIVER.CONFIRM_RESERVATION_QUESTION',
  RESERVATION_DETAILS = 'DRIVER.RESERVATION_DETAILS',
  DATE_AND_TIME = 'DRIVER.DATE_AND_TIME',
  STATUS = 'DRIVER.STATUS',
}
export enum TableKeys {
  CREATED_AT = 'TABLE_KEYS.CREATED_AT',
  CAPACITY = 'TABLE_KEYS.CAPACITY',
  HOURS = 'TABLE_KEYS.HOURS',
  DAYS = 'TABLE_KEYS.DAYS',
  LICENSE_PLATE = 'TABLE_KEYS.LICENSE_PLATE',
  TIME = 'TABLE_KEYS.TIME',
  RESERVATION_STATUS = 'TABLE_KEYS.RESERVATION_STATUS',
  PARKING_LOT_ADDRESS = 'TABLE_KEYS.PARKING_LOT_ADDRESS',
  RESERVATION_DATE = 'TABLE_KEYS.RESERVATION_DATE',
}
export enum ReservationStatusKey {
  DRAFT = 'RESERVATION_STATUS.DRAFT',
  CONFIRMED = 'RESERVATION_STATUS.CONFIRMED',
  CANCELLED = 'RESERVATION_STATUS.CANCELLED',
}
