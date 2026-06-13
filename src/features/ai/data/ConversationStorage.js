import { MessageModel } from "../domain/MessageModel.js?v=13";

export const CONVERSATION_STORAGE_KEY = "orthodoxia:ai:conversation:v1";
const MAX_LOCAL_MESSAGES = 60;

function createEmptyConversation() {
  return {
    version: 1,
    conversationId: createConversationId(),
    sync: {
      status: "local",
      cloudId: "",
      updatedAt: ""
    },
    messages: []
  };
}

export class ConversationStorage {
  constructor({ storageKey = CONVERSATION_STORAGE_KEY, storage = getLocalStorage() } = {}) {
    this.storageKey = storageKey;
    this.storage = storage;
  }

  readConversation() {
    if (!this.storage) {
      return createEmptyConversation();
    }

    try {
      const saved = JSON.parse(this.storage.getItem(this.storageKey) ?? "null");
      if (!saved || saved.version !== 1 || !Array.isArray(saved.messages)) {
        return createEmptyConversation();
      }

      return {
        version: 1,
        conversationId: String(saved.conversationId || createConversationId()),
        sync: normalizeSync(saved.sync),
        messages: saved.messages.map((message) => new MessageModel(message))
      };
    } catch {
      return createEmptyConversation();
    }
  }

  saveConversation(messages, options = {}) {
    const previous = this.readConversation();
    const payload = {
      version: 1,
      conversationId: options.conversationId || previous.conversationId,
      sync: {
        status: options.syncStatus || "local",
        cloudId: options.cloudId || previous.sync.cloudId,
        updatedAt: new Date().toISOString()
      },
      messages: messages.slice(-MAX_LOCAL_MESSAGES).map((message) =>
        message instanceof MessageModel ? message.toJSON() : new MessageModel(message).toJSON()
      )
    };

    if (this.storage) {
      try {
        this.storage.setItem(this.storageKey, JSON.stringify(payload));
      } catch {
        return {
          ...payload,
          messages: payload.messages.map((message) => new MessageModel(message))
        };
      }
    }

    return {
      ...payload,
      messages: payload.messages.map((message) => new MessageModel(message))
    };
  }

  clearConversation() {
    if (this.storage) {
      try {
        this.storage.removeItem(this.storageKey);
      } catch {
        return createEmptyConversation();
      }
    }

    return createEmptyConversation();
  }
}

function normalizeSync(sync = {}) {
  return {
    status: String(sync.status || "local"),
    cloudId: String(sync.cloudId || ""),
    updatedAt: String(sync.updatedAt || "")
  };
}

function createConversationId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `conversation-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getLocalStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export const conversationStorage = new ConversationStorage();
