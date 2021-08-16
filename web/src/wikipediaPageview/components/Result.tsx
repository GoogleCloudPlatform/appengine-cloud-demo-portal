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

import {
  Box,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Theme,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";

import Code from "../../../components/Code";
import { SetErrorMessage } from "../../../hooks/useError";
import { useTranslation } from "../../../hooks/useTranslation";
import { Job } from "../../../pages/wikipediaPageview";
import { getJob, GetJobResponse } from "../api";
import DateViewsChart from "./DateViewsChart";
import ResultTable from "./ResultTable";
import TitleViewsChart from "./TitleViewsChart";

const getJobInterval = 1000;

type JobResult = {
  results: unknown[][] | undefined;
  sql: {
    sql: string;
    parameters: { name: string; value: string }[];
  };
  jobInformation: {
    startTime: string | undefined;
    endTime: string | undefined;
    duration: string | null;
    bytesProcessed: number | undefined;
    inputRows: number | undefined;
    cacheHit: boolean | undefined;
  };
};

type Props = Job & { setErrorMessage: SetErrorMessage };

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      marginBottom: theme.spacing(2),
    },
  })
);

const calcDuration = (data: GetJobResponse): string | null => {
  if (data.statistics) {
    const endTime = new Date(data.statistics.endTime);
    const startTime = new Date(data.statistics.startTime);
    const ms = endTime.getTime() - startTime.getTime();

    if (ms < 1000) {
      return `${ms} ms`;
    } else if (ms < 60000) {
      return `${ms / 1000} s`;
    } else {
      return `${ms / 1000 / 60} m`;
    }
  } else {
    return null;
  }
};

const SIPrefixes: Record<number, string> = {
  0: "",
  3: "k",
  6: "M",
  9: "G",
  12: "T",
  15: "P",
};

const formatSI = (num: number): string => {
  let exponent = 0;

  while (num >= 1000 && exponent < 15) {
    num /= 1000;
    exponent += 3;
  }

  return num.toPrecision(3) + SIPrefixes[exponent];
};

const Result: React.FC<Props> = ({ jobId, groupBy, setErrorMessage }) => {
  const classes = useStyles();
  const { t, locale } = useTranslation();
  const tt = t.wikipediaPageview.result;

  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [tab, setTab] = useState(0);

  const fmt = useMemo(
    () => Intl.NumberFormat(locale as string, { notation: "compact" }),
    [locale]
  );

  const completeWithError = (error: string) => {
    setCompleted(true);
    setError(error);
  };

  const onChangeTab = (
    _event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTab(newValue);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const f = async () => {
        try {
          const res = await getJob(jobId);

          if (res.success) {
            if (!res.data.completed) return;

            if (res.data.error) {
              completeWithError(`Job error: ${res.data.error}`);
            } else {
              setJobResult({
                results: res.data.results,
                sql: {
                  sql: res.data.config.query,
                  parameters: res.data.config.parameters,
                },
                jobInformation: {
                  startTime: res.data.statistics?.startTime,
                  endTime: res.data.statistics?.endTime,
                  duration: calcDuration(res.data),
                  bytesProcessed: res.data.statistics?.totalBytesProcessed,
                  inputRows: res.data.statistics?.inputRows,
                  cacheHit: res.data.statistics?.cacheHit,
                },
              });
              setCompleted(true);
            }

            clearInterval(interval);
          } else {
            setErrorMessage(`failed to get job: ${res.error.message}.`);
            completeWithError(`failed to get job: ${res.error.message}.`);
            clearInterval(interval);
          }
        } catch (e) {
          console.log(e);
          completeWithError("Server error");
          clearInterval(interval);
        }
      };

      void f();
    }, getJobInterval);

    return () => {
      clearInterval(interval);
    };
  }, [jobId, setErrorMessage]);

  if (!completed) {
    return (
      <>
        <LinearProgress />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!jobResult) {
    return <Typography>error</Typography>;
  }

  const jobInfo = jobResult.jobInformation;

  return (
    <>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        value={tab}
        onChange={onChangeTab}
        className={classes.tabs}
      >
        <Tab label={tt.visualization} />
        <Tab label={tt.results} />
        <Tab label="sql" />
        <Tab label={tt.jobInformation} />
      </Tabs>

      <Box hidden={tab !== 0} style={{ height: 484 }}>
        {jobResult.results ? (
          groupBy === "title" ? (
            <TitleViewsChart results={jobResult.results} />
          ) : (
            <DateViewsChart results={jobResult.results} />
          )
        ) : null}
      </Box>

      <Box hidden={tab !== 1} style={{ height: 484 }}>
        {jobResult.results ? (
          <ResultTable results={jobResult.results} groupBy={groupBy} />
        ) : null}
      </Box>

      <Box hidden={tab !== 2} style={{ height: 484 }}>
        <Grid container direction="row" spacing={2} alignItems="flex-start">
          <Grid item>
            <Typography variant="subtitle1">{tt.parameters}</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobResult.sql.parameters.map(({ name, value }, i) => (
                    <TableRow key={i}>
                      <TableCell>@{name}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item style={{ flexGrow: 1, height: "100%" }}>
            <Code language="sql">{jobResult.sql.sql}</Code>
          </Grid>
        </Grid>
      </Box>

      <Box hidden={tab !== 3} style={{ height: 484 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{tt.startTime}</TableCell>
                <TableCell>{jobInfo.startTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{tt.endTime}</TableCell>
                <TableCell>{jobInfo.endTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{tt.duration}</TableCell>
                <TableCell>{jobInfo.duration}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{tt.bytesProcessed}</TableCell>
                <TableCell>
                  {formatSI(jobInfo.bytesProcessed || -1)}B (
                  {jobInfo.bytesProcessed?.toLocaleString()} bytes)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{tt.inputRows}</TableCell>
                <TableCell>
                  {fmt.format(jobInfo.inputRows || -1)}
                  {tt.lineUnit} ({jobInfo.inputRows?.toLocaleString()}
                  {tt.lineUnit})
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{tt.cacheHit}</TableCell>
                <TableCell>
                  {typeof jobInfo.cacheHit === "undefined"
                    ? ""
                    : jobInfo.cacheHit.toString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Result;
