import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function Activation() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already activated or just logged in logic could go here
        // For now, we assume this page is accessible if not activated
    }, []);

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mock initData for browser testing if Telegram WebApp is not available
        const initData = window.Telegram?.WebApp?.initData || "query_id=mock&user=%7B%22id%22%3A123%2C%22first_name%22%3A%22Test%22%7D&auth_date=1&hash=mock";

        if (!code.trim()) return;

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/activate', { // Adjust URL if needed or use relative if proxy
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code.trim(),
                    initData: initData
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatus('success');
                setMessage('Активація успішна! Ласкаво просимо до NeuroCity.');
                setTimeout(() => {
                    navigate('/'); // Redirect to dashboard
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Невірний код активації.');
            }
        } catch (error) {
            console.error('Activation error:', error);
            setStatus('error');
            setMessage('Помилка з\'єднання з сервером.');
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

            <div className="max-w-md w-full glass-panel border border-slate-700/50 bg-slate-900/60 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-4">
                        <Lock className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Вітаємо в <span className="text-cyan-400">Базі курсу AI Спеціаліст</span>
                    </h1>
                    <p className="text-slate-400">
                        Введіть код доступу для активації вашого облікового запису
                    </p>
                </div>

                <form onSubmit={handleActivate} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Key className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="block w-full pl-11 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono tracking-wider text-center text-lg uppercase"
                            placeholder="AI-XXXX-XXXX"
                            required
                        />
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50 animate-shake">
                            <AlertCircle size={16} />
                            {message}
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                            <ShieldCheck size={16} />
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${status === 'success'
                            ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {status === 'loading' ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : status === 'success' ? (
                            <>
                                Активовано <ShieldCheck size={20} />
                            </>
                        ) : (
                            <>
                                Увійти в Базу <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        Немає коду? Зверніться до адміністратора або перевірте ваш Telegram бот.
                    </p>
                </div>
            </div>
        </div>
    );
}
