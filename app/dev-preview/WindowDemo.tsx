'use client'

import React, { useState } from 'react'
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext'
import { Window } from '@/components/desktop/Window'

function Demo() {
  const { windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow } =
    useWindowManager()

  return (
    <div className="relative w-full h-screen bg-[#0d1117] overflow-hidden font-mono">
      {/* Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] flex gap-2 flex-wrap justify-center">
        {(['terminal', 'about'] as const).map((app) => (
          <button
            key={app}
            onClick={() => openWindow(app)}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10 transition-colors"
          >
            Open {app}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[9999] text-white/30 text-xs text-center space-y-1">
        <p>Drag title bar · 🔴 close · 🟡 minimize · 🟢 maximize</p>
        <p className="text-white/20">Open windows: {windows.length}</p>
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.app.charAt(0).toUpperCase() + win.app.slice(1)}
          zIndex={win.zIndex}
          minimized={win.minimized}
          maximized={win.maximized}
          position={win.position}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          size={win.size}
          onFocus={focusWindow}
        >
          <div className="p-6 text-white/70 text-sm space-y-2">
            <p className="text-white font-semibold">{win.app}.app</p>
            <p className="text-white/40 text-xs">id: {win.id}</p>
            <p className="text-white/40 text-xs">zIndex: {win.zIndex}</p>
            <p className="text-white/40 text-xs">
              position: {win.position.x}, {win.position.y}
            </p>
            <div className="mt-4 h-40 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/20 text-xs">
              app content goes here
            </div>
          </div>
        </Window>
      ))}
    </div>
  )
}

export default function WindowDemo() {
  return (
    <WindowManagerProvider>
      <Demo />
    </WindowManagerProvider>
  )
}
