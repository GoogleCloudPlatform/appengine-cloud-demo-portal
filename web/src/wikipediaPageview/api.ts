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

import { request, Response } from "../api";

type PostQueriesResponse = {
  jobId: string;
};

type RunQueryArgs = {
  wiki: string;
  titleLike: string;
  startDate: Date;
  endDate: Date;
  orderBy: "desc" | "asc";
  groupBy: "title" | "date";
  queryCache: boolean;
};

const runQuery = async ({
  wiki,
  titleLike,
  startDate,
  endDate,
  orderBy,
  groupBy,
  queryCache,
}: RunQueryArgs): Promise<Response<PostQueriesResponse>> => {
  const data = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    wiki,
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
