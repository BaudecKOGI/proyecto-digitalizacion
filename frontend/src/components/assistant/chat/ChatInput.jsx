import React, { useState, useRef } from 'react';

const SUGGESTIONS = [
  'Proyectos de robótica',
  'Diseños 3D de medicina',
  'Software de educación',
  'Proyectos ODS',
];

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleSuggestion = (suggestion) => {
    if (!isLoading) {
      onSend(suggestion);
      inputRef.current?.focus();
    }
  };

  const canSend = value.trim() && !isLoading;

  return (
    <div className="shrink-0 pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>

      {/* Chips de sugerencias — sin border radius, estilo tag plano */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            disabled={isLoading}
            className="text-[10px] font-semibold px-2.5 py-1 transition-all duration-150 disabled:opacity-40"
            style={{
              fontFamily: 'Roboto, sans-serif',
              borderRadius: 0,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#A5B4FC',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Barra de input + botón enviar */}
      <form onSubmit={handleSubmit} className="flex items-stretch gap-0">
        <input
          ref={inputRef}
          id="assistant-search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
          placeholder="Escribe tu búsqueda..."
          className="flex-1 text-[13px] py-2.5 px-3 outline-none transition-all text-slate-900 placeholder:text-slate-400"
          style={{
            fontFamily: 'Roboto, sans-serif',
            borderRadius: 0,
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRight: 'none',
            caretColor: '#6366F1',
          }}
          autoComplete="off"
        />

        {/* Botón enviar — cuadrado, estilo corporativo */}
        <button
          type="submit"
          disabled={!canSend}
          className="shrink-0 w-11 flex items-center justify-center transition-all disabled:opacity-35"
          style={{
            borderRadius: 0,
            background: canSend
              ? '#4F46E5'
              : 'rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.1)',
          }}
          aria-label="Enviar"
        >
          {isLoading ? (
            /* Spinner simple */
            <span
              className="block h-4 w-4 border-2 border-white/30 border-t-white"
              style={{
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}
            />
          ) : (
            /* Ícono: flecha derecha limpia */
            <svg
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10H17M17 10L11 4M17 10L11 16"
                stroke={canSend ? 'white' : 'rgba(0,0,0,0.25)'}
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
          )}
        </button>
      </form>

      {/* Keyframe del spinner inline */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
