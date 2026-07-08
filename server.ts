import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API client on the server side
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API client initialized successfully with User-Agent headers.");
  }
  return aiClient;
}

// API endpoint for chatbot proxying
app.post("/api/chat", async (req, res) => {
  try {
    let ai;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      console.warn("Gemini client initialization failed:", e.message);
      return res.status(500).json({
        error: "Gemini API is not configured on the server. Please define GEMINI_API_KEY in secrets.",
      });
    }

    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid 'messages' format. Must be an array." });
    }

    // Map messages to the format expected by GoogleGenAI SDK
    // Each message must have contents and optional role: "user" | "model"
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Request Gemini model response
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction || "Eres 'Rider Buddy', el copiloto inteligente de BikerTrip. Eres un motero experto y entusiasta de las rutas. Ayuda a los usuarios con recomendaciones de rutas, consejos de equipamiento, preparación mecánica y resolución de dudas sobre viajes en moto en español. Sé amigable, directo, entusiasta y utiliza un lenguaje motero técnico pero accesible.",
          temperature: 0.7,
        }
      });
    } catch (apiError: any) {
      const errorStr = String(apiError.message || apiError);
      if (errorStr.includes("403") || errorStr.includes("denied") || errorStr.includes("permission") || errorStr.includes("PERMISSION_DENIED")) {
        console.log("Gemini API connection: regional restriction or status 403. Serving offline assistant response.");
        return res.json({
          reply: "¡Hola, compañero de ruta! Soy Rider Buddy, tu copiloto inteligente de BikerTrip. 🏍️\n\nActualmente, el servidor de la inteligencia artificial está experimentando un problema de permisos de acceso (Error 403: Proyecto denegado o restringido por límites regionales de Google AI Studio).\n\nPara solucionar esto, asegúrate de activar o configurar una clave API de Google AI Studio válida que tenga habilitado el acceso a Gemini 3.5. Mientras tanto, puedes explorar todo el catálogo de rutas de BikerTrip, reservar plazas, usar el mapa interactivo y gestionar tu cuenta con total normalidad. ¡Nos vemos en la carretera! ✌️"
        });
      }
      console.log("Gemini API connection status: standard message response limit reached.");
      return res.json({
        reply: "¡Hola! He tenido un problema al conectar con el servidor de inteligencia artificial. Por favor, inténtalo de nuevo en unos instantes."
      });
    }

    const replyText = response.text || "No se ha podido generar respuesta.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.log("Gemini API session: handled non-blocking exception.");
    res.json({ reply: "¡Hola! Por el momento el copiloto está fuera de cobertura. Disfruta de la ruta y vuelve a intentarlo más tarde." });
  }
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "ai-studio" });
});

// Serve application via Vite in development, or static assets in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupServer();
