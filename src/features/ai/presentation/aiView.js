import { getAiModel } from "../domain/aiModel.js";
import { actionButton, card, pageHeading, quietList } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderAi(state) {
  const model = getAiModel(state.preferences.language);

  return `
    <section class="page">
      ${pageHeading(model.overview.title, model.overview.body)}
      ${card({
        eyebrow: model.labels.question,
        title: model.labels.prepare,
        iconName: "forum",
        content: `
          <label class="sr-only" for="ai-question">${escapeHtml(model.labels.question)}</label>
          <textarea class="reflection-field" id="ai-question" data-ai-question placeholder="${escapeHtml(model.labels.placeholder)}">${escapeHtml(state.aiQuestion)}</textarea>
          ${actionButton({ label: model.labels.button, iconName: "check", action: "prepare-reflection" })}
          ${state.aiReflection ? `<p class="card-body">${escapeHtml(state.aiReflection)}</p>` : ""}
        `
      })}
      ${card({
        eyebrow: model.labels.guardrails,
        title: model.labels.use,
        iconName: "verified",
        content: quietList(model.guardrails)
      })}
      ${card({
        eyebrow: model.labels.prompts,
        title: model.labels.start,
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
