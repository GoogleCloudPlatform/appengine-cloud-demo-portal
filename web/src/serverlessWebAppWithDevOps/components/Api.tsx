import { Box, Typography } from "@material-ui/core";

import { useTranslation } from "../../../hooks/useTranslation";

type Props = {
  hidden: boolean;
};

const Api: React.FC<Props> = ({ hidden }) => {
  const { t } = useTranslation();
  const tp = t.serverlessWebAppWithDevOps.gettingStarted;

  return (
    <Box hidden={hidden}>
      <Typography variant="h4" component="h3">
        {tp.overview}
      </Typography>
      <Typography variant="body1" component="p">
        hogehoge
      </Typography>
    </Box>
  );
};

export default Api;
