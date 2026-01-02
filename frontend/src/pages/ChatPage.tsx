import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export function ChatPage() {
    const { tg, user } = useTelegram();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Привіт, ${user?.first_name || 'Специаліст'}! Я твій AI помічник. Чим можу допомогти?`,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // API call to our backend
            const response = await fetch('http://127.0.0.1:8000/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMsg.text,
                    initData: tg.initData || "test_init_data" // Fallback for dev without TG
                }),
            });

            if (!response.ok) {
                throw new Error('API Error');
            }

            const data = await response.json();

            const botMsg: Message = {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: "Вибачте, виникла помилка з'єднання. Спробуйте пізніше.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex max-w-[85%] rounded-2xl p-3 shadow-lg backdrop-blur-sm ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none'
                                    : 'bg-slate-800/80 border border-slate-700 text-gray-100 rounded-tl-none'
                                }`}
                        >
                            <div className="mr-2 mt-1 min-w-[20px]">
                                {msg.sender === 'user' ? (
                                    <User size={18} className="text-cyan-200" />
                                ) : (
                                    <Bot size={18} className="text-neon-purple" />
                                )}
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
                            <Loader2 size={18} className="animate-spin text-cyan-400" />
                            <span className="text-gray-400 text-sm">AI друкує...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-2 bg-slate-900/50 p-2 rounded-2xl border border-slate-700 backdrop-blur-md flex items-end gap-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Запитайте щось про AI..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm p-3 focus:outline-none resize-none max-h-32 custom-scrollbar"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors shadow-[0_0_10px_rgba(8,145,178,0.4)]"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
