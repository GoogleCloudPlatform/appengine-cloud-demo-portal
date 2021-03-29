import Head from "next/head";
import DemoContainer from "../components/DemoContainer";
import { useError } from "../hooks/useError";
import { useTranslation } from "../hooks/useTranslation";
import { demos } from "../src/demos";

const demo = demos["serverlessWebAppWithDevOps"];

const ServerlessWebAppWithDevOps: React.FC = () => {
  const { t } = useTranslation();
  const { errorMessage, onCloseError } = useError();
  return (
    <DemoContainer
      title={t.serverlessWebAppWithDevOps.title}
      description={t.serverlessWebAppWithDevOps.description}
      instructions={t.serverlessWebAppWithDevOps.instructions}
      productIds={demo.products}
      errorMessage={errorMessage}
      onCloseError={onCloseError}
    >
      <Head>
        <title>
          {t.serverlessWebAppWithDevOps.title} | {t.title}
        </title>
      </Head>
    </DemoContainer>
  );
};

export default ServerlessWebAppWithDevOps;
