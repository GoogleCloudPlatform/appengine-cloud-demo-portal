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

import { DataGrid, GridColDef } from "@material-ui/data-grid";

type Props = {
  results: unknown[][];
  groupBy: "title" | "date";
};

const columnsGroupByTitle: GridColDef[] = [
  { field: "id", headerName: "Row", width: 80 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "views", headerName: "Views", width: 200 },
];

const columnsGroupByDate: GridColDef[] = [
  { field: "id", headerName: "Row", width: 80 },
  { field: "date", headerName: "Date", width: 150 },
  { field: "views", headerName: "Views", width: 200 },
];

const rowGroupByTitle = (
  row: unknown[],
  i: number
): Record<string, unknown> => ({
  id: i,
  title: row[0],
  views: (row[1] as number).toLocaleString(),
});

const rowGroupByDate = (
  row: unknown[],
  i: number
): Record<string, unknown> => ({
  id: i,
  date: row[0],
  views: (row[1] as number).toLocaleString(),
});

const ResultTable: React.FC<Props> = ({ results, groupBy }) => {
  const columns =
    groupBy === "title" ? columnsGroupByTitle : columnsGroupByDate;

  const mapFn = groupBy === "title" ? rowGroupByTitle : rowGroupByDate;
  const rows: Record<string, unknown>[] = results.map(mapFn);

  return (
    <div style={{ height: 460, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} rowHeight={35} />
    </div>
  );
};

export default ResultTable;
