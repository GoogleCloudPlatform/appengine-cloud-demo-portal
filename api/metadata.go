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
		return "", fmt.Errorf("http.NewRequest: %v", err)
	}

	req.Header.Add("Metadata-Flavor", "Google")

	resp, err := c.Do(req.WithContext(ctx))
	if err != nil {
		return "", fmt.Errorf("failed to get metadata %s: %v", path, err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body of %s: %v", path, err)
	}

	return string(body), nil
}
