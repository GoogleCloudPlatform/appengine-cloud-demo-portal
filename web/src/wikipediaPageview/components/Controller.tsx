import { useState } from "react";
import {
  Grid,
  makeStyles,
  createStyles,
  TextField,
  Theme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  OutlinedInput,
  Switch,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { PlayCircleFilled } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker } from "@material-ui/pickers";

import { SetErrorMessage } from "../../../hooks/useError";
import { Job } from "../../../pages/wikipediaPageview";
import { runQuery } from "../api";

const minDate = new Date("2020-01-01");
const maxDate = new Date("2020-12-31");
const defaultStartDate = new Date("2020-12-01");
const defaultEndDate = new Date("2020-12-31");

type Props = {
  setErrorMessage: SetErrorMessage;
  addJob: (job: Job) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wiki: {
      minWidth: 150,
    },
    datePicker: {
      width: 200,
      "& .MuiFormControl-marginNormal": {
        margin: 0,
      },
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    progress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

const Controller: React.FC<Props> = ({ setErrorMessage, addJob }) => {
  const classes = useStyles();

  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState("");
  const [titleLike, setTitleLike] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [orderBy, setOrderBy] = useState<"desc" | "asc">("desc");
  const [groupBy, setGroupBy] = useState<"title" | "date">("title");
  const [queryCache, setQueryCache] = useState(false);

  const onChangeLanguage = (
    event: React.ChangeEvent<unknown>,
    value: string | null
  ) => {
    if (value) {
      setLanguage(value);
    }
  };
  const onChangeTitleLike = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setTitleLike(event.target.value);
  const onChangeStartDate = (date: Date | null) => setStartDate(date);
  const onChangeEndDate = (date: Date | null) => setEndDate(date);
  const onChangeOrderBy = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value === "desc" || value === "asc") {
      setOrderBy(value);
    }
  };
  const onChangeGroupBy = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value === "title" || value === "date") {
      setGroupBy(value);
    }
  };
  const onChangeQueryCache = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => setQueryCache(checked);

  const requestRunQuery = async () => {
    if (!startDate || !endDate) {
      return;
    }

    setRunning(true);

    const res = await runQuery({
      language,
      titleLike,
      startDate,
      endDate,
      orderBy,
      groupBy,
      queryCache,
    });

    if (res.success) {
      addJob({ jobId: res.data.jobId, groupBy });
    } else {
      setErrorMessage(`failed to run query: ${res.error.message}.`);
    }

    setRunning(false);
  };

  return (
    <Grid container direction="row" spacing={4} alignItems="flex-start">
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Autocomplete
              disabled={running}
              options={["ja", "en"]}
              getOptionLabel={(option) => option}
              getOptionSelected={(option, value) => option == value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Language"
                  variant="outlined"
                  className={classes.wiki}
                />
              )}
              onChange={onChangeLanguage}
            />
          </Grid>
          <Grid item>
            <FormControl variant="outlined" disabled={running}>
              <InputLabel htmlFor="title-like">Title includes</InputLabel>
              <OutlinedInput
                value={titleLike}
                onChange={onChangeTitleLike}
                labelWidth={100}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item className={classes.datePicker}>
            <KeyboardDatePicker
              disabled={running}
              disableToolbar
              inputVariant="outlined"
              variant="inline"
              format="yyyy-MM-dd"
              margin="normal"
              id="start-date"
              label="Start date"
              value={startDate}
              onChange={onChangeStartDate}
              minDate={minDate}
              maxDate={endDate}
            />
          </Grid>
          <Grid item className={classes.datePicker}>
            <KeyboardDatePicker
              disabled={running}
              disableToolbar
              inputVariant="outlined"
              variant="inline"
              format="yyyy-MM-dd"
              margin="normal"
              id="end-date"
              label="End date"
              value={endDate}
              onChange={onChangeEndDate}
              minDate={startDate}
              maxDate={maxDate}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <FormControl component="fieldset" disabled={running}>
          <FormLabel component="legend">Order by</FormLabel>
          <RadioGroup
            aria-label="order by"
            name="order-by"
            value={orderBy}
            onChange={onChangeOrderBy}
          >
            <FormControlLabel
              value="desc"
              control={<Radio />}
              label="Descending"
            />
            <FormControlLabel
              value="asc"
              control={<Radio />}
              label="Ascending"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl component="fieldset" disabled={running}>
          <FormLabel component="legend">Group by</FormLabel>
          <RadioGroup
            aria-label="group by"
            name="group-by"
            value={groupBy}
            onChange={onChangeGroupBy}
          >
            <FormControlLabel value="title" control={<Radio />} label="Title" />
            <FormControlLabel value="date" control={<Radio />} label="Date" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <FormControlLabel
              disabled={running}
              control={
                <Switch
                  checked={queryCache}
                  onChange={onChangeQueryCache}
                  color="primary"
                />
              }
              label="Query cache"
            />
          </Grid>
          <Grid item>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={running}
                onClick={requestRunQuery}
                startIcon={<PlayCircleFilled />}
              >
                Run query
              </Button>
              {running && (
                <CircularProgress size={24} className={classes.progress} />
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Controller;
