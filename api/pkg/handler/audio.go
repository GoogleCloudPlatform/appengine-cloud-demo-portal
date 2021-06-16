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

package handler

import (
	"context"
	"encoding/base64"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

// Base64ToWave converts audio encoded in base64 into wave.
func Base64ToWave(ctx context.Context, content string) ([]byte, error) {
	audio, err := base64.StdEncoding.DecodeString(content)
	if err != nil {
		return nil, Errorf(ctx,
			http.StatusBadRequest,
			"invalid encoded audio",
			"failed to decode base64: %w", err)
	}

	dir, err := ioutil.TempDir("", "clouddemo")
	if err != nil {
		return nil, Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to create tempdir: %w", err)
	}
	defer os.RemoveAll(dir)

	srcFile := filepath.Join(dir, "src.ogg")
	dstFile := filepath.Join(dir, "dst.wav")

	if err := ioutil.WriteFile(srcFile, audio, 0600); err != nil {
		return nil, Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to write file: %s: %w", srcFile, err)
	}

	if err := exec.Command("ffmpeg", "-i", srcFile, dstFile).Run(); err != nil {
		return nil, Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to exec ffmpeg: %w", err)
	}

	wav, err := ioutil.ReadFile(dstFile)
	if err != nil {
		return nil, Errorf(ctx,
			http.StatusInternalServerError,
			http.StatusText(http.StatusInternalServerError),
			"failed to read wav file: %s: %w", dstFile, err)
	}

	return wav, nil
}
