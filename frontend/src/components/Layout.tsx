import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Briefcase, User } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

import { useEffect } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
    const { tg } = useTelegram();

    const location = useLocation();

    useEffect(() => {
        // Ensure app is expanded and ready
        tg.expand();
        tg.ready();

        // Set header color to match cyberpunk theme if needed, or let Telegram handle it
        tg.setHeaderColor('#0f0f23');
        tg.setBackgroundColor('#0f0f23');
    }, [tg]);

    const navItems = [
        { path: '/', icon: Home, label: 'Головна' },
        { path: '/?category=1', icon: BookOpen, label: 'ChatGPT' },
        { path: '/?category=3', icon: Briefcase, label: 'Промпти' },
        { path: '/profile', icon: User, label: 'Профіль' },
    ];

    return (
        <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-neon-blue selection:text-white">
            {/* Content Area - padded bottom for nav */}
            <main className="flex-1 p-4 pb-24 overflow-y-auto">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-slate-800/90 backdrop-blur-md border-t border-cyan-500/30 pb-safe-area-bottom pt-2 px-4 z-50 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <ul className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path && !location.search;
                        const Icon = item.icon;
                        const isHome = item.path === '/';

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => {
                                        if (isHome) {
                                            // Force reload as requested by user for reliability
                                            window.location.href = '/';
                                        }
                                    }}
                                    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${isActive
                                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-110'
                                        : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
