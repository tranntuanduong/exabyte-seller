import { ErrorResponse } from "@remix-run/router";
import Axios from "axios";
import useAxios, { RefetchOptions, configure } from "axios-hooks";
import { LRUCache } from "lru-cache";
import { useCallback, useMemo } from "react";
import {
  IRequestConfig,
  IRequestOptions,
  UseCustomAxiosType,
} from "src/types/http-client.type";

import { get } from "lodash";
import { useLocalStorage } from "../useLocalStorage";

import authConfig from "src/configs/auth";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
});

axios.interceptors.request.use(
  async (config: IRequestConfig<any>) => {
    if (config.withAuth) {
      const token = JSON.parse(
        localStorage.getItem(authConfig.storageTokenKeyName) || '""'
      );

      if (token) {
        config.headers = {
          authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  }
  // (error) => Promise.reject(error)
);

let isRefreshing = false;

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    // Make an API call to your server to refresh the access token
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BE_URL}shop/refresh-token`,
      {
        refreshToken:
          localStorage.getItem(authConfig.onTokenExpiration) ?? '""',
      }
    );

    console.log("response.data.data", response);

    // localStorage.setItem(
    //   authConfig.storageTokenKeyName,
    //   JSON.stringify(response.data.data)
    // );
    return response.data.data;
    // Return the new access token
  } catch (error) {
    // Handle error in refreshing the token (e.g., redirect to login page)
    // throw new Error("Failed to refresh access token");
    localStorage.removeItem(authConfig.storageTokenKeyName);
    localStorage.removeItem(authConfig.userData);
    localStorage.removeItem(authConfig.onTokenExpiration);
    // window.location.replace("/login");
  } finally {
    isRefreshing = false;
  }
};

// Request interceptor to handle failed API calls and refresh the token
axios.interceptors.response.use(
  (response) => response, // If the request succeeds, pass the response through
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status code indicates an expired access token
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const accessToken = await refreshAccessToken();

        // Update the original request headers with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Content-Type"] = `application/json`;

        // Retry the original request
        return axios(originalRequest);
      } catch (error) {
        // Handle error in refreshing the token (e.g., redirect to login page)
        throw error;
      }
    }

    // For any other error, pass it through
    return Promise.reject(error);
  }
);

const cache = new LRUCache({ max: 10 }) as any;

configure({ axios, cache });

// hook call API (customize from useAxios)
// doc: https://www.npmjs.com/package/axios-hooks
const useHttpClient = <T = any, D = any>(
  config: IRequestConfig<D>, // config parameters contain the request url and optional parameter
  options?: IRequestOptions // options e.g. dataPath contains path to the data in response you want to store
): UseCustomAxiosType<T, D> => {
  // fetch the access token from localStorage
  const [accessToken] = useLocalStorage(authConfig.storageTokenKeyName, "");

  // Overwrite config object to add access token to the headers
  const overwriteConfig: IRequestConfig<D> = useMemo(() => {
    const _config = { ...config };

    if (_config.param) {
      // if request config contains parameter append it to the url
      _config.url = _config.url + "/" + _config.param;
    }
    return { ..._config };
  }, [config, accessToken]);

  // return an array containing data, response, loading and error values
  const [{ data, response, loading, error }, refetch] = useAxios<
    T,
    D,
    ErrorResponse
  >(overwriteConfig, options);

  // memoize dataWithCusomPath for dataPath access
  // @ts-ignore
  const dataWithCusomPath: T = useMemo(() => {
    const dataPath = options?.dataPath;

    return dataPath ? get(data, dataPath) : data;
  }, [data, options?.dataPath || ""]);

  // Callback function to get response and apply dataPath
  const _refetch = useCallback(
    async (
      _config?: IRequestConfig<D> | undefined,
      _options?: RefetchOptions | undefined
    ) => {
      if (_config?.param) {
        // if request config contains parameter append it to the url
        _config.url = overwriteConfig?.url + "/" + _config.param;
      }
      // Await the API response
      const res = await refetch(_config, _options);
      // Destructure data from response
      const { data, ...restResponse } = res;
      // Get data from dataPath
      const dataPath = options?.dataPath;
      const dataWithPath = dataPath ? get(data, dataPath) : data;
      // return response and data with dataPath
      return { ...restResponse, data: dataWithPath };
    },
    [accessToken, config, refetch, options?.dataPath || ""]
  );

  // return an array containing data with dataPath, response, loading and error values
  // @ts-ignore
  return [{ data: dataWithCusomPath, response, loading, error }, _refetch];
};

export default useHttpClient;
