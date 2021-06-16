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

import { HorizontalBar } from "react-chartjs-2";

type Props = {
  results: unknown[][];
};

const TitleViewsChart: React.FC<Props> = ({ results }) => {
  const resultSlice = results.slice(0, 30);

  const labels = resultSlice.map((row) => row[0] as string);
  const values = resultSlice.map((row) => row[1] as number);

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: values,
        borderColor: "#2196f3",
        backgroundColor: "#64b5f6",
      },
    ],
  };

  return <HorizontalBar data={data} height={130} />;
};

export default TitleViewsChart;
