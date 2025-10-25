import { message } from "antd";

message.config({ maxCount: 1 });

type MessageType = "success" | "error" | "warning" | "info";

export function showMessage(text: string, type: MessageType = "info") {
  message.destroy();
  message.open({
    type,
    content: text,
    duration: 2,
  });
}
