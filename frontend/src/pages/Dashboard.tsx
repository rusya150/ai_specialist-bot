import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
    GraduationCap,
    Sparkles,
    Zap,
    Cpu,
    Radio,
    User,
    Settings,
    Bot,
    ArrowLeft,
    Send
} from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { NeonAccordion } from '../components/NeonAccordion';
import { CategoryCard } from '../components/CategoryCard';

export function Dashboard() {
    const { user } = useTelegram();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [items, setItems] = useState<any[]>([]);

    const [activeCategory, setActiveCategory] = useState<{ id: number; title: string; color: string } | null>(null);

    // Initial check for URL params
    useEffect(() => {
        const catId = searchParams.get('category');
        if (catId) {
            const id = parseInt(catId);
            const card = menuItems.find(item => item.id === id);
            if (card) {
                setActiveCategory({
                    id: card.id,
                    title: card.title,
                    color: card.color
                });
            }
        }
    }, [searchParams]);

    // Fetch Content Items
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/items`);
                if (response.ok) {
                    const data = await response.json();
                    const mappedItems = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.content,
                        metadata_info: item.metadata_info,
                        category_id: item.category_id
                    }));
                    setItems(mappedItems);
                }
            } catch (error) {
                // console.error("Failed to fetch items", error);
            }
        }
        fetchItems();
    }, []);

    const getCategoryItems = (categoryId: number) => {
        let dbCategoryId = -1;
        if (categoryId === 1) dbCategoryId = 1;
        if (categoryId === 2) dbCategoryId = 3;
        if (categoryId === 3) dbCategoryId = 4;
        if (categoryId === 4) dbCategoryId = 2;

        if (dbCategoryId !== -1) {
            return items.filter(i => i.category_id === dbCategoryId);
        }

        return [];
    };

    // Strict reset on home
    useEffect(() => {
        if (location.pathname === '/') {
            const categoryParam = searchParams.get('category');
            if (!categoryParam) {
                setActiveCategory(null);
                window.scrollTo(0, 0); // Explicitly scroll to top on reset
            }
        }
    }, [location.pathname, searchParams]);

    // Scroll to top on category change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeCategory]);

    const handleCategoryClick = (category: { id: number; title: string; color: string }) => {
        setActiveCategory(category);
    };

    const handleBack = () => {
        setActiveCategory(null);
        setSearchParams({});
    };

    const menuItems = [
        {
            id: 1,
            title: 'ChatGPT',
            description: 'гайди, туторіали, навчальні статті',
            icon: Bot,
            color: 'text-neon-blue',
            borderColor: 'border-neon-blue',
            shadow: 'shadow-neon-blue',
            activeShadow: 'active:shadow-neon-blue-strong',
            bgIcon: Bot,
            backgroundImage: '/assets/chatgpt-card.png',
            categoryColor: 'blue'
        },
        {
            id: 2,
            title: 'НАВЧАННЯ',
            description: 'гайди, туторіали, навчальні статті по AI сервісам',
            icon: GraduationCap,
            color: 'text-neon-purple',
            borderColor: 'border-neon-purple',
            shadow: 'shadow-neon-purple',
            activeShadow: 'active:shadow-neon-purple-strong',
            bgIcon: GraduationCap,
            backgroundImage: '/assets/knowledge-card.png',
            categoryColor: 'purple'
        },
        {
            id: 3,
            title: 'ПРОМПТИ',
            description: 'Бібліотека готова зовсім скоро.',
            icon: Sparkles,
            color: 'text-neon-gold',
            borderColor: 'border-neon-gold',
            shadow: 'shadow-neon-gold',
            activeShadow: 'active:shadow-neon-gold-strong',
            bgIcon: Sparkles,
            backgroundImage: '/assets/prompts-card.png',
            categoryColor: 'gold'
        },
        {
            id: 4,
            title: 'AI СЕРВІСИ',
            description: 'ТОП інструментів.',
            icon: Zap,
            color: 'text-cyan-400',
            borderColor: 'border-cyan-400',
            shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
            activeShadow: 'active:shadow-cyan-strong',
            bgIcon: Settings,
            backgroundImage: '/assets/ai-services-card.png',
            categoryColor: 'cyan'
        },
        {
            id: 5,
            title: 'АВТОМАТИ\u00ADЗАЦІЯ',
            description: 'Делегуй рутину.',
            icon: Cpu,
            color: 'text-neon-pink',
            borderColor: 'border-neon-pink',
            shadow: 'shadow-neon-pink',
            activeShadow: 'active:shadow-neon-pink-strong',
            bgIcon: Cpu,
            backgroundImage: '/assets/automation-card.png',
            categoryColor: 'pink'
        },
        {
            id: 6,
            title: 'AI NEWS',
            description: 'Свіжі новини та оновлення ШІ.',
            icon: Radio,
            color: 'text-neon-green',
            borderColor: 'border-green-400',
            shadow: 'shadow-[0_0_15px_rgba(74,222,128,0.5)]',
            activeShadow: 'active:shadow-green-strong',
            bgIcon: Radio,
            backgroundImage: '/assets/news-card.png',
            categoryColor: 'green'
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20 relative px-4 max-w-[450px] mx-auto min-h-screen">

            {/* Header (Cleaned up) */}
            <header className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full border-2 border-neon-blue p-[2px] shadow-neon-blue relative group">
                        {user?.photo_url ? (
                            <img src={user.photo_url} alt="User" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                                <User className="text-neon-blue" size={24} />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-black border border-neon-blue rounded-full p-1">
                            <span className="block w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg tracking-wide">{user?.first_name || 'Студент'}</span>
                        <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-neon-blue font-mono">Студент курсу</span>
                        </div>
                    </div>
                </div>
                {/* XP Block Removed */}
            </header>

            {/* Main Content Area */}
            {activeCategory ? (
                // --- CATEGORY VIEW ---
                <div className="animate-fade-in space-y-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-300 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft size={20} className="mr-1" />
                        Назад
                    </button>

                    <h2 className={`font-bold text-2xl uppercase tracking-wider mb-6 drop-shadow-md ${activeCategory.color}`}>
                        {activeCategory.title}
                    </h2>

                    {activeCategory.id === 6 ? (
                        // AI NEWS CARD
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-blue-500/30 shadow-[0_0_30px_rgba(34,161,222,0.15)] text-center relative overflow-hidden group">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>

                            <Radio size={56} className="text-[#24A1DE] mx-auto mb-6 animate-pulse drop-shadow-[0_0_10px_rgba(36,161,222,0.5)]" />

                            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Спільнота Майбутнього</h3>

                            <p className="text-gray-300 mb-8 leading-relaxed max-w-xs mx-auto text-sm">
                                Ексклюзивні інсайди, новини ШІ та нетворкінг з однодумцями.
                            </p>

                            <a
                                href="https://t.me/+oxfKSI2QniZmM2Vi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#24A1DE] to-[#229ED9] text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(36,161,222,0.4)] hover:shadow-[0_0_30px_rgba(36,161,222,0.7)] hover:scale-105 active:scale-95 group-hover:animate-pulse-slow"
                            >
                                <Send size={20} className="mr-2" />
                                Приєднатися до Telegram
                            </a>
                        </div>
                    ) : getCategoryItems(activeCategory.id).length > 0 ? (
                        <NeonAccordion
                            items={getCategoryItems(activeCategory.id)}
                            categoryColor={activeCategory.color.includes('blue') ? 'blue' : activeCategory.color.includes('purple') ? 'purple' : activeCategory.color.includes('pink') ? 'pink' : 'cyan'}
                        />
                    ) : (
                        <div className="text-center py-10 bg-[#0f0f23]/50 rounded-xl border border-gray-800">
                            <p className="text-gray-400">В цій категорії пока що немає матеріалів.</p>
                        </div>
                    )}
                </div>
            ) : (
                // --- DASHBOARD GRID VIEW ---
                <div className="grid grid-cols-2 gap-3">
                    {menuItems.map((item, index) => {
                        const isFeatureCard = index < 2;
                        const colSpan = isFeatureCard ? 'col-span-2' : 'col-span-1';

                        return (
                            <CategoryCard
                                key={item.id}
                                {...item}
                                isLarge={isFeatureCard}
                                className={`
                                    ${colSpan} 
                                    ${isFeatureCard ? 'aspect-[2/1] sm:aspect-[2.5/1]' : 'aspect-square'}
                                `}
                                onClick={() => handleCategoryClick({ id: item.id, title: item.title, color: item.color })}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
