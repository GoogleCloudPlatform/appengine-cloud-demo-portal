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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import Head from "next/head";
import { useState } from "react";

import DemoContainer from "../components/DemoContainer";
import DemoContent from "../components/DemoContent";
import Image from "../components/Image";
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
            <Grid container direction="row" spacing={2}>
              <Grid item sm={12} md={6}>
                <Image
                  src="/static/wikipediaPageview/preview.png"
                  alt="preview of wikipedia pageview table"
                  width={895}
                  height={508}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <Typography variant="body1">
                  {t.wikipediaPageview.tableInformationContent}
                </Typography>
              </Grid>
            </Grid>
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
