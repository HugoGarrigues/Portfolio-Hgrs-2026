'use client'

import Image from 'next/image'
// Instead of importing Ico from FinderApp which might break, we define a small SVG wrapper.
const CheckIcon = () => (
    <svg className="w-4 h-4 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
)

export function AboutSettings() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl flex items-center justify-center mb-6 relative">
                <Image
                    src="/profile_picture.avif"
                    alt="Hugo Garrigues"
                    fill
                    className="object-cover"
                    draggable={false}
                />
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Portfolio OS v3</h1>
            <p className="text-[13px] text-white/50 mb-8">Développé par Hugo Garrigues</p>

            <div className="w-full max-w-sm flex flex-col gap-3 text-left">
                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                    <span className="text-[13px] text-white/60">Puce / Core</span>
                    <span className="text-[13px] font-medium text-white/90 flex items-center gap-2">React 19 & Next.js <CheckIcon /></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                    <span className="text-[13px] text-white/60">Mémoire / Style</span>
                    <span className="text-[13px] font-medium text-white/90 flex items-center gap-2">Tailwind CSS v4 <CheckIcon /></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                    <span className="text-[13px] text-white/60">Animations</span>
                    <span className="text-[13px] font-medium text-white/90 flex items-center gap-2">Framer Motion <CheckIcon /></span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                    <span className="text-[13px] text-white/60">Écran / 3D</span>
                    <span className="text-[13px] font-medium text-white/90 flex items-center gap-2">Three.js <CheckIcon /></span>
                </div>
            </div>
        </div>
    )
}
