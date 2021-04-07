import { Line } from "react-chartjs-2";

type Props = {
  results: unknown[][];
};

const DateViewsChart: React.FC<Props> = ({ results }) => {
  const sorted = [...results].sort((a, b) => {
    const aDate = new Date(a[0] as string);
    const bDate = new Date(b[0] as string);
    return aDate.getTime() - bDate.getTime();
  });

  const labels = sorted.map((row) => row[0] as string);
  const values = sorted.map((row) => row[1] as number);

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: values,
        fill: false,
        borderColor: "#2196f3",
      },
    ],
  };

  return <Line data={data} height={130} />;
};

export default DateViewsChart;
