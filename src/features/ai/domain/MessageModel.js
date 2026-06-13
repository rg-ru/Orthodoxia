const VALID_ROLES = new Set(["user", "assistant", "system"]);
const VALID_STATUSES = new Set(["complete", "streaming", "error"]);

export class MessageModel {
  constructor({
    id = createMessageId(),
    role = "assistant",
    text = "",
    status = "complete",
    error = "",
    createdAt = new Date().toISOString(),
    source = "openai"
  } = {}) {
    this.id = String(id);
    this.role = VALID_ROLES.has(role) ? role : "assistant";
    this.text = String(text);
    this.status = VALID_STATUSES.has(status) ? status : "complete";
    this.error = String(error);
    this.createdAt = String(createdAt);
    this.source = String(source);
    Object.freeze(this);
  }

  withChanges(changes = {}) {
    return new MessageModel({ ...this.toJSON(), ...changes });
  }

  toJSON() {
    return {
      id: this.id,
      role: this.role,
      text: this.text,
      status: this.status,
      error: this.error,
      createdAt: this.createdAt,
      source: this.source
    };
  }
}

export function createMessageId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
