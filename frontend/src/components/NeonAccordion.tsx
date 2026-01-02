import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';


interface AccordionItem {
    id: number;
    title: string;
    description: string;
    metadata_info?: string; // URL for Notion or external link
    category?: string;
}

interface NeonAccordionProps {
    items: AccordionItem[];
    categoryColor?: 'blue' | 'purple' | 'gold' | 'pink' | 'cyan';
}

export function NeonAccordion({ items, categoryColor = 'blue' }: NeonAccordionProps) {
    const [openId, setOpenId] = useState<number | null>(null);
    // const { tg } = useTelegram();

    // Define color mappings for Tailwind classes
    const colorStyles = {
        blue: {
            border: 'border-neon-blue',
            text: 'text-neon-blue',
            shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
            bgButton: 'bg-neon-blue',
            buttonShadow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]'
        },
        purple: {
            border: 'border-neon-purple',
            text: 'text-neon-purple',
            shadow: 'shadow-[0_0_15px_rgba(167,139,250,0.3)]',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(167,139,250,0.6)]',
            bgButton: 'bg-neon-purple',
            buttonShadow: 'shadow-[0_0_10px_rgba(167,139,250,0.5)]'
        },
        gold: {
            border: 'border-neon-gold',
            text: 'text-neon-gold',
            shadow: 'shadow-[0_0_15px_rgba(255,215,0,0.3)]',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]',
            bgButton: 'bg-neon-gold',
            buttonShadow: 'shadow-[0_0_10px_rgba(255,215,0,0.5)]'
        },
        pink: {
            border: 'border-neon-pink',
            text: 'text-neon-pink',
            shadow: 'shadow-[0_0_15px_rgba(244,114,182,0.3)]',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.6)]',
            bgButton: 'bg-neon-pink',
            buttonShadow: 'shadow-[0_0_10px_rgba(244,114,182,0.5)]'
        },
        cyan: {
            border: 'border-cyan-400',
            text: 'text-cyan-400',
            shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]',
            bgButton: 'bg-cyan-400',
            buttonShadow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]'
        }
    };

    const currentStyle = colorStyles[categoryColor] || colorStyles.blue;

    const toggleItem = (id: number) => {
        const isOpening = openId !== id;
        setOpenId(isOpening ? id : null);
    };

    // Simple link opener
    const handleLinkClick = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-4 w-full">
            {items.map((item) => {
                const isOpen = openId === item.id;

                return (
                    <div
                        key={item.id}
                        className={`
                            rounded-xl border bg-[#0f0f23]/90 backdrop-blur-md overflow-hidden transition-all duration-300
                            ${currentStyle.border}
                            ${isOpen ? currentStyle.shadow : 'shadow-none'}
                            ${currentStyle.hoverShadow}
                        `}
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                        >
                            <span className="text-white font-bold text-lg">{item.title}</span>
                            <ChevronDown
                                size={20}
                                className={`transition-transform duration-300 ${currentStyle.text} ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <div
                            className={`
                                overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                                ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            <div className="p-4 pt-0 text-gray-300 text-sm border-t border-gray-700/50 mt-2">
                                <p className="mb-4 leading-relaxed">{item.description}</p>

                                {item.metadata_info && (
                                    <button
                                        onClick={() => handleLinkClick(item.metadata_info!)}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-lg text-black font-bold text-sm
                                            transition-transform active:scale-95
                                            ${currentStyle.bgButton}
                                            ${currentStyle.buttonShadow}
                                            hover:brightness-110
                                        `}
                                    >
                                        <ExternalLink size={16} />
                                        Читати в Notion
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
