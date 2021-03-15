import {
  MenuItem,
  Select,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  Theme,
  IconButton,
  Grid,
} from "@material-ui/core";
import { Mic, Stop } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { DisplayRecorder, Canvas } from "./Recorder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 200,
    },
    canvas: {
      borderColor: theme.palette.action.disabled,
      borderWidth: 1,
      borderStyle: "solid",
    },
  })
);

export type OnStopCallback = (lang: string, blob: Blob) => Promise<void>;

type Props = {
  languages: string[];
  defaultLanguage: string;
  onStop: OnStopCallback;
};

const Recorder: React.FC<Props> = ({ languages, defaultLanguage, onStop }) => {
  const classes = useStyles();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [lang, setLang] = useState(defaultLanguage);
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [recorder, setRecorder] = useState<DisplayRecorder | null>(null);

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

  const onChangeLang = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLang(event.target.value as string);
  };

  const onClickStart = async () => {
    if (recorder === null) return;
    setIsRecording(true);
    await recorder.start();
  };

  const onClickStop = () => {
    if (recorder === null) return;
    setIsStopping(true);
    recorder.stop(async (blob: Blob) => await onStop(lang, blob));
    setIsRecording(false);
    setIsStopping(false);
  };

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="lang-selector-label">I speak</InputLabel>
          <Select
            labelId="lang-selector-label"
            id="lang-delector"
            value={lang}
            onChange={onChangeLang}
            label="I speak"
          >
            {languages.map((lang) => (
              <MenuItem value={lang} key={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
