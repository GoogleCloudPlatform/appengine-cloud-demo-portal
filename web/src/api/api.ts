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
