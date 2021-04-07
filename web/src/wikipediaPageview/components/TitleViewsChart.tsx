import { HorizontalBar } from "react-chartjs-2";

type Props = {
  results: unknown[][];
};

const TitleViewsChart: React.FC<Props> = ({ results }) => {
  const resultSlice = results.slice(0, 50);

  const labels = resultSlice.map(
    (row) => `[${row[0] as string}] ${row[1] as string}`
  );
  const values = resultSlice.map((row) => row[2] as number);

  const data = {
    labels,
    datasets: [
      {
        label: "Views (Top 50)",
        data: values,
        borderColor: "#2196f3",
        backgroundColor: "#64b5f6",
      },
    ],
  };

  return <HorizontalBar data={data} />;
};

export default TitleViewsChart;
