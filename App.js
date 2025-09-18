import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [character, setCharacter] = useState({
    name: "Buddy",
    personality: "friendly and cheerful",
    avatar: "🤖",
  });
  const [sessionId] = useState(uuidv4());

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await axios.post("https://YOUR_BACKEND_URL.onrender.com/chat", {
        sessionId,
        message: input,
        character,
      });

      const aiMessage = { sender: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "ai", text: "AI is unavailable." }]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-purple-200 to-blue-200 p-4">
      <h1 className="text-4xl font-bold mb-4">AI Friend</h1>

      {/* Character Customization */}
      <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-md">
        <span className="text-5xl">{character.avatar}</span>
        <div className="flex flex-col ml-4 flex-1">
          <input
            type="text"
            className="border rounded px-2 py-1 mb-2"
            placeholder="Character Name"
            value={character.name}
            onChange={(e) => setCharacter({ ...character, name: e.target.value })}
          />
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Personality"
            value={character.personality}
            onChange={(e) => setCharacter({ ...character, personality: e.target.value })}
          />
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 flex flex-col space-y-2 h-[500px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-[80%] ${
              msg.sender === "user" ? "bg-blue-200 self-end" : "bg-green-200 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-4 flex w-full max-w-md">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l px-3 py-2"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-r hover:bg-purple-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
