import { aiData } from "../data/aiData.js";
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
      welcomeTitle: t(language, "ai.welcome.title"),
      welcomeBody: t(language, "ai.welcome.body"),
      chatLabel: t(language, "ai.chat.label"),
      inputLabel: t(language, "ai.input.label"),
      send: t(language, "ai.send"),
      assistant: t(language, "ai.assistant"),
      user: t(language, "ai.user"),
      mockNotice: t(language, "ai.mock.notice"),
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
    prompts: aiData.welcomePrompts.map((prompt) => t(language, prompt.key))
  };
}

export function getMockAiResponse(message, language = "en") {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    return t(language, "ai.empty");
  }

  const normalizedMessage = cleanMessage.toLowerCase();
  const topic = aiData.responseTopics.find((item) =>
    item.keywords.some((keyword) => normalizedMessage.includes(keyword))
  );

  return t(language, topic?.responseKey ?? "ai.mock.default");
}
