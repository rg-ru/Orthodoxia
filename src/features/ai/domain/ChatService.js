import { aiRepository } from "../data/AiRepository.js?v=13";
import { conversationStorage } from "../data/ConversationStorage.js?v=13";
import { MessageModel } from "./MessageModel.js?v=13";

const HISTORY_WINDOW = 24;

export class ChatService {
  constructor({ repository = aiRepository, storage = conversationStorage } = {}) {
    this.repository = repository;
    this.storage = storage;
  }

  getInitialMessages() {
    return this.storage.readConversation().messages;
  }

  clearConversation() {
    return this.storage.clearConversation().messages;
  }

  async sendMessage({ text, messages, language, signal, onUpdate }) {
    const cleanText = text.trim();
    if (!cleanText) {
      return messages;
    }

    const userMessage = new MessageModel({
      role: "user",
      text: cleanText,
      source: "user"
    });
    let assistantMessage = new MessageModel({
      role: "assistant",
      text: "",
      status: "streaming"
    });
    let nextMessages = [...normalizeMessages(messages), userMessage, assistantMessage];
    this.persistAndUpdate(nextMessages, onUpdate, "streaming");

    try {
      await this.repository.streamChat({
        messages: nextMessages
          .filter((message) => message.role !== "assistant" || message.text.trim())
          .slice(-HISTORY_WINDOW),
        language,
        signal,
        onToken: (delta) => {
          assistantMessage = assistantMessage.withChanges({
            text: `${assistantMessage.text}${delta}`,
            status: "streaming"
          });
          nextMessages = [...nextMessages.slice(0, -1), assistantMessage];
          this.persistAndUpdate(nextMessages, onUpdate, "streaming");
        }
      });

      assistantMessage = assistantMessage.withChanges({ status: "complete" });
      nextMessages = [...nextMessages.slice(0, -1), assistantMessage];
      this.persistAndUpdate(nextMessages, onUpdate, "ready");
      return nextMessages;
    } catch (error) {
      if (signal?.aborted) {
        assistantMessage = assistantMessage.withChanges({
          text: assistantMessage.text || "Response stopped.",
          status: assistantMessage.text ? "complete" : "error",
          error: assistantMessage.text ? "" : "Response stopped."
        });
      } else {
        assistantMessage = assistantMessage.withChanges({
          text: getErrorMessage(error),
          status: "error",
          error: getErrorMessage(error)
        });
      }

      nextMessages = [...nextMessages.slice(0, -1), assistantMessage];
      this.persistAndUpdate(nextMessages, onUpdate, assistantMessage.status === "error" ? "error" : "ready");
      return nextMessages;
    }
  }

  persistAndUpdate(messages, onUpdate, status) {
    const saved = this.storage.saveConversation(messages);
    onUpdate?.(saved.messages, { status });
  }
}

function normalizeMessages(messages = []) {
  return messages.map((message) =>
    message instanceof MessageModel ? message : new MessageModel(message)
  );
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "The AI service is unavailable. Please try again when the secure endpoint is ready.";
}

export const chatService = new ChatService();
