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
}

export const enum MessageSourceArea {
  EMAIL = 'email',
  SECURITY = 'security',
  PERSISTENCE = 'persistence',
  INFRASTRUCTURE = 'infrastructure',
  APPLICATION = 'application',
}

export interface TranslatableMessage {
  messageKey: MessageCode;
  sourceArea: MessageSourceArea;
  args?: { [key: string]: any };
}
