

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: "Hi 👋, ask me anything about this problem." }] },
  ]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const onSubmit = async (data) => {
    if (!data.message || data.message.trim().length < 2) return;

    const updatedMessages = [
      ...messages,
      { role: "user", parts: [{ text: data.message }] },
    ];

    setMessages(updatedMessages);
    reset();
    setLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (error) {
      let errorMsg = "❌ AI service error. Please try again.";

      if (error.response?.status === 429) {
        errorMsg =
          "⚠️ AI limit reached (free tier). Please wait for some time or upgrade API plan.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: errorMsg }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh] min-h-[500px] border border-base-300 rounded-lg">

      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble bg-base-200 text-base-content max-w-[80%]">
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200">
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border-t bg-base-100"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about approach, hint, bug, complexity..."
            className="input input-bordered flex-1"
            {...register("message", { required: true, minLength: 2 })}
            disabled={loading}
          />
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading || errors.message}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
