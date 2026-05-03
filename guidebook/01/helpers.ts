export function prettyPrint(message: any) {
  if (!message) {
    console.log("⚠️ Empty message");
    return;
  }

  const content = message.content;

  if (typeof content === "string") {
    console.log("Content:");
    console.log(content);
  } else if (Array.isArray(content)) {
    console.log("Content (array):");
    content.forEach((item, index) => {
      console.log(`  [${index}]`, JSON.stringify(item, null, 2));
    });
  } else if (typeof content === "object") {
    console.log("Content (object):");
    console.log(JSON.stringify(content, null, 2));
  } else {
    console.log("Content:", content);
  }

  if (message.tool_calls) {
    console.log("Tool Calls:");
    console.log(JSON.stringify(message.tool_calls, null, 2));
  }

  if (
    message.additional_kwargs &&
    Object.keys(message.additional_kwargs).length > 0
  ) {
    console.log("Additional:");
    console.log(JSON.stringify(message.additional_kwargs, null, 2));
  }
}
