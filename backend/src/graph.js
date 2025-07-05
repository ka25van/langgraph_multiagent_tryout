import { StateGraph, END, Annotation} from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";


// Initialize the Llama model
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "llama3.2",
  temperature: 0.1,
});

// Define the state interface, Annotation is required
const GraphState = Annotation.Root({
    messages: Annotation({
      reducer: (x, y) => x.concat(y),
      default: () => [],
    }),
    user_input: Annotation({
      reducer: (x, y) => y ?? x,
      default: () => "",
    }),
    response: Annotation({
      reducer: (x, y) => y ?? x,
      default: () => "",
    }),
    step: Annotation({
      reducer: (x, y) => y ?? x,
      default: () => "",
    }),
  });

// Agent functions
async function chatAgent(state) {
  console.log("🤖 Chat Agent Processing...");
  
  const systemMessage = new SystemMessage(
    "You are a helpful AI assistant. Provide clear, concise, and helpful responses to user queries."
  );
  
  const humanMessage = new HumanMessage(state.user_input);
  //Send to llama3.2
  const response = await llm.invoke([systemMessage, humanMessage]);
  
  // Update state
  return {
    messages: [humanMessage, response],
    response: response.content,
    step: "completed",
  };
}

async function routeQuery(state) {
  console.log("🔍 Routing Query...");
  
  const query = state.user_input.toLowerCase();
  let nextStep = "general_chat";
  
  if (query.includes("hello") || query.includes("hi")) {
    nextStep = "greeting";
  } else if (query.includes("help")) {
    nextStep = "help";
  }
  
  console.log(`📍 Query routed to: ${nextStep}`);
  
  return {
    step: nextStep,
  };
}

async function greetingAgent(state) {
  console.log("👋 Greeting Agent Processing...");
  
  const greetingPrompt = new SystemMessage(
    "You are a friendly greeting agent. Respond warmly to greetings and ask how you can help."
  );
  
  const humanMessage = new HumanMessage(state.user_input);
  const response = await llm.invoke([greetingPrompt, humanMessage]);
  
  return {
    response: response.content,
    step: "completed",
  };
}

async function helpAgent(state) {
  console.log("❓ Help Agent Processing...");
  
  const helpPrompt = new SystemMessage(
    "You are a helpful assistant. Explain what you can do and how you can help users. Be specific about your capabilities."
  );
  
  const humanMessage = new HumanMessage(state.user_input);
  const response = await llm.invoke([helpPrompt, humanMessage]);
  
  return {
    response: response.content,
    step: "completed",
  };
}

//conditional cases
function shouldContinue(state) {
  if (state.step === "completed") {
    return END;
  }
  
  switch (state.step) {
    case "greeting":
      return "greeting_agent";
    case "help":
      return "help_agent";
    case "general_chat":
      return "chat_agent";
    default:
      return "chat_agent";
  }
}

// Create the graph
const workflow = new StateGraph(GraphState)
  .addNode("router", routeQuery)
  .addNode("chat_agent", chatAgent)
  .addNode("greeting_agent", greetingAgent)
  .addNode("help_agent", helpAgent)
  .addEdge("__start__", "router")
  .addConditionalEdges("router", shouldContinue)
  .addEdge("chat_agent", END)
  .addEdge("greeting_agent", END)
  .addEdge("help_agent", END);

// Compile the graph is important 
const app = workflow.compile();

export default app;