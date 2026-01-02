import { Sparkles } from 'lucide-react';

export function PromptsLibrary() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-fade-in text-center p-8">
            <div className="bg-slate-800/50 p-6 rounded-full border border-neon-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <Sparkles size={48} className="text-neon-gold animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Бібліотека Промптів</h1>
            <p className="text-gray-400 font-mono">
                Колекція найкращих промптів з'явиться тут зовсім скоро.
            </p>
        </div>
    );
}
