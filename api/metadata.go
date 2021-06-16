// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
)

const (
	metadataServerHost     = "metadata.google.internal"
	metadataProjectIDPath  = "/computeMetadata/v1/project/project-id"
	metadataRegionPath     = "/computeMetadata/v1/instance/region"
	metadataInstanceIDPath = "/computeMetadata/v1/instance/id"
)

type instanceMetadata struct {
	projectID  string
	region     string
	instanceID string
}

func getMetadata(ctx context.Context) (*instanceMetadata, error) {
	c := &http.Client{}
	md := &instanceMetadata{}

	var err error

	md.projectID, err = getMetadataValue(ctx, c, metadataProjectIDPath)
	if err != nil {
		return nil, err
	}

	md.region, err = getMetadataValue(ctx, c, metadataRegionPath)
	if err != nil {
		return nil, err
	}

	md.instanceID, err = getMetadataValue(ctx, c, metadataInstanceIDPath)
	if err != nil {
		return nil, err
	}

	return md, nil
}

func getMetadataValue(ctx context.Context, c *http.Client, path string) (string, error) {
	req, err := http.NewRequest("GET", "http://"+metadataServerHost+path, nil)
	if err != nil {
		return "", fmt.Errorf("http.NewRequest: %w", err)
	}

	req.Header.Add("Metadata-Flavor", "Google")

	resp, err := c.Do(req.WithContext(ctx))
	if err != nil {
		return "", fmt.Errorf("failed to get metadata %s: %w", path, err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body of %s: %w", path, err)
	}

	return string(body), nil
}
