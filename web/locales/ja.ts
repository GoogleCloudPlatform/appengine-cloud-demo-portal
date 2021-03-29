import { Locale } from "./type";

const ja: Locale = {
  title: "Google Cloud デモポータル (preview)",
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
};

export default ja;
