import { t } from "../../../shared/i18n.js";

export function getAiModel(language = "en") {
  return {
    overview: {
      title: t(language, "ai.title"),
      body: t(language, "ai.body")
    },
    labels: {
      question: t(language, "ai.question"),
      prepare: t(language, "ai.prepare"),
      placeholder: t(language, "ai.placeholder"),
      button: t(language, "ai.button"),
      guardrails: t(language, "ai.guardrails"),
      use: t(language, "ai.use"),
      prompts: t(language, "ai.prompts"),
      start: t(language, "ai.start")
    },
    guardrails: [
      { title: t(language, "ai.spiritual"), body: t(language, "ai.spiritual.body") },
      { title: t(language, "ai.sources"), body: t(language, "ai.sources.body") },
      { title: t(language, "ai.urgency"), body: t(language, "ai.urgency.body") }
    ],
    prompts: [
      t(language, "ai.prompt.priest"),
      t(language, "ai.prompt.prayer"),
      t(language, "ai.prompt.catechism")
    ]
  };
}

export function getAiReflection(question, language = "en") {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    return t(language, "ai.empty");
  }

  return `${t(language, "ai.prepared")} ${cleanQuestion} ${t(language, "ai.guidance")}`;
}
