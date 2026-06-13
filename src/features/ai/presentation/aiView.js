import { getAiModel } from "../domain/aiModel.js?v=13";
import { card, icon, pageHeading, quietList } from "../../../shared/ui.js";
import { escapeHtml } from "../../../shared/html.js";

export function renderAi(state) {
  const model = getAiModel(state.preferences.language);
  const hasMessages = state.aiMessages.length > 0;
  const isStreaming = state.aiStatus === "streaming";

  return `
    <section class="page ai-page">
      ${pageHeading(model.overview.title, model.overview.body)}
      <article class="card ai-chat-card" aria-label="${escapeHtml(model.labels.chatLabel)}">
        ${renderToolbar(hasMessages, state.aiStatus, model)}
        ${hasMessages ? renderMessages(state.aiMessages, model) : renderWelcome(model)}
        ${renderComposer(state.aiDraft, model, isStreaming)}
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

function renderToolbar(hasMessages, status, model) {
  const labelByStatus = {
    ready: model.labels.statusReady,
    streaming: model.labels.statusStreaming,
    error: model.labels.statusError
  };

  return `
    <div class="ai-toolbar">
      <p class="ai-status-pill" data-ai-status="${escapeHtml(status)}">${escapeHtml(labelByStatus[status] ?? model.labels.statusReady)}</p>
      ${hasMessages ? `
        <button class="text-button ai-clear-button" type="button" data-ai-clear>
          ${escapeHtml(model.labels.clear)}
        </button>
      ` : ""}
    </div>
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
  const statusClass = message.status === "error"
    ? " ai-message-error"
    : message.status === "streaming"
      ? " ai-message-streaming"
      : "";

  return `
    <article class="ai-message ${isUser ? "ai-message-user" : "ai-message-assistant"}${statusClass}" aria-label="${escapeHtml(sender)}">
      <p class="ai-message-sender">${escapeHtml(sender)}</p>
      <div class="ai-message-bubble">
        ${renderMessageText(message)}
      </div>
    </article>
  `;
}

function renderMessageText(message) {
  const text = message.text || (message.status === "streaming" ? " " : "");
  const lines = escapeHtml(text).split("\n").join("<br>");
  return `<p>${lines}</p>`;
}

function renderComposer(draft, model, isStreaming) {
  return `
    <div class="ai-composer">
      <label class="sr-only" for="ai-message">${escapeHtml(model.labels.inputLabel)}</label>
      <textarea
        class="ai-input"
        id="ai-message"
        data-ai-input
        rows="1"
        placeholder="${escapeHtml(model.labels.placeholder)}"
        ${isStreaming ? "disabled" : ""}
      >${escapeHtml(draft)}</textarea>
      <button class="icon-button ai-send-button" type="button" ${isStreaming ? "data-ai-stop" : "data-ai-send"} aria-label="${escapeHtml(isStreaming ? model.labels.stop : model.labels.send)}" ${draft.trim() || isStreaming ? "" : "disabled"}>
        ${icon(isStreaming ? "stop" : "send")}
      </button>
    </div>
    <p class="ai-service-note">${escapeHtml(model.labels.serviceNotice)}</p>
  `;
}
