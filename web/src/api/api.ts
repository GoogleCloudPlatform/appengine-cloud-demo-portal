import axios from "axios";

const apiHost = process.env.apiHost || "localhost:8000";
const protocol = process.env.apiUseSsl === "true" ? "https" : "http";

type Method = "GET" | "POST";

const request = async <Res>(
  path: string,
  method: Method,
  data?: Record<string, unknown>
): Promise<Res> => {
  const url = `${protocol}://${apiHost}/v1${path}`;
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
