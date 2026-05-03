import { prettyPrint } from "./helpers";
import { ragAgent } from "./lib/retrieval";
import { chatAgent } from "./model/chat";

const chat = async () => {
  let inputMessage = "What is TechCorp company remote work policy?";
  let agentInput = {
    messages: [
      {
        role: "user",
        content: inputMessage,
      },
    ],
  };

  for await (const step of await ragAgent.stream(agentInput, {
    streamMode: "values",
  })) {
    const lastMessage = step.messages[step.messages.length - 1];
    // prettyPrint(lastMessage);
    console.log(lastMessage);
    console.log("-----\n");
  }
};

chat();
