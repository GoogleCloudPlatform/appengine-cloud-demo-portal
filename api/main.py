from enum import Enum
from typing import List

import base64
import os
import subprocess
import tempfile

from fastapi import FastAPI, HTTPException
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from google.cloud import speech
from google.cloud import language_v1 as language

from cloud_speech.languages import LANGUAGES as speech_languages
from natural_language.languages import LANGUAGES as nl_languages


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*'],
)


speech_client = speech.SpeechClient()
language_client = language.LanguageServiceClient()


class LanguageSupport(BaseModel):
    name: str = Field(..., example='English (Singapore)')
    code: str = Field(..., example='en-SG')


class GetLanguagesResponse(BaseModel):
    languages: List[LanguageSupport] = Field(..., example=['en-US', 'ja-JP'])


@app.get('/v1/contactCenterAnalysis/languages', response_model=GetLanguagesResponse)
async def get_languages():
    codes = speech_languages.keys()
    languages = map(
        lambda c: {'name': speech_languages[c]['name'], 'code': c},
        codes,
    )
    languages = filter(
        lambda l: speech_languages[l['code']]['language'] in nl_languages,
        languages,
    )
    return {"languages": list(languages)}


class RecognitionAudio(BaseModel):
    content: str = Field(..., example='pVZUW+DQUkYgzxIgkUOaS+d2nO8Mw3BxKxZh7WxYbii81556zoQdEMWQ==')


class RecognitionConfig(BaseModel):
    language_code: str = Field(..., example='en-US', alias='languageCode')


class SpeechAnalyzeRequest(BaseModel):
    audio: RecognitionAudio = Field(...)
    config: RecognitionConfig = Field(...)


class DocumentType(Enum):
    PLAIN_TEXT = 'PLAIN_TEXT'


class Document(BaseModel):
    type: DocumentType = Field(..., example='PLAIN_TEXT')
    language: str = Field(..., example='en-US')
    content: str = Field(..., example='Google, headquartered in Mountain View ...')


class EntityType(str, Enum):
    UNKNOWN = 'UNKNOWN'
    PERSON = 'PERSON'
    LOCATION = 'LOCATION'
    ORGANIZATION = 'ORGANIZATION'
    EVENT = 'EVENT'
    WORK_OF_ART = 'WORK_OF_ART'
    CONSUMER_GOOD = 'CONSUMER_GOOD'
    OTHER = 'OTHER'
    PHONE_NUMBER = 'PHONE_NUMBER'
    ADDRESS = 'ADDRESS'
    DATE = 'DATE'
    NUMBER = 'NUMBER'
    PRICE = 'PRICE'


class TextSpan(BaseModel):
    content: str = Field(..., example='Google')
    begin_offset: int = Field(..., example=0, alias='beginOffset')


class EntityMentionType(Enum):
    TYPE_UNKNOWN = 'TYPE_UNKNOWN'
    PROPER = 'PROPER'
    COMMON = 'COMMON'


class EntityMention(BaseModel):
    text: TextSpan
    type: EntityMentionType = Field(..., example=EntityMentionType.PROPER)


class Entity(BaseModel):
    name: str = Field(..., example='Google')
    type: EntityType = Field(..., example=EntityType.ORGANIZATION)
    metadata: dict[str, str] = Field(..., example={'wikipedia_url': 'https://en.wikipedia.org/wiki/Google'})
    salience: float = Field(..., example=0.19)
    mentions: List[EntityMention] = Field(...)

    class Config:
        use_enum_values = True


class Sentiment(BaseModel):
    magnitude: float = Field(..., example=0.5)
    score: float = Field(..., example=0.2)


class ClassificationCategory(BaseModel):
    name: str = Field(..., example='/Internet & Telecom/Mobile & Wireless')
    confidence: float = Field(..., example=0.59)


class SpeechAnalyzeResponse(BaseModel):
    document: Document
    entities: List[Entity]
    document_sentiment: Sentiment = Field(..., alias='documentSentiment')
    language: str = Field(..., example='en-US')
    categories: List[ClassificationCategory]


@app.post('/v1/contactCenterAnalysis/speech:analyze', response_model=SpeechAnalyzeResponse)
async def analyze_speech(data: SpeechAnalyzeRequest):
    language_code = data.config.language_code
    audio_bytes = base64.b64decode(data.audio.content)

    with tempfile.TemporaryDirectory() as tmpdir:
        src_file = os.path.join(tmpdir, 'src.ogg')
        dst_file = os.path.join(tmpdir, 'dst.wav')

        with open(src_file, 'w+b') as src:
            src.write(audio_bytes)
            src.flush()

            res = subprocess.run(
                ['ffmpeg', '-i', src_file, dst_file],
                capture_output=True,
            )
            logger.info(res)
            # TODO: res.returncode != 0 => internal error

        with open(dst_file, 'rb') as dst:
            content = dst.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding='LINEAR16',
        sample_rate_hertz=48000,
        language_code=language_code)

    speech_response = speech_client.recognize(config=config, audio=audio)

    if len(speech_response.results) == 0:
        raise HTTPException(status_code=400, detail='No text was recognized')

    text = speech_response.results[0].alternatives[0].transcript

    lang = speech_languages[language_code]['language']
    nl_lang_support = nl_languages[lang]
    language_response = language_client.annotate_text(request={
        'document': {
            'content': text,
            'type_': language.Document.Type.PLAIN_TEXT,
            'language': lang,
        },
        'features': {
            'extract_syntax': nl_lang_support['extract_syntax'],
            'extract_entities': nl_lang_support['extract_entities'],
            'extract_document_sentiment': nl_lang_support['extract_document_sentiment'],
            'extract_entity_sentiment': nl_lang_support['extract_entity_sentiment'],
            'classify_text': nl_lang_support['classify_text'],
        },
        'encoding_type': language.EncodingType.UTF8,
    })

    entities = []
    for entity in language_response.entities:
        mentions = []
        for mention in entity.mentions:
            mentions.append({
                'text': {
                    'content': mention.text.content,
                    'beginOffset': mention.text.begin_offset,
                },
                'type': mention.type_.name,
            })
            print(mention.text.content, mention.text.begin_offset)

        entities.append({
            'name': entity.name,
            'type': entity.type_.name,
            'metadata': dict(entity.metadata),
            'salience': entity.salience,
            'mentions': mentions,
        })

    document_sentiment = {
        'magnitude': language_response.document_sentiment.magnitude,
        'score': language_response.document_sentiment.score,
    }

    categories = []
    for category in language_response.categories:
        categories.append({
            'name': category.name,
            'confidence': category.confidence,
        })

    response = {
        'document': {
            'type': 'PLAIN_TEXT',
            'language': data.config.language_code,
            'content': text,
        },
        'entities': entities,
        'documentSentiment': document_sentiment,
        'language': language_code,
        'categories': categories,
    }

    return response
