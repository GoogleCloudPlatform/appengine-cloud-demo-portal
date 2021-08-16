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

import { Locale } from "./type";

const ja: Locale = {
  title: "Google Cloud デモポータル",
  changeLanguage: "言語を切り替える",
  howToUse: "使い方",
  home: {},
  readme: {
    title: "README",
    description: "利用前に読んでください。",
  },
  contactCenterAnalysis: {
    title: "コールセンター分析",
    description:
      "コールセンターでの顧客の声について感情の分析とエンティティの特定を実行します。",
    instructions: [
      "話す言語を選んでください。",
      "マイクボタンを押して、選んだ言語で何か話してください。",
      "ストップボタンを押してください。",
      "少し待つと結果が表示されます。",
      "連続して実行すると、新しい結果が一番上に表示されます。",
    ],
  },
  serverlessWebAppWithDevOps: {
    title: "サーバーレス ウェブアプリとDevOps",
    description:
      "このデモサイトはサーバーレスCI/CDプラットフォームからデプロイされ、サーバーレスアプリケーションプラットフォームで稼働しています。",
    instructions: [
      "操作はありません。",
      "アーキテクチャとソースコードを見てください。",
    ],
    gettingStarted: {
      overview: "概要",
      appConfiguration: "App Engine構成",
      buildConfiguration: "Cloud Build構成",
      web: {
        overview:
          "Web フロントエンドはTypeScriptとNext.jsで開発されています。" +
          "開発者がGitHubのmainブランチにコードをプッシュすると、GitHubからのウェブフックによりCloud Buildが実行されます。" +
          "Cloud Buildは本番用ビルドを行い、それをApp Engineのdefaultサービスとしてデプロイします。",
        appConfiguration:
          "次のYAMLファイルはWebフロントエンドのapp.yaml、つまりApp Engine用の構成ファイルです。" +
          "もし、あなたのNext.jsやその他のNode.jsのアプリケーションをApp Engineでホストしたい場合、ただapp.yamlを用意すればアプリケーションをApp Engineにデプロイすることができます。",
        buildConfiguration:
          "次のYAMLファイルはWebフロントエンドのCloud Buildの構成ファイルです。" +
          "3ステップからなり、Webアプリのビルドとデプロイを自動化しています。" +
          "このような構成ファイルを作ることでビルドとデプロイを自動化することができます。",
      },
      api: {
        overview:
          "APIはGoで書かれていて、App Engineのapiサービスとして稼働しています。" +
          "開発者がGitHubのmainブランチにコードをプッシュすると、GitHubからのウェブフックによりCloud Buildが実行されます。" +
          "Cloud BuildはアプリケーションをapiサービスとしてApp Engineにデプロイします。 ",
        appConfiguration:
          "次のYAMLはapp.yamlです。App Engineの構成ファイルです。",
        buildConfiguration:
          "次のYAMLはcloudbuild.yamlです。Cloud Buildの構成ファイルです。" +
          "たったひとつのステップでGoアプリをApp Engineにデプロイすることができます。",
      },
      dispatch: {
        description:
          "dispatch.yamlを使えばルーティングルールを上書きできます。" +
          "このデモアプリではdispatch.yamlを使って、/apiへのリクエストはapiサービスへ、それ以外のリクエストはdefaultサービス (web) へルーティングしています。" +
          "次のYAMLはこのデモアプリのdispatch.yamlです。",
      },
    },
  },
  simultaneousInterpreter: {
    title: "同時通訳",
    description: "あなたの発言を多言語に同時通訳します。",
    instructions: [
      "話す言語を選んでください。",
      "マイクボタンを押して、選んだ言語で何か話してください。",
      "ストップボタンを押してください。",
      "少し待つと翻訳結果が表示されます。",
      "連続して実行すると、翻訳結果が次々と表示されます。",
      "表示する言語を絞りたい場合は、[表示言語を選ぶ]ボタンをクリックして表示したい言語を選んでください。",
    ],
    selectLanguages: "表示言語を選ぶ",
    selectLanguagesTitle: "表示言語を選んでください",
    unselectAll: "すべてのチェックを外す",
  },
  wikipediaPageview: {
    title: "Wikipedia 閲覧回数",
    description:
      "BigQueryとBigQueryの一般公開データセットを使ってWikipediaのページ閲覧回数を分析・可視化します。",
    instructions: [
      "まずはそのまま [クエリ実行] をクリックしてください。",
      "そして、グラフ、結果、SQL、ジョブ情報を見てください。",
      "次に「グルーピング」を変更してクエリを実行してください。",
      "時系列のグラフを確認してください。",
      "その後は、好きなようにクエリを実行してください。例えば、",
      "「Wiki」フィールドに「ja」や「en」などを入力して自分の言語について調べてみる。",
      "「タイトルを含む」フィールドを使ってある特定のトピックを調べる。",
      "日付の範囲を変更する。",
    ],
    tableInformation: "テーブル情報",
    tableInformationContent:
      "wikipedia.pageviewsテーブルは各国のWikipediaの各記事の毎日のページビュー数を格納しています。" +
      "このデモでは、pageviews_2020テーブルを使用します。" +
      "2020年のページビューを記録したテーブルで、550億行以上の2.25TBのデータから成ります。",
    controller: {
      titleIncludes: "タイトルに含む",
      startDate: "開始日",
      endDate: "終了日",
      orderBy: "並び替え",
      descending: "降順",
      ascending: "昇順",
      groupBy: "グルーピング",
      title: "タイトル",
      date: "日付",
      queryCache: "クエリキャッシュ",
      runQuery: "クエリ実行",
    },
    result: {
      visualization: "グラフ",
      results: "結果",
      jobInformation: "ジョブ情報",
      parameters: "パラメーター",
      startTime: "開始時間",
      endTime: "終了時間",
      duration: "実行時間",
      bytesProcessed: "処理バイト数",
      inputRows: "入力行数",
      cacheHit: "キャッシュヒット",
      lineUnit: "行",
    },
  },
};

export default ja;
