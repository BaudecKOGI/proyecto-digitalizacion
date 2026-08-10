import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingAvatar from './avatar/FloatingAvatar';
import ChatPanel from './chat/ChatPanel';
import { useAssistant } from './hooks/useAssistant';

export default function AssistantWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, handleSearch, resetChat } = useAssistant();

  // No mostrar el asistente en la vista 3D para evitar superposiciones
  if (location.pathname.includes('/proyecto/3d/')) {
    return null;
  }

  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className="fixed z-[9000] flex flex-col items-end"
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        right: 'max(16px, env(safe-area-inset-right, 16px))',
      }}
    >
      {/* Panel del chat */}
      <ChatPanel
        isOpen={isOpen}
        messages={messages}
        isLoading={isLoading}
        onSend={handleSearch}
        onClose={handleClose}
        onReset={resetChat}
      />

      {/* Etiqueta tooltip "¿Necesitas ayuda?" */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mb-2 mr-1 pointer-events-none"
        >
          <div
            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/80 whitespace-nowrap"
            style={{
              background: 'rgba(10, 12, 30, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            ¿Buscas un proyecto?
          </div>
          {/* Flecha apuntando hacia el avatar */}
          <div className="flex justify-end pr-6">
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(99,102,241,0.3)',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Avatar flotante 3D */}
      <FloatingAvatar onClick={handleToggle} isOpen={isOpen} />
    </div>
  );
}
