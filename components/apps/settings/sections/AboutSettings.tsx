'use client'

// Instead of importing Ico from FinderApp which might break, we define a small SVG wrapper.
const CheckIcon = () => (
    <svg className="w-4 h-4 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
)

export function AboutSettings() {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full">

            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Portfolio HGR-OS</h1>
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
            </div>
        </div>
    )
}
