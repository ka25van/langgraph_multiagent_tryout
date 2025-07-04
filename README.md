![image](https://github.com/user-attachments/assets/0750a43f-42fe-4eca-82a8-471a7fca34e0)

User Input: "Hello! Can you help me with programming?"
What Happens:
🧭 Router sees "Hello" → routes to Greeting Agent; if 'help' it will route to HelpAgent orelse it will route to Chat Agent
👋 Greeting Agent creates a warm, welcoming response
🦙 Llama 3.2 generates: "Hello! Welcome! I'd be happy to help you with programming. What specific programming topic or challenge are you working on?"
📤 User gets a personalized, contextually appropriate response

This LangGraph project is like having multiple AI personalities that automatically choose the best one for each situation, all powered by a single local AI model llama3.2.
(Suggestion:-Run a better model configured from cloud for fater response generation rather than using default ollama url.)

These are few of the examples that i tested in Postman:-

/batch:- Can ask multiple questions
![image](https://github.com/user-attachments/assets/075f7995-429e-4a2a-b499-330829ec5b85)
![image](https://github.com/user-attachments/assets/aa5b2956-1a53-4039-ad72-90c7004275c8)

/chat:- Can ask one question.
![image](https://github.com/user-attachments/assets/4f967f5c-3f90-471b-9080-56d1dd634106)
You can cut short the response length in the hyperparameter or in the prompt too.

