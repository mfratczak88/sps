export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  messageCode?: string | MessageCode;
}

export const enum MessageCode {
  URL_NO_LONGER_VALID = 'urlNoLongerValid',
}
