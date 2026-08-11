import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { MiniRobotAvatar } from '../avatar/RobotHead3D';

export default function ChatPanel({ isOpen, messages, isLoading, onSend, onClose, onReset }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-panel"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute bottom-20 right-0 flex flex-col overflow-hidden"
          style={{
            /* Responsive: full-screen en mobile, panel fijo en desktop */
            width: 'min(360px, calc(100vw - 32px))',
            height: 'min(520px, calc(100dvh - 130px))',
            borderRadius: 0,
            background: '#F1F5F9',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <div
            className="shrink-0 flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: 'rgba(0,0,0,0.08)' }}
          >
            {/* Mini robot 3D */}
            <MiniRobotAvatar size={38} />

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-slate-900 leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Asistente Fab Lab UC
              </p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-1">
              <button
                onClick={onReset}
                title="Reiniciar conversación"
                className="h-7 w-7 flex items-center justify-center transition-colors hover:bg-black/5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                </svg>
              </button>
              <button
                onClick={onClose}
                title="Cerrar"
                className="h-7 w-7 flex items-center justify-center transition-colors hover:bg-black/5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 pb-4">
            <ChatInput onSend={onSend} isLoading={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
