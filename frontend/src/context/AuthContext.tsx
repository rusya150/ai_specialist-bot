import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';

interface User {
    id: number;
    telegram_id: number;
    username?: string;
    first_name?: string;
    is_activated: boolean;
    experience_points: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    checkStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Hardcoded for frontend check, but backend must also validate!
const ADMIN_IDS = [750869199];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { tg } = useTelegram();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkStatus = async () => {
        setIsLoading(true);
        try {
            // Mock initData if missing (dev mode in browser)
            const initData = tg.initData || "query_id=mock&user=%7B%22id%22%3A750869199%2C%22first_name%22%3A%22DevAdmin%22%7D&auth_date=1&hash=mock";

            const response = await fetch('http://localhost:8000/api/v1/auth/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initData }),
            });

            if (response.ok) {
                const userData = await response.json();

                // Hard Bypass for Admin
                // Hard Bypass for Admin (Залізобетонна версія)
                if (String(userData.telegram_id) === "750869199") {
                    userData.is_activated = true;
                    console.log("Admin bypass ACTIVATED for ID 750869199!");
                }

                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const isAdmin = user ? ADMIN_IDS.includes(user.telegram_id) : false;

    return (
        <AuthContext.Provider value={{ user, isLoading, isAdmin, checkStatus }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
