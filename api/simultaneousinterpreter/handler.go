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

package simultaneousinterpreter

import (
	"encoding/csv"
	"strings"

	"github.com/go-chi/chi/v5"

	"github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/api/pkg/client"
)

type handler struct {
	*client.Clients

	speechSupportedLanguages []*supportedLanguage
}

func newHandler(clients *client.Clients) *handler {
	h := &handler{
		Clients:                  clients,
		speechSupportedLanguages: []*supportedLanguage{},
	}

	r := csv.NewReader(strings.NewReader(speechSupportedLanguagesCSV))

	records, err := r.ReadAll()
	if err != nil {
		panic(err)
	}

	for _, record := range records {
		h.speechSupportedLanguages = append(h.speechSupportedLanguages, &supportedLanguage{
			Name: record[0],
			Code: record[1],
		})
	}

	return h
}

// Router returns a function to route requests with chi.
func Router(clients *client.Clients) func(r chi.Router) {
	h := newHandler(clients)

	return func(r chi.Router) {
		r.Get("/languages", h.getLanguages)
		r.Post("/speech:translate", h.translateSpeech)
	}
}

const speechSupportedLanguagesCSV = `Afrikaans (South Africa),af-ZA
Albanian (Albania),sq-AL
Amharic (Ethiopia),am-ET
Arabic (Algeria),ar-DZ
Arabic (Bahrain),ar-BH
Arabic (Egypt),ar-EG
Arabic (Iraq),ar-IQ
Arabic (Israel),ar-IL
Arabic (Jordan),ar-JO
Arabic (Kuwait),ar-KW
Arabic (Lebanon),ar-LB
Arabic (Morocco),ar-MA
Arabic (Oman),ar-OM
Arabic (Qatar),ar-QA
Arabic (Saudi Arabia),ar-SA
Arabic (State of Palestine),ar-PS
Arabic (Tunisia),ar-TN
Arabic (United Arab Emirates),ar-AE
Arabic (Yemen),ar-YE
Armenian (Armenia),hy-AM
Azerbaijani (Azerbaijan),az-AZ
Basque (Spain),eu-ES
Bengali (Bangladesh),bn-BD
Bengali (India),bn-IN
Bosnian (Bosnia and Herzegovina),bs-BA
Bulgarian (Bulgaria),bg-BG
Burmese (Myanmar),my-MM
Catalan (Spain),ca-ES
"Chinese, Cantonese (Traditional Hong Kong)",yue-Hant-HK
"Chinese, Mandarin (Simplified, China)",zh (cmn-Hans-CN)
"Chinese, Mandarin (Traditional, Taiwan)",zh-TW (cmn-Hant-TW)
Croatian (Croatia),hr-HR
Czech (Czech Republic),cs-CZ
Danish (Denmark),da-DK
Dutch (Belgium),nl-BE
Dutch (Netherlands),nl-NL
English (Australia),en-AU
English (Canada),en-CA
English (Ghana),en-GH
English (Hong Kong),en-HK
English (India),en-IN
English (Ireland),en-IE
English (Kenya),en-KE
English (New Zealand),en-NZ
English (Nigeria),en-NG
English (Pakistan),en-PK
English (Philippines),en-PH
English (Singapore),en-SG
English (South Africa),en-ZA
English (Tanzania),en-TZ
English (United Kingdom),en-GB
English (United States),en-US
Estonian (Estonia),et-EE
Filipino (Philippines),fil-PH
Finnish (Finland),fi-FI
French (Belgium),fr-BE
French (Canada),fr-CA
French (France),fr-FR
French (Switzerland),fr-CH
Galician (Spain),gl-ES
Georgian (Georgia),ka-GE
German (Austria),de-AT
German (Germany),de-DE
German (Switzerland),de-CH
Greek (Greece),el-GR
Gujarati (India),gu-IN
Hebrew (Israel),iw-IL
Hindi (India),hi-IN
Hungarian (Hungary),hu-HU
Icelandic (Iceland),is-IS
Indonesian (Indonesia),id-ID
Italian (Italy),it-IT
Italian (Switzerland),it-CH
Japanese (Japan),ja-JP
Javanese (Indonesia),jv-ID
Kannada (India),kn-IN
Kazakh (Kazakhstan),kk-KZ
Khmer (Cambodia),km-KH
Korean (South Korea),ko-KR
Lao (Laos),lo-LA
Latvian (Latvia),lv-LV
Lithuanian (Lithuania),lt-LT
Macedonian (North Macedonia),mk-MK
Malay (Malaysia),ms-MY
Malayalam (India),ml-IN
Marathi (India),mr-IN
Mongolian (Mongolia),mn-MN
Nepali (Nepal),ne-NP
Norwegian Bokmål (Norway),no-NO
Persian (Iran),fa-IR
Polish (Poland),pl-PL
Portuguese (Brazil),pt-BR
Portuguese (Portugal),pt-PT
Punjabi (Gurmukhi India),pa-Guru-IN
Romanian (Romania),ro-RO
Russian (Russia),ru-RU
Serbian (Serbia),sr-RS
Sinhala (Sri Lanka),si-LK
Slovak (Slovakia),sk-SK
Slovenian (Slovenia),sl-SI
Spanish (Argentina),es-AR
Spanish (Bolivia),es-BO
Spanish (Chile),es-CL
Spanish (Colombia),es-CO
Spanish (Costa Rica),es-CR
Spanish (Dominican Republic),es-DO
Spanish (Ecuador),es-EC
Spanish (El Salvador),es-SV
Spanish (Guatemala),es-GT
Spanish (Honduras),es-HN
Spanish (Mexico),es-MX
Spanish (Nicaragua),es-NI
Spanish (Panama),es-PA
Spanish (Paraguay),es-PY
Spanish (Peru),es-PE
Spanish (Puerto Rico),es-PR
Spanish (Spain),es-ES
Spanish (United States),es-US
Spanish (Uruguay),es-UY
Spanish (Venezuela),es-VE
Sundanese (Indonesia),su-ID
Swahili (Kenya),sw-KE
Swahili (Tanzania),sw-TZ
Swedish (Sweden),sv-SE
Tamil (India),ta-IN
Tamil (Malaysia),ta-MY
Tamil (Singapore),ta-SG
Tamil (Sri Lanka),ta-LK
Telugu (India),te-IN
Thai (Thailand),th-TH
Turkish (Turkey),tr-TR
Ukrainian (Ukraine),uk-UA
Urdu (India),ur-IN
Urdu (Pakistan),ur-PK
Uzbek (Uzbekistan),uz-UZ
Vietnamese (Vietnam),vi-VN
Zulu (South Africa),zu-ZA
`
