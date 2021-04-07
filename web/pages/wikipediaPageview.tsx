import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import Head from "next/head";
import { useState } from "react";

import DemoContainer from "../components/DemoContainer";
import DemoContent from "../components/DemoContent";
import { useError } from "../hooks/useError";
import { useTranslation } from "../hooks/useTranslation";
import { demos } from "../src/demos";
import Controller from "../src/wikipediaPageview/components/Controller";
import Result from "../src/wikipediaPageview/components/Result";

const demo = demos["wikipediaPageview"];

export type Job = {
  jobId: string;
  groupBy: "title" | "date";
};

const WikipediaPageview: React.FC = () => {
  const { t } = useTranslation();
  const { errorMessage, setErrorMessage, onCloseError } = useError();

  const [jobs, setJobs] = useState<Job[]>([]);
  const addJob = (job: Job) => setJobs((jobs) => [job, ...jobs]);

  return (
    <DemoContainer
      title={t.wikipediaPageview.title}
      description={t.wikipediaPageview.description}
      instructions={t.wikipediaPageview.instructions}
      productIds={demo.products}
      errorMessage={errorMessage}
      onCloseError={onCloseError}
    >
      <Head>
        <title>
          {t.wikipediaPageview.title} | {t.title}
        </title>
      </Head>
      <DemoContent>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="table-information"
            id="table-information"
          >
            <Typography variant="subtitle1">
              {t.wikipediaPageview.tableInformation}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              {t.wikipediaPageview.tableInformationContent}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </DemoContent>
      <DemoContent>
        <Controller setErrorMessage={setErrorMessage} addJob={addJob} />
      </DemoContent>
      {jobs.map((job) => (
        <DemoContent key={job.jobId}>
          <Result
            jobId={job.jobId}
            groupBy={job.groupBy}
            setErrorMessage={setErrorMessage}
          />
        </DemoContent>
      ))}
    </DemoContainer>
  );
};

export default WikipediaPageview;
