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

package contactcenteranalysis

import "google.golang.org/genproto/googleapis/cloud/language/v1"

type supportedLanguage struct {
	// The languaged as a [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt)
	// language tag for Speech-to-Text.
	// See [Language Support](https://cloud.google.com/speech-to-text/docs/languages).
	Code string `json:"code"`
	Name string `json:"name"`

	punctuation  bool
	languageCode string
}

var (
	languageSupportedFeatures map[string]*language.AnnotateTextRequest_Features = map[string]*language.AnnotateTextRequest_Features{
		"zh": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   false,
			ClassifyText:             false,
		},
		"zh-Hant": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   false,
			ClassifyText:             false,
		},
		"en": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   true,
			ClassifyText:             false,
			// ClassifyText:          true,
		},
		"fr": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   false,
			ClassifyText:             false,
		},
		"de": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   false,
			ClassifyText:             false,
		},
		"it": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   false,
			ClassifyText:             false,
		},
		"ja": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   true,
			ClassifyText:             false,
		},
		"ko": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   false,
			ClassifyText:             false,
		},
		"es": {
			ExtractSyntax:            true,
			ExtractEntities:          true,
			ExtractDocumentSentiment: true,
			ExtractEntitySentiment:   true,
			ClassifyText:             false,
		},
	}

	supportedLanguages []*supportedLanguage = []*supportedLanguage{
		{
			Code:         "zh",
			Name:         "Chinese, Mandarin (Simplified, China)",
			punctuation:  true,
			languageCode: "zh",
		},
		{
			Code:         "zh-TW",
			Name:         "Chinese, Mandarin (Traditional, Taiwan)",
			punctuation:  true,
			languageCode: "zh-Hant",
		},
		{
			Code:         "en-AU",
			Name:         "English (Australia)",
			punctuation:  true,
			languageCode: "en",
		},
		{
			Code:         "en-IN",
			Name:         "English (India)",
			punctuation:  true,
			languageCode: "en",
		},
		{
			Code:         "en-SG",
			Name:         "English (Singapore)",
			punctuation:  true,
			languageCode: "en",
		},
		{
			Code:         "en-GB",
			Name:         "English (United Kingdom)",
			punctuation:  true,
			languageCode: "en",
		},
		{
			Code:         "en-US",
			Name:         "English (United States)",
			punctuation:  true,
			languageCode: "en",
		},
		{
			Code:         "fr-FR",
			Name:         "French (France)",
			punctuation:  true,
			languageCode: "fr",
		},
		{
			Code:         "de-DE",
			Name:         "German (Germany)",
			punctuation:  true,
			languageCode: "de",
		},
		{
			Code:         "it-IT",
			Name:         "Italian (Italy)",
			punctuation:  true,
			languageCode: "it",
		},
		{
			Code:         "ja-JP",
			Name:         "Japanese (Japan)",
			punctuation:  true,
			languageCode: "ja",
		},
		{
			Code:         "ko-KR",
			Name:         "Korean (South Korea)",
			punctuation:  true,
			languageCode: "ko",
		},
		{
			Code:         "es-US",
			Name:         "Spanish (United States)",
			punctuation:  true,
			languageCode: "es",
		},
	}
)
