import { useState, useEffect } from 'react';
import { Send, MessageCircle, X, RefreshCw } from 'lucide-react';
import { faqData } from './faqData';

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [showFAQs, setShowFAQs] = useState(true);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            showIntro();
        }
    }, [isOpen]);

    const showIntro = () => {
        setMessages([
            {
                from: 'bot',
                text: "Hi! 👋 I'm your FAQ assistant. Click a question below or type your own!",
            },
        ]);
        setShowFAQs(true);
    };

    const sendMessage = async (textOverride?: string) => {
        const messageText = textOverride || input;
        if (!messageText.trim()) return;

        const userMessage = { from: 'user' as const, text: messageText };
        setMessages((prev) => [...prev, userMessage]);
        setShowFAQs(false);

        const response = await getBotResponse(messageText);
        const botMessage = { from: 'bot' as const, text: response };
        setMessages((prev) => [...prev, botMessage]);

        setInput('');
    };

    const getBotResponse = async (message: string) => {
        const normalizedInput = message.toLowerCase().trim();

        for (const faq of faqData) {
            if (normalizedInput === faq.question.toLowerCase().trim()) {
                return faq.answer;
            }
        }

        return "I'm not sure about that yet — but feel free to reach out through our contact page!";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg animate-bounce transition duration-300 ease-in-out"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            ) : (
                <div className="w-80 h-[500px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden border border-gray-300">
                    <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
                        <h3 className="font-semibold">Chat with us</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`text-sm px-4 py-2 rounded-lg max-w-[80%] whitespace-pre-line transition duration-300 ease-in-out transform ${msg.from === 'user'
                                    ? 'bg-indigo-100 self-end ml-auto text-right'
                                    : 'bg-gray-100 self-start mr-auto text-left'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {showFAQs && (
                            <div className="space-y-2 mt-2">
                                {faqData.map((faq, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(faq.question)}
                                        className={`block w-full text-left text-sm px-4 py-2 border border-indigo-100 rounded-lg bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-all transform opacity-0 translate-y-2 animate-fade-in`}
                                        style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
                                    >
                                        {faq.question}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!showFAQs && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={showIntro}
                                    className="text-sm flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Ask another question
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-200 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={() => sendMessage()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};