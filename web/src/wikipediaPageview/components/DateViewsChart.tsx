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
