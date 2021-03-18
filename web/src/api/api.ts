import axios from "axios";

type Method = "GET" | "POST";

const request = async <Res>(
  path: string,
  method: Method,
  data?: Record<string, unknown>
): Promise<Res> => {
  const url = `/api/v1${path}`;
  const res = await axios.request<Res>({
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

export { request };
