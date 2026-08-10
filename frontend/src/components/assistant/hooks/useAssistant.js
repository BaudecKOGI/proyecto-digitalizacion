import { useState, useCallback, useEffect } from 'react';
import { fetchProyectos3D, fetchProyectosSoftware, fetchCategorias } from '@/services/api';

/* Mensajes de bienvenida */
const WELCOME_MESSAGES = [
  {
    id: 'welcome-1',
    role: 'bot',
    type: 'text',
    text: '¡Hola! Soy el asistente del **Fab Lab UC**',
  },
  {
    id: 'welcome-2',
    role: 'bot',
    type: 'text',
    text: 'Puedo ayudarte a encontrar proyectos de diseño 3D o digitales de la universidad. Prueba escribiendo algo como:\n• *"Proyectos de robótica"*\n• *"Diseños 3D de arquitectura"*\n• *"Software de salud"*',
  },
];

/* Lógica de filtrado inteligente */
function normalizeStr(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scoreResult(item, terms) {
  const fields = [
    item.titulo || '',
    item.descripcion || '',
    item.categoria?.nombre || item.categoria_nombre || '',
    ...((item.ods_detalle || item.ods_relacionados || []).map((o) => o.label || o.titulo || o.nombre || '')),
    ...(item.tecnologias?.map((t) => typeof t === 'string' ? t : (t.nombre || '')) || []),
  ].map(normalizeStr).join(' ');

  return terms.filter((t) => fields.includes(t)).length;
}

function filterResults(proyectos3D, proyectosSoftware, query) {
  const terms = normalizeStr(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const all = [
    ...proyectos3D.filter(p => p.estado_publicacion === 'PUBLICADO').map((p) => ({ ...p, _type: '3D' })),
    ...proyectosSoftware.filter(p => p.estado_publicacion === 'PUBLICADO').map((p) => ({ ...p, _type: 'Software' })),
  ];

  return all
    .map((item) => ({ item, score: scoreResult(item, terms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ item }) => item);
}

/* Integración con Inteligencia Artificial (Gemini) */
async function fetchGeminiResponse(query, allProjects) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key de Gemini no configurada");
  }

  // Comprimir el catálogo para ahorrar tokens y acelerar la IA
  const catalog = allProjects.map((p, index) => ({
    refId: index,
    titulo: p.titulo,
    descripcion: p.descripcion,
    categoria: p.categoria?.nombre || p.categoria_nombre || '',
    tecnologias: p.tecnologias?.map(t => typeof t === 'string' ? t : t.nombre) || [],
    ods: (p.ods_detalle || p.ods_relacionados || []).map(o => o.label || o.titulo || o.nombre || o),
    ods_id: p.ods,
    tipo: p._type
  }));

  const systemPrompt = `Eres el asistente virtual del Fab Lab UC.
Tienes acceso al siguiente catálogo de proyectos (cada uno tiene un 'refId'):
${JSON.stringify(catalog)}

El usuario ha dicho: "${query}"

Tu tarea es:
1. Responder a la consulta de forma conversacional y muy breve (máx 2-3 líneas).
2. Si el usuario está buscando proyectos por tema, tecnología, categoría u ODS (Objetivo de Desarrollo Sostenible), identifica los 'refId' de los proyectos que mejor coincidan y devuélvelos en el arreglo (máximo 5). Analiza inteligentemente la semántica.
3. IMPORTANTE: Si el usuario SOLAMENTE está saludando (ej. "Hola", "Buenos días") o haciendo charla casual, responde amablemente pero deja el arreglo 'refIds_recomendados' VACÍO []. No inventes recomendaciones si no te las han pedido implícita o explícitamente.

DEBES responder EXCLUSIVAMENTE con un objeto JSON válido, sin usar bloques de código markdown (no uses \`\`\`json). El JSON debe tener esta estructura exacta:
{
  "respuesta_texto": "Tu respuesta conversacional aquí",
  "refIds_recomendados": []
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

  const data = await response.json();
  let textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) throw new Error("Respuesta inválida de Gemini");

  // Limpiar posibles bloques markdown si el modelo desobedece
  textContent = textContent.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(textContent);

  if (!parsed.respuesta_texto || !Array.isArray(parsed.refIds_recomendados)) {
    throw new Error("Esquema JSON inválido retornado por Gemini");
  }

  // Convertir refIds de vuelta a los objetos originales del proyecto
  const recommendedProjects = parsed.refIds_recomendados
    .map(id => allProjects[id])
    .filter(Boolean);

  return {
    text: parsed.respuesta_texto,
    results: recommendedProjects
  };
}

/* Hook principal */
export function useAssistant() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('assistant_messages');
      if (saved) {
        return JSON.parse(saved).map(m => ({ ...m, isOld: true }));
      }
    } catch (e) {
      console.error('Error reading assistant messages from localStorage', e);
    }
    return WELCOME_MESSAGES;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('assistant_messages', JSON.stringify(messages));
  }, [messages]);

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
        // Obtenemos los datos de la base de datos
        const [proyectos3D, proyectosSoftware] = await Promise.all([
          fetchProyectos3D(true),
          fetchProyectosSoftware(true)
        ]);

        const allProjects = [
          ...proyectos3D.filter(p => p.estado_publicacion === 'PUBLICADO').map((p) => ({ ...p, _type: '3D' })),
          ...proyectosSoftware.filter(p => p.estado_publicacion === 'PUBLICADO').map((p) => ({ ...p, _type: 'Software' })),
        ];

        let finalResponseText = "";
        let finalResults = [];

        try {
          // 1. Intentamos usar la IA Real (Gemini)
          const aiRes = await fetchGeminiResponse(query, allProjects);
          finalResponseText = aiRes.text;
          finalResults = aiRes.results;
        } catch (aiError) {
          // 2. FALLBACK: Si falla la IA o no hay API Key, usamos la lógica simulada
          console.warn("Fallback del Asistente activado:", aiError.message);

          // Agregamos un delay simulado solo si caemos en fallback para que no sea instantáneo
          await new Promise(resolve => setTimeout(resolve, 1000));

          finalResults = filterResults(proyectos3D, proyectosSoftware, query);

          if (finalResults.length === 0) {
            finalResponseText = `No encontré proyectos relacionados con **"${query}"**. Intenta con otra palabra clave como el tipo de tecnología o categoría.`;
          } else {
            finalResponseText = `Encontré **${finalResults.length} proyecto${finalResults.length !== 1 ? 's' : ''}** para *"${query}"*. Haz clic en uno para ver los detalles:`;
          }
        }

        // 3. Actualizamos el chat con los resultados
        setMessages((prev) => {
          const withoutTyping = prev.filter((m) => m.id !== typingId);

          const newMessages = [
            ...withoutTyping,
            {
              id: Date.now(),
              role: 'bot',
              type: 'text',
              text: finalResponseText,
            },
          ];

          if (finalResults.length > 0) {
            newMessages.push({
              id: Date.now() + 1,
              role: 'bot',
              type: 'results',
              results: finalResults,
            });
          }

          return newMessages;
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
    localStorage.removeItem('assistant_messages');
  }, []);

  return { messages, isLoading, handleSearch, resetChat };
}
