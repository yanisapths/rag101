export type Role = "user" | "assistant";

export interface UIMessagePart {
  type: "text";
  text: string;
}

export interface UIMessage {
  id: string;
  role: Role;
  parts: UIMessagePart[];
}
