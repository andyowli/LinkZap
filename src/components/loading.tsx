import { cn } from "../lib/utils";

export function Loading({ className }: { className?: string }) {
    return (
        <div className={cn(
            "fixed inset-0 flex items-center justify-center bg-[#f8f9fa]",
            className
        )}>
        <div className="bg-white rounded-2xl shadow-lg px-16 py-12 flex flex-col items-center">
            <div className="mb-6">
                <svg className="animate-spin" width="64" height="64" viewBox="0 0 64 64">
                    <circle
                        className="opacity-30"
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                    />
                    <path
                    d="M58 32a26 26 0 0 1-26 26"
                    stroke="#1976d2"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    />
                </svg>
            </div>
            <span className="text-gray-400 text-xl tracking-wide">加载中...</span>
        </div>
        </div>
    );
}