import applyCaseMiddleware from "axios-case-converter";
import axios from "axios";

type Method = "GET" | "POST";

const client = applyCaseMiddleware(axios.create());

const request = async <Res>(
  path: string,
  method: Method,
  data?: Record<string, unknown>
): Promise<Res> => {
  const url = `/api/v1${path}`;
  const res = await client.request<Res>({
    url,
    method,
    responseType: "json",
    data,
  });

  if (res.status >= 400) {
    console.error(res);
    throw new Error(`failed to request to ${url}: ${res.status}`);
  }

  return res.data;
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
