import { getAiModel } from "../domain/aiModel.js";
import { actionButton, card, pageHeading, quietList } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderAi(state) {
  const model = getAiModel();

  return `
    <section class="page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: "Question",
        title: "Prepare with care",
        iconName: "forum",
        content: `
          <label class="sr-only" for="ai-question">Question</label>
          <textarea class="reflection-field" id="ai-question" data-ai-question placeholder="Write a question about prayer, Scripture, fasting, or catechism">${escapeHtml(state.aiQuestion)}</textarea>
          ${actionButton({ label: "Prepare Question", iconName: "check", action: "prepare-reflection" })}
          ${state.aiReflection ? `<p class="card-body">${escapeHtml(state.aiReflection)}</p>` : ""}
        `
      })}
      ${card({
        eyebrow: "Guardrails",
        title: "Orthodox Use",
        iconName: "verified",
        content: quietList(model.guardrails)
      })}
      ${card({
        eyebrow: "Prompts",
        title: "Start simply",
        iconName: "lightbulb",
        content: `
          <div class="segmented-row">
            ${model.prompts.map((prompt) => `<span class="small-pill">${escapeHtml(prompt)}</span>`).join("")}
          </div>
        `
      })}
    </section>
  `;
}
