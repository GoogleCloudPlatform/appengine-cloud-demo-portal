import { DataGrid, GridColDef } from "@material-ui/data-grid";

type Props = {
  results: unknown[][];
  groupBy: "title" | "date";
};

const columnsGroupByTitle: GridColDef[] = [
  { field: "id", headerName: "Row", width: 80 },
  { field: "wiki", headerName: "Wiki", width: 150 },
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
  wiki: row[0],
  title: row[1],
  views: (row[2] as number).toLocaleString(),
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
