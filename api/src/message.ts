export const enum MessageCode {
  /* Email */
  EMAIL_SENDING_FAILED = 'emailSendingFailed',

  /* Security */
  URL_NO_LONGER_VALID = 'urlNoLongerValid',
  REFRESH_TOKEN_USER_NOT_FOUND = 'refreshTokenUserNotFound',
  USER_IS_NOT_ACTIVE = 'userIsNotActive',
  USER_IS_ALREADY_ACTIVE = 'userIsAlreadyActive',
  GOOGLE_AUTHENTICATION_ERROR = 'googleAuthError',
  USER_ALREADY_EXIST = 'userAlreadyExists',
  INVALID_ACTIVATION_GUID = 'invalidActivationGuid',
  INVALID_USERNAME_OR_PASSWORD = 'invalidUserNameOrPassword',
  INVALID_PASSWORD = 'invalidPassword',
  USER_DOES_NOT_EXIST = 'userDoesNotExist',
  FACEBOOK_LOGIN_ERROR = 'facebookLoginError',

  /* Persistence */
  UNKNOWN_PERSISTENCE_ERROR = 'unknownPersistenceError',
  VALUE_TOO_LONG = 'valueTooLong',
  UNIQUE_CONSTRAINT_FAILED = 'uniqueConstraintFailed',
  FOREIGN_CONSTRAINT_FAILED = 'foreignConstraintFailed',
  INVALID_FIELD_VALUE = 'invalidFieldValue',
  NULL_CONSTRAINT_VIOLATION = 'nullConstraintViolation',
  RELATION_VIOLATION = 'relationViolation',
  OUT_OF_RANGE = 'outOfRange',

  /* Infrastructure */
  INVALID_IMAGE_TYPE = 'invalidImageType',
  IMAGE_SAVE_ERROR = 'imageSaveError',

  /* Application */
  ONE_REVIEW_PER_ONE_USER = 'oneReviewPerOneUser',

  /* Misc */
  UNKNOWN_ERROR = 'unknownServerError',

  /* Domain */
  NON_POSITIVE_LOT_CAPACITY = 'nonPositiveLotCapacity',
  SAME_CAPACITY = 'sameCapacity',
  VEHICLE_ALREADY_REGISTERED = 'vehicleAlreadyRegistered',
  PARKING_LOT_ALREADY_ASSIGNED_TO_DRIVER = 'parkingLotAlreadyAssignedToDriver',
  PARKING_LOT_NOT_ASSIGNED_TO_DRIVER = 'parkingLotNotAssignedToDriver',
  PARKING_LOT_DOES_NOT_EXIST = 'parkingLotDoesNotExist',
  DRIVER_DOES_NOT_EXIST = 'driverDoesNotExist',
  HOUR_FROM_GREATER_THAN_HOUR_TO = 'hourFromGreaterThanHourTo',
  INVALID_HOURS = 'invalidHours',
  RESERVATION_IS_CANCELLED = 'reservationIsCancelled',
  RESERVATION_IS_CONFIRMED = 'reservationIsConfirmed',
  RESERVATION_CANNOT_BE_CONFIRMED_YET = 'reservationCannotBeConfirmedYet',
  RESERVATION_CANNOT_BE_CONFIRMED_ANYMORE = 'reservationCannotBeConfirmedAnymore',
  SCHEDULED_TIME_CANNOT_BE_CHANGED_ANYMORE = 'scheduledTimeCannotBeChangedAnymore',
  RESERVATION_NEEDS_TO_BE_CONFIRMED_FIRST = 'reservationNeedsToBeConfirmedFirst',
  RESERVED_PARKING_TIME_IN_THE_PAST = 'reservedParkingTimeInThePast',
  PREVIOUS_TICKET_NOT_RETURNED = 'previousTicketNotReturned',
  TICKET_NOT_FOUND = 'ticketNotFound',
  TICKET_ALREADY_RETURNED = 'ticketAlreadyReturned',
  INVALID_DATE_TIME_INTERVAL = 'invalidDateTimeInterval',
  PARKING_TIME_IN_DIFFERENT_DAYS = 'parkingTimeInDifferentDays',
  NO_PLACE_IN_LOT = 'noPlaceInLot',
  INVALID_PARKING_TICKET_TIME = 'invalidParkingTicketTime',
  /* Validation */
  VALIDATION_ERROR = 'validationError',
  UNDEFINED = 'undefined',
  EMPTY = 'empty',
}

export const enum MessageSourceArea {
  EMAIL = 'email',
  SECURITY = 'security',
  PERSISTENCE = 'persistence',
  INFRASTRUCTURE = 'infrastructure',
  APPLICATION = 'application',
  DOMAIN = 'domain',
  VALIDATION = 'validation',
}

export interface TranslatableMessage {
  messageKey: MessageCode;
  sourceArea: MessageSourceArea;
  args?: { [key: string]: any };
}
