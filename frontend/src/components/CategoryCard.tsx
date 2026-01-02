import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    borderColor: string;
    shadow: string;
    activeShadow: string;
    bgIcon: LucideIcon;
    backgroundImage: string;
    onClick: () => void;
    className?: string;
    isLarge?: boolean; // New prop
}

export function CategoryCard({
    id, // Added id
    title,
    description,
    icon: Icon,
    color,
    borderColor,
    shadow,
    activeShadow,
    bgIcon: BgIcon,
    backgroundImage,
    onClick,
    className = "",
    isLarge = false // Default to small
}: CategoryCardProps) {
    // Adaptive sizing
    const paddingClass = isLarge ? 'p-4' : 'p-2';
    // Special font sizing for long words in small cards (Automation, News)
    const isLongTitle = !isLarge && (title.length > 10 || id === 5 || id === 6);
    const titleSizeClass = isLarge ? 'text-lg' : (isLongTitle ? 'text-[12px] leading-3' : 'text-[15px]');

    return (
        <div
            onClick={onClick}
            className={`
                relative group cursor-pointer overflow-hidden
                rounded-2xl bg-[#0f0f23]/80 backdrop-blur-xl
                border-2 ${borderColor}
                hover:${shadow} ${activeShadow}
                hover:border-opacity-100 hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-300 flex flex-col justify-start
                shadow-[0_0_10px_rgba(0,0,0,0.5)]
                ${paddingClass}
                ${className}
            `}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-all duration-500 group-hover:scale-110 group-active:opacity-80 group-active:scale-105"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
            </div>

            {/* Background Icon Effect */}
            <div className="absolute -right-4 -top-4 opacity-10 z-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500">
                <BgIcon size={100} className={color} strokeWidth={1} />
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col items-start h-full">
                {/* Icon Box */}
                <div className={`
                    w-10 h-10 mb-3 rounded-xl border ${borderColor} 
                    bg-black/50 backdrop-blur-md flex items-center justify-center 
                    shadow-lg group-hover:scale-110 transition-transform 
                    drop-shadow-[0_0_5px_currentColor] ${color}
                `}>
                    <Icon className="text-current" size={20} />
                </div>

                {/* Title */}
                <h3 className={`
                    text-white font-bold 
                    uppercase tracking-wider 
                    drop-shadow-md mb-2
                    break-words break-all hyphens-auto line-clamp-2
                    ${titleSizeClass}
                `}>
                    {title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-gray-300 font-medium leading-tight max-w-[95%] opacity-90">
                    {description}
                </p>

                {/* Divider Line */}
                <div className={`
                    h-0.5 w-8 bg-current mt-auto pt-0.5
                    ${color} opacity-70 group-hover:w-full 
                    transition-all duration-500 shadow-[0_0_5px_currentColor]
                `}></div>
            </div>
        </div>
    );
}
