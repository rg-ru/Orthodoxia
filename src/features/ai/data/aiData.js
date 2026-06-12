export const aiData = {
  overview: {
    title: "Orthodox AI Assistant",
    body: "A careful assistant surface for questions about prayer, reading, fasting, and catechism."
  },
  welcomePrompts: [
    { key: "ai.prompt.priest", text: "What should I ask my priest about this?" },
    { key: "ai.prompt.prayer", text: "Which prayer would help me begin again?" },
    { key: "ai.prompt.catechism", text: "What should I read next in the catechism?" }
  ],
  responseTopics: [
    {
      id: "prayer",
      responseKey: "ai.mock.prayer",
      keywords: ["pray", "prayer", "morning", "evening", "rule", "begin", "gebet", "beten", "morgen", "abend", "молит", "правило"]
    },
    {
      id: "scripture",
      responseKey: "ai.mock.scripture",
      keywords: ["scripture", "bible", "gospel", "read", "reading", "psalm", "schrift", "bibel", "evangelium", "lesen", "писание", "библи", "евангел", "читать", "псал"]
    },
    {
      id: "fasting",
      responseKey: "ai.mock.fasting",
      keywords: ["fast", "fasting", "food", "lent", "feast", "fasten", "essen", "speise", "пост", "еда", "пища"]
    },
    {
      id: "catechism",
      responseKey: "ai.mock.catechism",
      keywords: ["catechism", "learn", "doctrine", "church", "orthodox", "katechismus", "lernen", "kirche", "orthodox", "катехизис", "учение", "церковь", "православ"]
    }
  ],
  guardrails: [
    { title: "Spiritual care", body: "Bring confession, pastoral direction, and serious distress to a priest or qualified helper." },
    { title: "Orthodox sources", body: "Prefer Scripture, liturgy, councils, saints, and trusted Orthodox teaching." },
    { title: "No urgency tricks", body: "The assistant should be quiet, direct, and never manipulative." }
  ]
};
