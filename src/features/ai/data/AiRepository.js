export const DEFAULT_AI_ENDPOINT = "/api/ai/chat";
export const DEFAULT_AI_MODEL = "gpt-5.5";

const ORTHODOXIA_AI_INSTRUCTIONS = [
  "You are Orthodoxia, a calm Orthodox Christian companion for prayer, Scripture, fasting, catechism, and spiritual learning.",
  "Answer with humility, clarity, and restraint. Keep replies grounded in Orthodox Christian tradition and avoid speculation.",
  "Do not replace confession, pastoral care, medical care, mental health care, or emergency help. Encourage the user to speak with a priest for personal spiritual direction.",
  "Never use manipulative urgency, gamification, shame, or sensational language. Keep the tone quiet, practical, and reverent.",
  "If a question is outside Orthodoxia's purpose, gently redirect toward prayer, reading, learning, or appropriate real-world support."
].join("\n");

export class AiRepository {
  constructor({ endpoint = getConfiguredEndpoint(), model = DEFAULT_AI_MODEL } = {}) {
    this.endpoint = endpoint;
    this.model = model;
  }

  async streamChat({ messages, language, signal, onToken }) {
    let response;
    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Accept": "text/event-stream, application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          language,
          instructions: ORTHODOXIA_AI_INSTRUCTIONS,
          messages: messages.map(toTransportMessage)
        }),
        signal
      });
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }

      throw new Error("The AI service is unavailable. Please check the secure app endpoint and try again.");
    }

    if (!response.ok) {
      throw new Error(await createResponseError(response));
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const text = extractTextFromJson(await response.json());
      if (!text.trim()) {
        throw new Error("The AI service returned an empty response.");
      }
      onToken(text);
      return text;
    }

    if (!response.body) {
      throw new Error("The AI service did not return a readable stream.");
    }

    const streamedText = await readStreamingResponse(response.body, onToken);
    if (!streamedText.trim()) {
      throw new Error("The AI service returned an empty response.");
    }

    return streamedText;
  }
}

function getConfiguredEndpoint() {
  const globalEndpoint = typeof globalThis.ORTHODOXIA_AI_ENDPOINT === "string"
    ? globalThis.ORTHODOXIA_AI_ENDPOINT.trim()
    : "";
  const metaEndpoint = globalThis.document
    ?.querySelector('meta[name="orthodoxia-ai-endpoint"]')
    ?.getAttribute("content")
    ?.trim() ?? "";

  return globalEndpoint || metaEndpoint || DEFAULT_AI_ENDPOINT;
}

function toTransportMessage(message) {
  return {
    role: message.role,
    content: message.text
  };
}

async function createResponseError(response) {
  if (response.status === 404 || response.status === 405 || response.status === 501) {
    return "AI service is not configured. Add a secure /api/ai/chat endpoint before sending messages.";
  }

  try {
    const data = await response.clone().json();
    return extractErrorFromJson(data) || `AI service returned ${response.status}.`;
  } catch {
    const text = await response.text();
    return text.trim().startsWith("<")
      ? `AI service returned ${response.status}. Please check the secure app endpoint.`
      : text.trim() || `AI service returned ${response.status}.`;
  }
}

async function readStreamingResponse(body, onToken) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventText of events) {
      const delta = parseStreamEvent(eventText);
      if (delta) {
        fullText += delta;
        onToken(delta);
      }
    }
  }

  const tail = buffer + decoder.decode();
  if (tail.trim()) {
    const delta = parseStreamEvent(tail);
    if (delta) {
      fullText += delta;
      onToken(delta);
    }
  }

  return fullText;
}

export function parseStreamEvent(eventText) {
  const lines = eventText.split(/\r?\n/);
  const eventName = lines.find((line) => line.startsWith("event:"))?.slice(6).trim() ?? "";
  const dataLines = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());

  if (!dataLines.length) {
    return "";
  }

  const dataText = dataLines.join("\n");
  if (dataText === "[DONE]") {
    return "";
  }

  try {
    const data = JSON.parse(dataText);
    const error = extractErrorFromJson(data);
    if (eventName.includes("error") || data.type === "error" || data.type === "response.error") {
      throw new Error(error || "The AI service could not complete the response.");
    }

    return extractDelta(data, eventName);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return eventName.includes("delta") || !eventName ? dataText : "";
    }
    throw error;
  }
}

function extractDelta(data, eventName = "") {
  if (typeof data.delta === "string") {
    return data.delta;
  }

  if (typeof data.text === "string" && (data.type === "delta" || eventName.includes("delta"))) {
    return data.text;
  }

  if (typeof data.output_text === "string" && eventName.includes("delta")) {
    return data.output_text;
  }

  const chatDelta = data.choices?.[0]?.delta?.content;
  if (typeof chatDelta === "string") {
    return chatDelta;
  }

  return "";
}

function extractTextFromJson(data) {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  if (typeof data.text === "string") {
    return data.text;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  const chatContent = data.choices?.[0]?.message?.content;
  if (typeof chatContent === "string") {
    return chatContent;
  }

  const responseOutput = data.output
    ?.flatMap((item) => item.content ?? [])
    ?.map((content) => content.text ?? "")
    ?.join("");

  return typeof responseOutput === "string" ? responseOutput : "";
}

function extractErrorFromJson(data) {
  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof data?.error?.message === "string") {
    return data.error.message;
  }

  if (typeof data?.message === "string" && data.type === "error") {
    return data.message;
  }

  return "";
}

export const aiRepository = new AiRepository();
