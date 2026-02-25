export interface ApiValidationErrorItem {
  code: string;
  message: string;
  path: string[];
  origin?: string;
  format?: string;
  pattern?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiValidationErrorItem[];
}
