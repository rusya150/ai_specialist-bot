import { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { User, Calendar } from 'lucide-react';

export function ProfileView() {
    const { user, tg } = useTelegram();
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        if (tg.initData) {
            const fetchProfile = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
                    const response = await fetch(`${apiUrl}/api/v1/users/profile`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ initData: tg.initData })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setProfileData(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                }
            };
            fetchProfile();
        }
    }, [tg.initData]);

    return (
        <div className="min-h-screen pb-20 px-4 pt-6 space-y-8 animate-fade-in max-w-[450px] mx-auto flex flex-col items-center justify-center">
            {/* Student Card */}
            <div className="w-full bg-[#0f0f23]/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-neon-blue shadow-[0_0_25px_rgba(34,211,238,0.3)] relative overflow-hidden text-center group">
                <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-transparent"></div>

                <div className="w-32 h-32 mx-auto rounded-full border-4 border-neon-blue p-1 shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-6 relative z-10">
                    {user?.photo_url ? (
                        <img src={user.photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                            <User className="text-neon-blue" size={64} />
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2 relative z-10">
                    {profileData?.first_name || user?.first_name || 'Студент'}
                </h1>
                <p className="text-neon-blue font-mono text-lg mb-6 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    Студент курсу "AI спеціаліст"
                </p>

                <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-gray-700/50 relative z-10">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-300 text-sm">{profileData?.registration_date || 'На курсі з: січня 2026'}</span>
                </div>
            </div>
        </div>
    );
}
