interface BaseResponseBody {
  status_code: number;
}

//export type CommonErrorCode = 400 | 401 | 403 | 404 | 409 | 412 | 500 | 501;

export interface SuccesResponseBody<T> extends BaseResponseBody {
  message: string;
  payload?: {
    data: T;
  };
}

export interface ErrorResponseBody extends BaseResponseBody {
  error: string;
}
