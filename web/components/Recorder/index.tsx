import {
  createStyles,
  makeStyles,
  Theme,
  IconButton,
  Grid,
  TextField,
} from "@material-ui/core";
import { Mic, Stop } from "@material-ui/icons";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Autocomplete } from "@material-ui/lab";

import { DisplayRecorder, Canvas } from "./Recorder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 350,
    },
    canvas: {
      borderColor: theme.palette.action.disabled,
      borderWidth: 1,
      borderStyle: "solid",
    },
  })
);

export type Language = {
  name: string;
  code: string;
};

export type OnStopCallback = (
  lang: string,
  duration: number | null,
  blob: Blob
) => Promise<void>;

type Props = {
  languages: Language[];
  defaultLanguage: string;
  onStart: (lang: string) => void;
  onStop: OnStopCallback;
};

const Recorder: React.FC<Props> = ({
  languages,
  defaultLanguage,
  onStart,
  onStop,
}) => {
  const classes = useStyles();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [lang, setLang] = useState(defaultLanguage);
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [recorder, setRecorder] = useState<DisplayRecorder | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }
    const context = canvas.getContext("2d");

    if (context !== null) {
      const arg: Canvas = {
        width: canvas.width,
        height: canvas.height,
        context: context,
      };

      setRecorder(new DisplayRecorder(arg));
    }
  }, []);

  const onChangeLang = (
    _event: ChangeEvent<Record<string, never>>,
    value: Language | null
  ) => {
    if (value === null) {
      return;
    }

    setLang(value.code);
  };

  const onClickStart = async () => {
    if (recorder === null) return;
    setStartTime(Date.now());
    onStart(lang);
    setIsRecording(true);
    await recorder.start();
  };

  const onClickStop = () => {
    if (recorder === null) return;
    setIsStopping(true);
    let duration: number | null;
    if (startTime) {
      duration = Date.now() - startTime;
    }
    recorder.stop(async (blob: Blob) => await onStop(lang, duration, blob));
    setIsRecording(false);
    setIsStopping(false);
  };

  return (
    <Grid container direction="row" alignItems="center" spacing={2}>
      <Grid item>
        <Autocomplete
          options={languages}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="I speak"
              variant="outlined"
              className={classes.formControl}
            />
          )}
          onChange={onChangeLang}
        />
      </Grid>
      <Grid item>
        {isRecording ? (
          <IconButton aria-label="stop-recording" onClick={onClickStop}>
            <Stop />
          </IconButton>
        ) : (
          <IconButton
            aria-label="start-recording"
            onClick={onClickStart}
            disabled={isStopping}
          >
            <Mic />
          </IconButton>
        )}
      </Grid>
      <Grid item>
        <canvas ref={canvasRef} height="60px" className={classes.canvas} />
      </Grid>
    </Grid>
  );
};

export default Recorder;
