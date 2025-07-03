import React, { useState } from "react";

interface Message {
    sender: "ai" | "customer";
    text: string;
}

const initialMessages: Message[] = [
    { sender: "customer", text: "Hi, I need help with my order." },
    { sender: "ai", text: "Hello! I'm your AI assistant. How can I assist you today?" },
];

export default function ConvoCall() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() === "") return;
        setMessages([...messages, { sender: "customer", text: input }]);
        setInput("");
        // Integrate AI bot response here later
    };

    return (
        <div className="flex flex-col h-[95vh] w-full  p-4">
            <div className="flex justify-between mb-4">
                <button className="bg-[#118ab2] text-white px-4 py-2 rounded hover:bg-blue-600 transition">Take Over</button>
                <button className="bg-[#00c54c] text-white px-4 py-2 rounded hover:bg-green-700 transition">Request a Call</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-bold">Chats</h1>
                </div>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${msg.sender === "ai"
                                    ? "bg-blue-100/60 text-blue-900"
                                    : "bg-green-100/60 text-green-900"
                                }`}
                        >
                            <span className="font-semibold">{msg.sender === "ai" ? "AI" : "You"}: </span>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}