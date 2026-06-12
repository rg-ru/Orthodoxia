import { aiData } from "../data/aiData.js";

export function getAiModel() {
  return aiData;
}

export function getAiReflection(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    return "Write the question you want to bring to prayer, study, or your priest.";
  }

  return `Prepared question: ${cleanQuestion} Ask for an answer grounded in Scripture, the life of the Church, and pastoral care.`;
}
