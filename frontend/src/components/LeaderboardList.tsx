import { useEffect, useState } from 'react';
import { Zap, Trophy, User } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram'; // Assuming you have this hook

interface LeaderboardUser {
    first_name: string;
    photo_url?: string;
    experience_points: number;
}

export function LeaderboardList() {
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const { user } = useTelegram();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
                const response = await fetch(`${apiUrl}/api/v1/users/leaderboard`);
                if (response.ok) {
                    const data = await response.json();
                    setLeaders(data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="space-y-3 w-full animate-fade-in">
            {leaders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Список лідерів порожній.</p>
                    <p className="text-xs mt-2">Стань першим!</p>
                </div>
            ) : (
                leaders.map((leader, index) => {
                    const isCurrentUser = user?.first_name === leader.first_name;
                    const rank = index + 1;

                    let rankColor = "text-gray-400";
                    if (rank === 1) rankColor = "text-yellow-400";
                    if (rank === 2) rankColor = "text-gray-300";
                    if (rank === 3) rankColor = "text-amber-600";

                    return (
                        <div
                            key={index}
                            className={`
                                flex items-center justify-between p-3 rounded-xl border bg-[#0f0f23]/90 backdrop-blur-md
                                transition-all duration-300
                                ${isCurrentUser
                                    ? 'border-neon-gold shadow-[0_0_15px_rgba(255,215,0,0.3)] bg-gradient-to-r from-[#0f0f23] to-[#2a2a40]'
                                    : 'border-slate-800 hover:border-slate-600'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`font-mono font-bold w-6 text-center ${rankColor}`}>{rank}</span>

                                <div className="relative">
                                    {leader.photo_url ? (
                                        <img src={leader.photo_url} alt={leader.first_name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                    )}
                                    {rank === 1 && (
                                        <div className="absolute -top-2 -right-1">
                                            <Trophy size={14} className="text-yellow-400 fill-yellow-400 animate-bounce" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className={`font-bold ${isCurrentUser ? 'text-neon-gold' : 'text-gray-200'}`}>
                                        {leader.first_name}
                                    </span>
                                    {isCurrentUser && <span className="text-[10px] text-gray-500 uppercase tracking-widest">Це ти</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <Zap size={14} className="text-neon-gold fill-neon-gold" />
                                <span className="text-neon-gold font-mono font-bold">{leader.experience_points}</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
