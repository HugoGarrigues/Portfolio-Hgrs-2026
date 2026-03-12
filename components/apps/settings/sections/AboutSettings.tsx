'use client'

// Instead of importing Ico from FinderApp which might break, we define a small SVG wrapper.
const CheckIcon = () => (
    <svg className="w-4 h-4 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
)

export function AboutSettings() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-24 h-24 rounded-[22%] bg-black/5 dark:bg-white/10 shadow-2xl flex items-center justify-center mb-6 relative overflow-hidden border border-border-subtle">
                <svg className="w-12 h-12 text-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                </svg>
            </div>

            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Portfolio OS v3</h1>
            <p className="text-[13px] text-foreground/50 mb-8">Agentic Operating System Interface</p>

            <div className="w-full max-w-sm flex flex-col gap-3 text-left">
                <div className="flex items-center justify-between p-3 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                    <span className="text-[13px] text-foreground/60">Puce / Core</span>
                    <span className="text-[13px] font-medium text-foreground/90 flex items-center gap-2">React 19 & Next.js <CheckIcon /></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                    <span className="text-[13px] text-foreground/60">Mémoire / Style</span>
                    <span className="text-[13px] font-medium text-foreground/90 flex items-center gap-2">Tailwind CSS v4 <CheckIcon /></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                    <span className="text-[13px] text-foreground/60">Animations</span>
                    <span className="text-[13px] font-medium text-foreground/90 flex items-center gap-2">Framer Motion <CheckIcon /></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/[0.03] dark:bg-white/[0.02] border border-border-subtle rounded-xl">
                    <span className="text-[13px] text-foreground/60">Écran / 3D</span>
                    <span className="text-[13px] font-medium text-foreground/90 flex items-center gap-2">Three.js <CheckIcon /></span>
                </div>
            </div>
        </div>
    )
}
