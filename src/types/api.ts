/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
  }
  
  export interface ApiError {
    message: string;
    statusCode: number;
    error: string;
  }
  