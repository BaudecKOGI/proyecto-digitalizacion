import React from 'react';
import { motion } from 'framer-motion';
import ResultCard from './ResultCard';
import { MiniRobotAvatar } from '../avatar/RobotHead3D';

/* Markdown básico */
function parseText(text) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*'))
        return <em key={i}>{part.slice(1, -1)}</em>;
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < part.split('\n').length - 1 && <br />}
        </span>
      ));
    });
}

/* Efecto Máquina de Escribir */
const typedMessages = new Set();

function TypewriterText({ text, messageId, isOld, speed = 15 }) {
  const isAlreadyTyped = isOld || typedMessages.has(messageId);
  const [count, setCount] = React.useState(isAlreadyTyped ? text.length : 0);

  React.useEffect(() => {
    if (count < text.length) {
      const timeout = setTimeout(() => {
        setCount((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      typedMessages.add(messageId);
    }
  }, [count, text, speed, messageId]);

  return <>{parseText(text.slice(0, count))}</>;
}

/* Indicador "escribiendo..." */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-indigo-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay }}
        />
      ))}
    </div>
  );
}

/* Mensaje individual */
export default function ChatMessage({ message }) {
  const isBot = message.role === 'bot';

  /* Typing */
  if (message.type === 'typing') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end gap-2"
      >
        <MiniRobotAvatar size={28} />
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px 18px 18px 2px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
          }}
        >
          <TypingIndicator />
        </div>
      </motion.div>
    );
  }

  /* Lista de resultados */
  if (message.type === 'results') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 pl-9"
      >
        {message.results.map((item, i) => (
          <ResultCard key={item.id ?? i} item={item} index={i} />
        ))}
      </motion.div>
    );
  }

  /* Mensaje de texto normal */
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      {isBot && <MiniRobotAvatar size={28} />}

      {/* Burbuja */}
      <div
        className="max-w-[80%] px-3 py-2 text-[13px] leading-relaxed"
        style={{
          fontFamily: 'Roboto, sans-serif',
          borderRadius: isBot ? '18px 18px 18px 2px' : '18px 18px 2px 18px',
          background: isBot ? '#FFFFFF' : '#5A00AA',
          color: isBot ? '#111827' : 'rgba(255,255,255,0.95)',
          boxShadow: isBot ? '0 1px 4px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        {isBot ? <TypewriterText text={message.text} messageId={message.id} isOld={message.isOld} /> : parseText(message.text)}
      </div>
    </motion.div>
  );
}
