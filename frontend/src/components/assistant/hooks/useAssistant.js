// src/components/assistant/hooks/useAssistant.js
import { useState, useCallback } from 'react';
import { fetchProyectos3D, fetchProyectosSoftware, fetchCategorias } from '@/services/api';

/* ─── Mensajes de bienvenida ─── */
const WELCOME_MESSAGES = [
  {
    id: 'welcome-1',
    role: 'bot',
    type: 'text',
    text: '¡Hola! Soy el asistente del **Fab Lab UC** 🤖',
  },
  {
    id: 'welcome-2',
    role: 'bot',
    type: 'text',
    text: 'Puedo ayudarte a encontrar proyectos de diseño 3D o software de la universidad. Prueba escribiendo algo como:\n\n• *"Proyectos de robótica"*\n• *"Diseños 3D de arquitectura"*\n• *"Software de salud"*',
  },
];

/* ─── Lógica de filtrado inteligente ─── */
function normalizeStr(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scoreResult(item, terms) {
  const fields = [
    item.titulo || '',
    item.descripcion || '',
    item.categoria?.nombre || '',
    ...(item.ods_relacionados?.map((o) => o.titulo || o.nombre || '') || []),
    ...(item.tecnologias?.map((t) => t.nombre || '') || []),
  ].map(normalizeStr).join(' ');

  return terms.filter((t) => fields.includes(t)).length;
}

function filterResults(proyectos3D, proyectosSoftware, query) {
  const terms = normalizeStr(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const all = [
    ...proyectos3D.map((p) => ({ ...p, _type: '3D' })),
    ...proyectosSoftware.map((p) => ({ ...p, _type: 'Software' })),
  ];

  return all
    .map((item) => ({ item, score: scoreResult(item, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ item }) => item);
}

/* ─── Hook principal ─── */
export function useAssistant() {
  const [messages, setMessages] = useState(WELCOME_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim() || isLoading) return;

      // Agrega mensaje del usuario
      addMessage({ role: 'user', type: 'text', text: query });
      setIsLoading(true);

      // Agrega indicador de "escribiendo..."
      const typingId = `typing-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: typingId, role: 'bot', type: 'typing' },
      ]);

      try {
        // Ejecuta ambas consultas en paralelo y añade un delay artificial de 2s
        // para simular que el asistente está "pensando" y hacer la experiencia más natural.
        const [[proyectos3D, proyectosSoftware]] = await Promise.all([
          Promise.all([fetchProyectos3D(true), fetchProyectosSoftware(true)]),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        const results = filterResults(proyectos3D, proyectosSoftware, query);

        // Reemplaza el indicador de typing con la respuesta real
        setMessages((prev) => {
          const withoutTyping = prev.filter((m) => m.id !== typingId);
          if (results.length === 0) {
            return [
              ...withoutTyping,
              {
                id: Date.now(),
                role: 'bot',
                type: 'text',
                text: `No encontré proyectos relacionados con **"${query}"**. Intenta con otra palabra clave como el tipo de tecnología, categoría o tema.`,
              },
            ];
          }
          return [
            ...withoutTyping,
            {
              id: Date.now(),
              role: 'bot',
              type: 'text',
              text: `Encontré **${results.length} proyecto${results.length !== 1 ? 's' : ''}** para *"${query}"*. Haz clic en uno para ver los detalles:`,
            },
            {
              id: Date.now() + 1,
              role: 'bot',
              type: 'results',
              results,
            },
          ];
        });
      } catch (err) {
        setMessages((prev) => {
          const withoutTyping = prev.filter((m) => m.id !== typingId);
          return [
            ...withoutTyping,
            {
              id: Date.now(),
              role: 'bot',
              type: 'text',
              text: 'Ups, tuve un problema al conectarme con la base de datos. Por favor intenta nuevamente.',
            },
          ];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage]
  );

  const resetChat = useCallback(() => {
    setMessages(WELCOME_MESSAGES);
  }, []);

  return { messages, isLoading, handleSearch, resetChat };
}
