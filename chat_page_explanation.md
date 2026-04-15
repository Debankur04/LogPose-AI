# Chat Page Walkthrough

Welcome to the beginner-friendly guide for `page.jsx`! If you're new to frontend development (especially React and Next.js), this document will help you understand what exactly is happening behind the scenes in your chat interface.

## What is this file doing?
This file (`page.jsx`) is the main control center for your AI travel planner's chat interface. It performs three main jobs:
1. **Managing State**: It remembers things like whether the sidebar is open, what past chats you have, and the messages in the current chat.
2. **Talking to the Backend API**: When you hit "send", it wraps up your message and sends it to the backend server (your python agent), then waits for the server to reply.
3. **Displaying the UI**: It stitches together smaller components (`Sidebar`, `ChatHeader`, `MessageBubble`, `ChatInput`) to draw the screen you see in the browser.

---

## Key Parts of the Code

### 1. Variables and "State"
At the top of the `ChatPage` function, you will see `useState` hooks. In React, "State" just means "data that changes."
```javascript
const [messages, setMessages] = useState([]);
const [isLoading, setIsLoading] = useState(false); 
```
- `messages`: A list (array) of all chat bubbles.
- `setMessages`: A special function you call to add a new message. Whenever you call this, React automatically redraws the screen instantly to show the new message.
- `isLoading`: A true/false flag that turns on a loading spinner when the AI is "thinking."

### 2. The `useEffect` Hooks
`useEffect` translates to "run this code automatically when the page first loads, or when a specific variable changes."
For example, there's a `useEffect` that checks if the `userId` is in local storage. If it's not, it kicks the user out to the login page. Another `useEffect` automatically scrolls the chat down to the bottom whenever a new message appears!

### 3. Sending and Receiving Messages (`handleSendMessage`)
This is the most important function. It handles the core logic when a user types something and hits send:

1. **Optimistic UI:** It instantly adds the user's message to the screen so it feels fast, even before the server responds.
2. **API Call:** It makes a standard HTTP request to the backend using `apiClient("/query")`.
3. **Extracting the Data:** The Python backend returns a JSON package like this:
   ```json
   {
     "reply": "Planning a 2-day trip to Guwahati can range from...",
     "preference": "cultural experiences",
     "confidence": 0.9
   }
   ```
   The line `const aiResponse = data.reply || data.answer;` safely plucks out the `"reply"` property and ignores the rest!
4. **Markdown Formatting:** Because your backend outputs rich text (e.g., italics, bold, lists), we just pass `aiResponse` into `MessageBubble`. Inside `MessageBubble.jsx`, we use a library called `ReactMarkdown` which automatically converts the plain text back into beautiful HTML elements.

## How to Play Around!
- Try changing the default text inside `aiResponse` where it says `"No response found."` to see what happens when the server fails!
- Look at `MessageBubble.jsx` if you want to change the colors of the chat bubbles.
- Look at `ChatInput.jsx` to tweak the microphone or text box styling.
