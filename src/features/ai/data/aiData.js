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
  guardrails: [
    { title: "Spiritual care", body: "Bring confession, pastoral direction, and serious distress to a priest or qualified helper." },
    { title: "Orthodox sources", body: "Prefer Scripture, liturgy, councils, saints, and trusted Orthodox teaching." },
    { title: "No urgency tricks", body: "The assistant should be quiet, direct, and never manipulative." }
  ]
};
