import {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { RefetchOptions, Options } from "axios-hooks";
import { ErrorResponse } from "./base.type";

export type ResponseType<T> = {};

// This interface extends the AxiosRequestConfig to add additional properties
export interface IRequestConfig<D = any> extends AxiosRequestConfig<D> {
  // indicates whether authentication is required for making the request
  withAuth?: boolean | string;
  // parameter to be passed to the API request
  param?: string;
}


// export an interface named 'IRequestOptions' which extends from an Options interface
export interface IRequestOptions extends Options {
  // the dataPath property is optional. This indicates where is main data in response
  dataPath?: string;
}


export type UseCustomAxiosType<T = any, D = any> = [
  {
    data: T | undefined;
    loading: boolean;
    error: AxiosError<any, any> | null;
    response: AxiosResponse<T, any> | undefined;
    // resData: ResponseType<T> | undefined;
  },
  (
    config?: IRequestConfig<D> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<T>
];

// const x:AxiosError<ErrorResponse, any>;
