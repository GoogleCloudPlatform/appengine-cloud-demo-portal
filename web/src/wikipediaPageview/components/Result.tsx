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
import { useEffect, useState } from "react";

import Code from "../../../components/Code";
import { SetErrorMessage } from "../../../hooks/useError";
import { Job } from "../../../pages/wikipediaPageview";
import { getJob, GetJobResponse } from "../api";
import ResultTable from "./ResultTable";

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

const Result: React.FC<Props> = ({ jobId, groupBy, setErrorMessage }) => {
  const classes = useStyles();

  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [tab, setTab] = useState(0);

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
        <Tab label="visualization" />
        <Tab label="results" />
        <Tab label="sql" />
        <Tab label="job information" />
      </Tabs>

      <Box hidden={tab !== 1}>
        {jobResult.results ? (
          <ResultTable results={jobResult.results} groupBy={groupBy} />
        ) : null}
      </Box>

      <Box hidden={tab !== 2}>
        <Grid container direction="row" spacing={2} alignItems="flex-start">
          <Grid item>
            <Typography variant="subtitle1">Parameters</Typography>
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
          <Grid item>
            <Code language="sql">{jobResult.sql.sql}</Code>
          </Grid>
        </Grid>
      </Box>

      <Box hidden={tab !== 3}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Start time</TableCell>
                <TableCell>{jobInfo.startTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>End time</TableCell>
                <TableCell>{jobInfo.endTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duration</TableCell>
                <TableCell>{jobInfo.duration}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bytes processed</TableCell>
                <TableCell>
                  {jobInfo.bytesProcessed?.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Input rows</TableCell>
                <TableCell>{jobInfo.inputRows?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cache hit</TableCell>
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
