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
    {
        id: 3,
        sender: 'DevConnect',
        subject: 'New Job Posting: Frontend Developer',
        body: 'Check out this new opportunity that matches your profile.',
        date: 'Mar 15, 2025',
        isRead: true,
    },
    {
        id: 4,
        sender: 'Recruitment Team at Innovatech',
        subject: 'Follow-up on Your Application',
        body: 'We wanted to follow up regarding your application for the Software Engineer position.',
        date: 'Mar 10, 2025',
        isRead: true,
    },
    {
        id: 5,
        sender: 'EntryPoint Careers',
        subject: 'Weekly Job Digest',
        body: 'Here are the latest job openings curated just for you.',
        date: 'Mar 8, 2025',
        isRead: false,
    },
];

export const Messages = () => {
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const [formattedDate, setFormattedDate] = useState<string>('');
    const [formattedTime, setFormattedTime] = useState<string>('');

    const messageRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [replyInput, setReplyInput] = useState('');

    const isMobile = window.innerWidth < 768;

    const selectMessageByIndex = (index: number) => {
        const selected = messages[index];
        if (!selected) return;

        setSelectedIndex(index);
        setMessages(prev =>
            prev.map(msg =>
                msg.id === selected.id ? { ...msg, isRead: true } : msg
            )
        );

        setChatHistory([
            {
                id: 1,
                sender: 'them',
                content: selected.body,
                timestamp: selected.date,
            },
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

            <div className="h-full md:flex gap-6">
                {/* MOBILE: Full screen Message List */}
                {isMobile && !selectedMessage && (
                    <div className="h-full w-full bg-white rounded-lg shadow-md p-4 overflow-y-auto animate-fade-in">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
                        {messages.map((message, index) => (
                            <button
                                key={message.id}
                                onClick={() => selectMessageByIndex(index)}
                                className="w-full text-left p-3 mb-2 rounded-md border bg-white hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {!message.isRead && <Circle className="w-3 h-3 text-indigo-500 fill-indigo-500" />}
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
                )}

                {/* MOBILE: Full screen Message Detail */}
                {isMobile && selectedMessage && (
                    <div className="h-full w-full bg-white rounded-lg shadow-md flex flex-col animate-slide-in">
                        <div className="flex items-center p-4 border-b">
                            <button onClick={() => setSelectedIndex(null)} className="text-gray-600 hover:text-indigo-600 mr-2">
                                ← Back
                            </button>
                            <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {chatHistory.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow ${msg.sender === 'me'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}>
                                        {msg.content}
                                        <div className="text-[10px] text-gray-400 mt-1 text-right">{msg.timestamp}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t px-4 py-3 flex items-center gap-2">
                            <input
                                type="text"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!replyInput.trim()) return;
                                        const now = new Date().toLocaleTimeString();
                                        setChatHistory((prev) => [...prev, {
                                            id: Date.now(),
                                            sender: 'me',
                                            content: replyInput.trim(),
                                            timestamp: now,
                                        }]);
                                        setReplyInput('');
                                    }
                                }}
                                placeholder="Type your reply..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                onClick={() => {
                                    if (!replyInput.trim()) return;
                                    const now = new Date().toLocaleTimeString();
                                    setChatHistory((prev) => [...prev, {
                                        id: Date.now(),
                                        sender: 'me',
                                        content: replyInput.trim(),
                                        timestamp: now,
                                    }]);
                                    setReplyInput('');
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}

                {/* DESKTOP: Sidebar & Chat */}
                {!isMobile && (
                    <>
                        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                            {messages.map((message, index) => (
                                <button
                                    key={message.id}
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
                                            {!message.isRead && <Circle className="w-3 h-3 text-indigo-500 fill-indigo-500" />}
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

                        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md flex flex-col">
                            {selectedMessage ? (
                                <>
                                    <div className="p-6 overflow-y-auto flex-1 space-y-4">
                                        {chatHistory.map((msg) => (
                                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow ${msg.sender === 'me'
                                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                    }`}>
                                                    {msg.content}
                                                    <div className="text-[10px] text-gray-400 mt-1 text-right">{msg.timestamp}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t px-4 py-3 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={replyInput}
                                            onChange={(e) => setReplyInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    const now = new Date().toLocaleTimeString();
                                                    setChatHistory(prev => [...prev, {
                                                        id: Date.now(),
                                                        sender: 'me',
                                                        content: replyInput.trim(),
                                                        timestamp: now
                                                    }]);
                                                    setReplyInput('');
                                                }
                                            }}
                                            placeholder="Type your reply..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            onClick={() => {
                                                if (!replyInput.trim()) return;
                                                const now = new Date().toLocaleTimeString();
                                                setChatHistory(prev => [...prev, {
                                                    id: Date.now(),
                                                    sender: 'me',
                                                    content: replyInput.trim(),
                                                    timestamp: now
                                                }]);
                                                setReplyInput('');
                                            }}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 text-gray-500 text-sm">Select a message to view its content.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};