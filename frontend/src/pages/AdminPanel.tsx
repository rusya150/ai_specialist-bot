import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../hooks/useTelegram';
import { ShieldAlert, Trash2, Key, RefreshCw } from 'lucide-react';

interface User {
    id: number;
    telegram_id: number;
    username: string;
    first_name: string;
    is_activated: boolean;
    experience_points: number;
    created_at: string;
}
// Admin initData shim
const getInitData = (tg: any) => tg?.initData || "query_id=mock&user=%7B%22id%22%3A750869199%2C%22first_name%22%3A%22DevAdmin%22%7D&auth_date=1&hash=mock";

export function AdminPanel() {
    const { tg } = useTelegram();
    const [users, setUsers] = useState<User[]>([]);
    const [codes, setCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: getInitData(tg) })
            });
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCodes = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/admin/codes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: getInitData(tg) })
            });
            if (res.ok) {
                setCodes(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deactivateUser = async (userId: number) => {
        if (!confirm('Ви впевнені, що хочете деактивувати цього користувача?')) return;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${apiUrl}/api/v1/admin/users/${userId}/deactivate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: getInitData(tg) })
            });
            if (res.ok) {
                fetchUsers(); // Refresh list
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6 pb-24 px-4 pt-4 animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> Адмін-панель
            </h1>

            {/* Controls */}
            <div className="flex gap-4 mb-6">
                <button onClick={fetchUsers} className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition">
                    <RefreshCw size={20} className={`text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                    onClick={() => { fetchCodes(); }}
                    className="bg-cyan-900/40 text-cyan-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-900/60 transition"
                >
                    <Key size={18} /> Показати вільні коди
                </button>
            </div>

            {/* Codes Display */}
            {codes.length > 0 && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/20 mb-6">
                    <h3 className="font-bold text-cyan-400 mb-2">Вільні коди:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {codes.map(code => (
                            <div key={code} className="font-mono text-xs bg-black/40 p-1.5 rounded text-center select-all cursor-pointer text-gray-300 hover:text-white border border-transparent hover:border-cyan-500/50 transition">
                                {code}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setCodes([])} className="text-xs text-slate-500 mt-2 hover:text-slate-300">Приховати</button>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4 text-slate-500 font-mono">#{u.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-white">{u.first_name}</div>
                                        <div className="text-xs text-slate-400">@{u.username}</div>
                                    </td>
                                    <td className="p-4">
                                        {u.is_activated ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                                                Активний
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                                                Неактивний
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => deactivateUser(u.id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition"
                                            title="Деактивувати"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">
                        Користувачів не знайдено
                    </div>
                )}
            </div>
        </div>
    );
}
