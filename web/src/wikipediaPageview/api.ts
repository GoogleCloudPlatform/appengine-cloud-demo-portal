import { request, Response } from "../api/api";

type PostQueriesResponse = {
  jobId: string;
};

type RunQueryArgs = {
  language: string;
  titleLike: string;
  startDate: Date;
  endDate: Date;
  orderBy: "desc" | "asc";
  groupBy: "title" | "date";
  queryCache: boolean;
};

const runQuery = async ({
  language,
  titleLike,
  startDate,
  endDate,
  orderBy,
  groupBy,
  queryCache,
}: RunQueryArgs): Promise<Response<PostQueriesResponse>> => {
  const data = {
    wiki: language,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    titleLike,
    orderBy,
    groupBy,
    queryCache,
  };

  return await request<PostQueriesResponse>(
    "/wikipediaPageview/queries",
    "POST",
    data
  );
};

export type GetJobResponse = {
  completed: boolean;
  error?: string;
  config: {
    query: string;
    queryCache: boolean;
    parameters: {
      name: string;
      value: string;
    }[];
  };
  statistics?: {
    startTime: string;
    endTime: string;
    totalBytesProcessed: number;
    cacheHit: boolean;
    inputRows: number;
  };
  results?: unknown[][];
};

const getJob = async (jobId: string): Promise<Response<GetJobResponse>> =>
  await request<GetJobResponse>(`/wikipediaPageview/jobs/${jobId}`, "GET");

export { runQuery, getJob };
