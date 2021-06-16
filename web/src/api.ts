/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import applyCaseMiddleware from "axios-case-converter";
import axios, { AxiosError } from "axios";

type Method = "GET" | "POST";

type ErrorResponse = {
  kind: string;
  message: string;
  status: number;
};

const unexpectedError = {
  kind: "unexpected",
  message: "unexpected error",
  status: -1,
};

export type Response<T> =
  | {
      success: true;
      error: null;
      data: T;
    }
  | {
      success: false;
      error: ErrorResponse;
      data: null;
    };

const client = applyCaseMiddleware(axios.create());

const request = async <T>(
  path: string,
  method: Method,
  data?: Record<string, unknown>
): Promise<Response<T>> => {
  const url = `/api/v1${path}`;

  try {
    const res = await client.request<T>({
      url,
      method,
      responseType: "json",
      data,
    });
    return {
      success: true,
      error: null,
      data: res.data,
    };
  } catch (e) {
    const err = e as AxiosError<ErrorResponse>;
    console.error(`failed to ${method} ${url}: ${err.message}`);
    if (err.response) {
      console.error(err.response.data);
      return {
        success: false,
        error: err.response.data,
        data: null,
      };
    } else {
      return {
        success: false,
        error: unexpectedError,
        data: null,
      };
    }
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        resolve(event.target.result.split(",")[1]);
      } else {
        reject("invalid result");
      }
    };
    reader.readAsDataURL(blob);
  });
};

export { request, blobToBase64 };
