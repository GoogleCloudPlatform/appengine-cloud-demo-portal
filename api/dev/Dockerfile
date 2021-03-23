FROM golang:1.15.10-buster

ENV GO111MODULE "on"

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/* \
  && GO111MODULE="off" go get -u github.com/oxequa/realize

CMD ["realize", "start"]
