import { getAiModel } from "../domain/aiModel.js";
import { card, icon, pageHeading, quietList } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderAi(state) {
  const model = getAiModel(state.preferences.language);
  const hasMessages = state.aiMessages.length > 0;

  return `
    <section class="page ai-page">
      ${pageHeading(model.overview.title, model.overview.body)}
      <article class="card ai-chat-card" aria-label="${escapeHtml(model.labels.chatLabel)}">
        ${hasMessages ? renderMessages(state.aiMessages, model) : renderWelcome(model)}
        ${renderComposer(state.aiDraft, model)}
      </article>
      ${card({
        eyebrow: model.labels.guardrails,
        title: model.labels.use,
        iconName: "verified",
        content: quietList(model.guardrails)
      })}
    </section>
  `;
}

function renderWelcome(model) {
  return `
    <div class="ai-welcome">
      <div class="ai-welcome-icon">
        ${icon("forum")}
      </div>
      <div class="ai-welcome-copy">
        <h3>${escapeHtml(model.labels.welcomeTitle)}</h3>
        <p>${escapeHtml(model.labels.welcomeBody)}</p>
      </div>
      <div class="ai-prompt-list" aria-label="${escapeHtml(model.labels.prompts)}">
        ${model.prompts.map((prompt) => `
          <button class="small-pill ai-prompt-chip" type="button" data-ai-prompt="${escapeHtml(prompt)}">
            ${escapeHtml(prompt)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMessages(messages, model) {
  return `
    <div class="ai-message-list" role="log" aria-live="polite" aria-label="${escapeHtml(model.labels.chatLabel)}">
      ${messages.map((message) => renderMessage(message, model)).join("")}
    </div>
  `;
}

function renderMessage(message, model) {
  const isUser = message.role === "user";
  const sender = isUser ? model.labels.user : model.labels.assistant;

  return `
    <article class="ai-message ${isUser ? "ai-message-user" : "ai-message-assistant"}" aria-label="${escapeHtml(sender)}">
      <p class="ai-message-sender">${escapeHtml(sender)}</p>
      <div class="ai-message-bubble">
        <p>${escapeHtml(message.text)}</p>
      </div>
    </article>
  `;
}

function renderComposer(draft, model) {
  return `
    <div class="ai-composer">
      <label class="sr-only" for="ai-message">${escapeHtml(model.labels.inputLabel)}</label>
      <textarea
        class="ai-input"
        id="ai-message"
        data-ai-input
        rows="1"
        placeholder="${escapeHtml(model.labels.placeholder)}"
      >${escapeHtml(draft)}</textarea>
      <button class="icon-button ai-send-button" type="button" data-ai-send aria-label="${escapeHtml(model.labels.send)}" ${draft.trim() ? "" : "disabled"}>
        ${icon("send")}
      </button>
    </div>
    <p class="ai-mock-note">${escapeHtml(model.labels.mockNotice)}</p>
  `;
}
