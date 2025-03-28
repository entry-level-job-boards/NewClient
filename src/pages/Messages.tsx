import { Mail, User, Calendar, Circle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Message {
    id: number;
    sender: string;
    subject: string;
    body: string;
    date: string;
    isRead: boolean;
}

interface ChatMessage {
    id: number;
    sender: 'them' | 'me';
    content: string;
    timestamp: string;
}

const sampleMessages: Message[] = [
    {
        id: 1,
        sender: 'HR at TechStart Solutions',
        subject: 'Interview Invitation',
        body: 'We’d love to schedule an interview for the Junior Developer role.',
        date: 'Mar 20, 2025',
        isRead: false,
    },
    {
        id: 2,
        sender: 'GrowthBase',
        subject: 'Thank You for Applying',
        body: 'Thanks for your application to the Customer Success Associate role.',
        date: 'Mar 18, 2025',
        isRead: false,
    },
];

export const Messages = () => {
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const messageRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    const [replyInput, setReplyInput] = useState('');

    // Automatically select message and mark as read
    const selectMessageByIndex = (index: number) => {
        const selected = messages[index];
        if (!selected) return;

        setSelectedIndex(index);
        setMessages(prev =>
            prev.map(msg =>
                msg.id === selected.id ? { ...msg, isRead: true } : msg
            )
        );

        // Simulated chat history (you could replace this with real data)
        setChatHistory([
            {
                id: 1,
                sender: 'them',
                content: selected.body,
                timestamp: selected.date,
            }
        ]);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!messages.length) return;

            if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => {
                    const next = prev === null ? 0 : Math.min(prev + 1, messages.length - 1);
                    selectMessageByIndex(next);
                    return next;
                });
            }

            if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => {
                    const next = prev === null ? messages.length - 1 : Math.max(prev - 1, 0);
                    selectMessageByIndex(next);
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [messages]);

    // Auto scroll selected message into view
    useEffect(() => {
        if (selectedIndex !== null && messageRefs.current[selectedIndex]) {
            messageRefs.current[selectedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedIndex]);

    const selectedMessage = selectedIndex !== null ? messages[selectedIndex] : null;

    return (
        <div className="pt-24 h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="h-full flex gap-6">
                {/* Sidebar List */}
                <div className="w-full h-[90%] md:w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                    {messages.map((message, index) => (
                        <button
                            key={message.id}
                            ref={(el) => (messageRefs.current[index] = el)}
                            onClick={() => selectMessageByIndex(index)}
                            className={`w-full text-left p-3 rounded-md transition-all duration-200 border flex flex-col ${selectedIndex === index
                                ? 'bg-indigo-50 border-indigo-200'
                                : message.isRead
                                    ? 'bg-white hover:bg-gray-50 border-transparent'
                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {!message.isRead && (
                                        <Circle className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                                    )}
                                    <h3 className="text-sm font-medium truncate">{message.sender}</h3>
                                </div>
                                {!message.isRead && (
                                    <span className="ml-auto bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                                        New
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">{message.subject}</p>
                            <p className="text-xs text-gray-400 mt-1">{message.date}</p>
                        </button>
                    ))}
                </div>

                {/* Message Detail */}
                <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md flex flex-col h-[90%]">
                    {/* Scrollable content */}
                    <div className="p-6 overflow-y-auto flex-1 space-y-4">
                        {selectedMessage ? (
                            <>
                                {chatHistory.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow ${msg.sender === 'me'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.content}
                                            <div className="text-[10px] text-gray-400 mt-1 text-right">
                                                {msg.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                Select a message to view its content.
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    {selectedMessage && (
                        <div className="border-t px-4 py-3 flex items-center gap-2">
                            <input
                                type="text"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // prevent newline
                                        if (!replyInput.trim()) return;

                                        const now = new Date().toLocaleString('en-US', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        });

                                        setChatHistory((prev) => [
                                            ...prev,
                                            {
                                                id: Date.now(),
                                                sender: 'me',
                                                content: replyInput.trim(),
                                                timestamp: now,
                                            },
                                        ]);
                                        setReplyInput('');
                                    }
                                }}
                                placeholder="Type your reply..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => {
                                    if (!replyInput.trim()) return;

                                    const now = new Date().toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    });

                                    setChatHistory((prev) => [
                                        ...prev,
                                        {
                                            id: Date.now(),
                                            sender: 'me',
                                            content: replyInput.trim(),
                                            timestamp: now,
                                        }
                                    ]);
                                    setReplyInput('');
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};