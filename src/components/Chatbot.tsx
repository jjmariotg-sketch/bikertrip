import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, AlertTriangle } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "¡Hola motero! Soy **Rider Buddy**, tu copiloto inteligente de BikerTrip. 🏍️\n\n¿Estás pensando en tu próxima rodada? Puedo ayudarte a elegir la ruta perfecta según tu nivel, recomendarte qué equipamiento llevar (como maletas, monos para el frío o neumáticos) o darte consejos de mantenimiento mecánico. ¿A dónde te gustaría escapar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    if (!customText) {
      setInput("");
    }

    const newMessages = [...messages, { role: "user", content: textToSend } as ChatMessage];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error del servidor (${response.status})`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se ha podido conectar con Rider Buddy. Comprueba que tu GEMINI_API_KEY esté configurada en los Secretos.");
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    { label: "🏔️ ¿Qué equipamiento llevo a los Alpes?", text: "Quiero saber qué equipamiento, maletas y ropa recomiendas para rodar por los Alpes en verano." },
    { label: "🇳🇴 Consejos para clima en Noruega", text: "¿Qué consejos mecánicos y de ropa me das para aguantar la lluvia y el frío de los Fiordos Noruegos?" },
    { label: "🏍️ ¿Ruta para principiantes?", text: "¿Cuál de las rutas de BikerTrip me recomiendas si estoy empezando y quiero rodar tranquilo?" },
  ];

  return (
    <>
      {/* Floating launcher badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary-container text-on-primary-container rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary-container/30 border border-primary/20 group"
        title="Chat con Copiloto de Inteligencia Artificial"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Sparkles className="absolute -top-3 -right-3 w-5 h-5 text-primary animate-pulse" />
            <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          </div>
        )}
      </button>

      {/* Chat window container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-32px)] h-[550px] z-50 glass-panel rounded-3xl overflow-hidden flex flex-col border border-glass-border shadow-2xl transition-all duration-300 transform scale-100 origin-bottom-right animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-surface-container to-surface-container-high border-b border-glass-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-on-surface">Rider Buddy</h4>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">IA Copiloto de Ruta</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-[#0F1115]/90">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary-container text-white rounded-br-none"
                      : "bg-surface-container-high border border-glass-border text-on-surface rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[9px] text-on-surface-variant/50 uppercase font-mono mt-1 px-1">
                  {m.role === "user" ? "Tú" : "Rider Buddy Copilot"}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-on-surface-variant/70 bg-surface-container-low px-4 py-3 rounded-2xl rounded-bl-none w-max max-w-[80%] border border-glass-border">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-mono">Buddy está pensando su consejo...</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl flex items-start gap-2.5 text-error text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error de conexión</p>
                  <p className="mt-1 leading-normal">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Presets suggestions if thread is short */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-surface-container-lowest/50 border-t border-glass-border space-y-1.5">
              <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider">Sugerencias rápidas:</p>
              <div className="flex flex-col gap-1">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(undefined, p.text)}
                    className="text-left text-xs bg-surface-container hover:bg-surface-container-high text-primary hover:text-white px-3 py-1.5 rounded-lg border border-glass-border transition-colors truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-surface-container border-t border-glass-border flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre equipaje, motos, rutas..."
              disabled={loading}
              className="flex-1 bg-surface-container-low border border-glass-border rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-primary text-on-primary p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
