export interface BaseRes<T = any> {
  message: string
  messageCode: number
  data: T;
}

export interface ErrorResponse {
  error?: string;
  error_description?: string;
  message?: string;
}

export interface BaseResponse {}
