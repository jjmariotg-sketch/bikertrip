import React, { useState, useEffect } from "react";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Award, 
  Download, 
  Trash2, 
  Copy, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Star, 
  Menu, 
  Users, 
  TrendingUp, 
  BarChart2, 
  AlertTriangle,
  User,
  Shield,
  Send,
  Sparkles,
  Info,
  Home,
  Globe,
  Clock,
  Activity,
  Gauge,
  Bike,
  Mail,
  Lock,
  X,
  Sun,
  Moon
} from "lucide-react";

import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  seedDatabaseIfEmpty,
  fetchTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  fetchUserBookings,
  addBooking,
  deleteBooking,
  fetchReviews,
  addReview,
  deleteReview,
  Trip,
  Booking,
  Review
} from "./lib/firebase";

import Chatbot from "./components/Chatbot";
import TripModal from "./components/TripModal";
import ReviewsView from "./components/ReviewsView";
import RouteMap from "./components/RouteMap";

// Current mock user ID for demo purposes
const DEMO_USER = {
  uid: "demo-jjmario-123",
  email: "jjmariotg@gmail.com",
  displayName: "JJMario (Admin)",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
};

interface LandingPageViewProps {
  trips: Trip[];
  onExploreTrips: (difficulty?: string, search?: string) => void;
  onDemoAccess: () => void;
  currentUser: any;
}

function LandingPageView({ trips, onExploreTrips, onDemoAccess, currentUser }: LandingPageViewProps) {
  const [speed, setSpeed] = useState(108);
  const [distance, setDistance] = useState(42.8);
  const [altitude, setAltitude] = useState(1240);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const diff = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -(Math.floor(Math.random() * 3) + 1);
        const nextSpeed = prev + diff;
        return nextSpeed < 94 ? 94 : nextSpeed > 116 ? 116 : nextSpeed;
      });
      setDistance((prev) => {
        const nextDist = prev - 0.1;
        return nextDist <= 0.5 ? 42.8 : parseFloat(nextDist.toFixed(1));
      });
      setAltitude((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return prev + change;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleShareLocation = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const faqs = [
    {
      q: "¿Qué nivel de experiencia de conducción se requiere?",
      a: "Ofrecemos rutas para todos los niveles, clasificadas como 'Fácil' (para principiantes con carnet vigente), 'Medio' (carreteras reviradas convencionales) y 'Duro' (tramos exigentes off-road o jornadas de más de 400km). En la ficha de cada ruta encontrarás los requisitos recomendados."
    },
    {
      q: "¿Está incluido el alquiler de la motocicleta?",
      a: "BikerTrip es una plataforma flexible. Puedes realizar la ruta con tu propia moto o solicitar nuestro servicio de alquiler asociado de BMW Motorrad o Ducati. Contáctanos por el Chatbot de IA para gestionar tu reserva de moto."
    },
    {
      q: "¿Cómo funciona el seguimiento de Firebase en tiempo real?",
      a: "Nuestra aplicación móvil se conecta a una base de datos Firebase en la nube. Durante la ruta, cada piloto transmite su geolocalización de forma encriptada, permitiendo al líder y al coche de asistencia visualizar el grupo completo en el mapa interactivo."
    },
    {
      q: "¿Qué ocurre en caso de avería o emergencia?",
      a: "Todas nuestras rutas guiadas cuentan con un vehículo de asistencia escoba con remolque para motos, herramientas profesionales, recambios básicos y un paramédico certificado. Tu seguridad es nuestra absoluta prioridad."
    }
  ];

  // Pick up to 3 trips to spotlight
  const spotlightTrips = trips.slice(0, 3);

  return (
    <div className="space-y-16 animate-fade-in text-left">
      {/* 1. HERO SECTION WITH TELEMETRY WIDGET */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Left Side Copy */}
        <div className="lg:col-span-5 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            BikerTrip Motor Aventuras
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-none">
            Domina el Asfalto, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
              Conquista la Ruta
            </span>
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
            BikerTrip es la plataforma de aventuras definitiva para apasionados de las dos ruedas. Encuentra rutas guiadas legendarias, comparte telemetría en tiempo real sincronizada mediante <span className="text-primary font-semibold">Firebase</span> y experimenta la camaradería en ruta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => onExploreTrips()}
              className="px-6 py-3.5 bg-primary text-[#0F1115] font-extrabold rounded-xl text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 glow-btn cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 shrink-0" />
              Explorar Catálogo
            </button>

            {!currentUser && (
              <button
                onClick={onDemoAccess}
                className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-high border border-glass-border text-white font-bold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-primary shrink-0" />
                Acceder como Piloto Demo
              </button>
            )}
          </div>

          {/* Quick trust metrics */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-glass-border">
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">KM Recorridos</p>
              <p className="text-xl font-extrabold text-white font-mono mt-0.5">142K+</p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Rutas Activas</p>
              <p className="text-xl font-extrabold text-white font-mono mt-0.5">{trips.length || 8}</p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono">Feedback</p>
              <p className="text-xl font-extrabold text-white font-mono mt-0.5 flex items-center gap-1">4.9 <Star className="w-4 h-4 fill-primary text-primary" /></p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Promotional Banner (Reclamo Publicitario) */}
        <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden border border-glass-border shadow-2xl aspect-[16/10] bg-[#16191F] flex flex-col justify-end">
          {/* Main Hero Promotional Image */}
          <img 
            src="/src/assets/images/biker_desert_adventure_1783501844145.jpg" 
            alt="Expedición Biker Desert Adventure" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Elegant Dark Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-black/10 to-black/30"></div>
          
          {/* Floating Promotional Badges */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-[#ff7a00] text-black font-extrabold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-1 select-none">
              ★ NUEVA RUTA
            </span>
            <span className="bg-black/60 backdrop-blur-md text-white font-extrabold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-xl border border-glass-border select-none">
              EXPLORACIÓN 2026
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-[#10B981] text-white font-extrabold text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-lg border border-white/10 select-none">
            ¡INSCRIPCIONES ABIERTAS!
          </div>

          {/* Bottom Advertising Text Overlay */}
          <div className="relative z-10 p-6 md:p-8 bg-[#0F1115]/95 border-t border-glass-border/40 backdrop-blur-md space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest block font-mono">RECLAMO EXCLUSIVO BIKERTRIP</span>
              <h3 className="text-white font-display font-extrabold text-xl md:text-2xl tracking-tight leading-snug">
                Expedición Almería-Granada: Conquista el Desierto
              </h3>
            </div>
            <p className="text-on-surface-variant text-xs leading-relaxed max-w-xl">
              Siente la libertad absoluta surcando los paisajes más indómitos de Andalucía. Un viaje épico de 3 días atravesando pistas desérticas y puertos de montaña legendarios. Reserva hoy con nuestro descuento de lanzamiento del <span className="text-primary font-bold">15%</span>.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1.5 text-[10px] font-mono text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Distancia: <strong className="text-white">420 km</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Duración: <strong className="text-white">3 Días</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Nivel: <strong className="text-white">Medio-Alto</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span className="text-[#10B981] font-bold">Últimas 3 plazas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS - GEOMETRIC BLOCKS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-mono">¿Por Qué BikerTrip?</h3>
          <p className="text-2xl md:text-3xl font-display font-extrabold text-white">Ingeniería para el Viaje Perfecto</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Hemos redefinido el viaje de aventura integrando hardware de seguimiento, telemetría y guías en ruta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#16191F] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-4 font-mono text-3xl font-black text-slate-800/50 select-none group-hover:text-primary/10 transition-colors">01</div>
            <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center mb-5">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Sincronización en Tiempo Real</h4>
            <p className="text-xs text-on-surface-variant/95 mt-2.5 leading-relaxed">
              Mediante la base de datos distribuida de Firebase, todos los integrantes del grupo conocen la ubicación exacta del resto del equipo, incluso en tramos de baja señal.
            </p>
          </div>

          <div className="bg-[#16191F] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-4 font-mono text-3xl font-black text-slate-800/50 select-none group-hover:text-primary/10 transition-colors">02</div>
            <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center mb-5">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Rutas Milimétricamente Trazadas</h4>
            <p className="text-xs text-on-surface-variant/95 mt-2.5 leading-relaxed">
              Nuestros guías certificados estudian previamente las paradas de repostaje, estado del asfalto, curvas ideales y puntos turísticos icónicos para entregarte el viaje ideal.
            </p>
          </div>

          <div className="bg-[#16191F] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-4 font-mono text-3xl font-black text-slate-800/50 select-none group-hover:text-primary/10 transition-colors">03</div>
            <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center mb-5">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Comunidad y Logística</h4>
            <p className="text-xs text-on-surface-variant/95 mt-2.5 leading-relaxed">
              No tienes que preocuparte por hoteles, permisos internacionales o reservas. BikerTrip gestiona la logística de soporte escoba y hotelera para que solo disfrutes conducir.
            </p>
          </div>
        </div>
      </section>

      {/* 4. DRIVER FAQs - INTERACTIVE ACCORDION */}
      <section className="space-y-8 bg-[#16191F] p-6 md:p-10 rounded-3xl border border-slate-800">
        <div className="max-w-xl text-left space-y-2">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-mono">Preguntas Frecuentes</h3>
          <p className="text-2xl md:text-3xl font-display font-extrabold text-white">Manual del Conductor BikerTrip</p>
          <p className="text-sm text-on-surface-variant">
            Todo lo que necesitas saber antes de subir el embrague y arrancar el motor en tu próxima gran aventura.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border-b border-slate-800 pb-4 transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left py-2 font-semibold text-sm md:text-base text-white hover:text-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mt-2.5 animate-fade-in pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. NEWSLETTER CTA BOX */}
      <section className="relative p-8 md:p-12 rounded-3xl overflow-hidden glass-panel glowing-accent border border-glass-border bg-gradient-to-tr from-[#16191F] to-[#0A0B0E]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block px-2.5 py-0.5 bg-primary/20 text-primary border border-primary/20 text-[9px] uppercase tracking-widest font-bold font-mono rounded">Suscripción Premium</span>
            <h3 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight leading-tight">
              ¿Quieres enterarte de las <br />
              <span className="text-primary">Nuevas Rutas antes de que se agoten?</span>
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant/90 max-w-md leading-relaxed">
              Únete a nuestro club de carretera privado. Recibe alertas instantáneas de aperturas de reservas, tips de conducción extrema y crónicas de expediciones moteras.
            </p>
          </div>
          <div className="lg:col-span-5 bg-[#0F1115]/80 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-3">Newsletter BikerTrip</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Suscripción confirmada! Revisa tu bandeja de entrada.");
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico..."
                required
                className="w-full px-4 py-3 bg-[#16191F] border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-primary transition-all font-mono"
              />
              <button
                type="submit"
                className="w-full py-3 bg-primary text-[#0F1115] font-extrabold rounded-xl text-xs uppercase tracking-widest transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              >
                Suscribirme al Club de Carretera
              </button>
            </form>
            <p className="text-[10px] text-slate-500 mt-3 text-center">Spam libre. Puedes darte de baja en cualquier momento.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(DEMO_USER);
  const [activeTab, setActiveTab] = useState<"landing" | "catalog" | "user" | "admin" | "reviews">("landing");
  const [adminSubTab, setAdminSubTab] = useState<"dashboard" | "pilot">("dashboard");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [mapSelectedLocation, setMapSelectedLocation] = useState<string | null>(null);
  const [selectedMapTrip, setSelectedMapTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isAdminUser = (user: any) => {
    if (!user) return false;
    return (
      user.email === "jjmariotg@gmail.com" ||
      user.email === "admin@bikertrip.com" ||
      user.uid === "demo-jjmario-123" ||
      user.uid === "demo-admin-uid"
    );
  };

  useEffect(() => {
    if ((activeTab === "user" || activeTab === "admin") && !isAdminUser(currentUser)) {
      setActiveTab("landing");
    }
  }, [activeTab, currentUser]);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Email/Password Auth Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Toast / Feedback states
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Newsletter email
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Handle Auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser((prev: any) => {
          if (prev && prev.uid === DEMO_USER.uid) {
            return prev;
          }
          return null;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Seed database and fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Firebase request timeout")), 3000);
      });

      try {
        // Run seed database helper to clean old routes and keep only Alpujarra
        await seedDatabaseIfEmpty();

        const loadedTrips = await Promise.race([
          fetchTrips(),
          timeoutPromise
        ]) as Trip[];

        setTrips(loadedTrips || []);

        try {
          const loadedReviews = await fetchReviews();
          setReviews(loadedReviews || []);
        } catch (revErr) {
          console.warn("Could not fetch reviews:", revErr);
        }

        if (currentUser) {
          if (currentUser.uid === DEMO_USER.uid) {
            const local = localStorage.getItem("demo_bookings");
            setBookings(local ? JSON.parse(local) : []);
          } else {
            const loadedBookings = await Promise.race([
              fetchUserBookings(currentUser.uid),
              timeoutPromise
            ]) as Booking[];
            setBookings(loadedBookings || []);
          }
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.warn("Error fetching routes from Firebase:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Auth helper
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      showToast("Sesión iniciada con Google", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Error al iniciar sesión con Google", "error");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthActionLoading(true);

    try {
      if (authMode === "register") {
        if (!authName.trim()) {
          throw new Error("El nombre es requerido para el registro.");
        }
        if (authPassword.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        // Register user
        const credential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        // Update user profile display name
        await updateProfile(credential.user, {
          displayName: authName.trim()
        });
        
        // Refresh local currentUser state with updated profile details
        setCurrentUser({
          ...credential.user,
          displayName: authName.trim()
        });

        showToast("Registro exitoso. ¡Bienvenido!", "success");
      } else {
        // Login user
        const credential = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        setCurrentUser(credential.user);
        showToast("Sesión iniciada con éxito", "success");
      }

      // Reset and close modal
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Error en el proceso de autenticación";
      if (err.code === "auth/email-already-in-use") {
        errorMsg = "Este correo ya está registrado.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMsg = "Correo o contraseña incorrectos o cuenta inexistente.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "El correo electrónico no es válido.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      showToast("Sesión cerrada", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUseDemo = () => {
    setCurrentUser(DEMO_USER);
    showToast("Accediendo en Modo Administrador (JJMario Demo)", "success");
  };

  // Helper to trigger toast
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // CRUD Actions for Trips
  const handleSaveTrip = async (tripData: Trip) => {
    try {
      if (tripData.id) {
        // Edit Mode
        const originalTrip = trips.find((t) => t.id === tripData.id);
        if (originalTrip && originalTrip.name === "Alpujarra") {
          showToast("La ruta oficial de 'Alpujarra' es de solo lectura y no se puede editar ni modificar.", "error");
          return;
        }
        await updateTrip(tripData.id, tripData);
        setTrips((prev) => prev.map((t) => (t.id === tripData.id ? tripData : t)));
        showToast("Ruta actualizada con éxito", "success");
      } else {
        // Create Mode
        const newId = await addTrip(tripData);
        const newTrip = { ...tripData, id: newId };
        setTrips((prev) => [newTrip, ...prev]);
        showToast("Nueva ruta creada con éxito", "success");
      }
      setIsModalOpen(false);
      setEditingTrip(null);
    } catch (err) {
      console.error(err);
      showToast("Error al guardar la ruta", "error");
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    const tripToDelete = trips.find((t) => t.id === tripId);
    if (tripToDelete && tripToDelete.name === "Alpujarra") {
      showToast("La ruta oficial de 'Alpujarra' no se puede eliminar.", "error");
      return;
    }
    if (!window.confirm("¿Seguro que quieres eliminar esta ruta de aventura?")) return;
    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      showToast("Ruta eliminada correctamente", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al eliminar la ruta", "error");
    }
  };

  const handleDuplicateTrip = async (trip: Trip) => {
    try {
      const duplicated: Trip = {
        ...trip,
        name: `${trip.name} (Copia)`,
        bookedSeats: 0, // Reset occupancy
      };
      delete duplicated.id; // Remove Firestore ID so it generates a new one

      const newId = await addTrip(duplicated);
      const newTrip = { ...duplicated, id: newId };
      setTrips((prev) => [newTrip, ...prev]);
      showToast("Ruta duplicada correctamente", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al duplicar la ruta", "error");
    }
  };

  const handleCreateReview = async (reviewData: Review) => {
    try {
      const newId = await addReview(reviewData);
      const newReview = { ...reviewData, id: newId };
      setReviews((prev) => [newReview, ...prev]);
      showToast("¡Reseña publicada con éxito!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al publicar la reseña", "error");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar tu opinión?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast("Opinión eliminada con éxito", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al eliminar la opinión", "error");
    }
  };

  // Booking process
  const handleBookTrip = async (trip: Trip) => {
    if (!currentUser) {
      showToast("Inicia sesión o usa el modo Demo para reservar", "error");
      return;
    }

    if (trip.bookedSeats >= trip.totalSeats) {
      showToast("Esta ruta ya está al completo", "error");
      return;
    }

    // Check if already booked
    const alreadyBooked = bookings.some((b) => b.tripId === trip.id && b.status !== "Cancelado");
    if (alreadyBooked) {
      showToast("Ya tienes una reserva activa para esta ruta", "error");
      return;
    }

    try {
      const newBooking: Booking = {
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        userName: currentUser.displayName || "Piloto de Prueba",
        tripId: trip.id || "",
        tripName: trip.name,
        bookingDate: new Date().toLocaleDateString("es-ES"),
        status: "Confirmado",
        seats: 1,
        priceTotal: trip.price,
      };

      if (currentUser.uid === DEMO_USER.uid) {
        // Handle Demo User bookings via local storage
        const demoBooking: Booking = {
          id: `demo-booking-${Date.now()}`,
          ...newBooking
        };
        const currentDemoBookings = JSON.parse(localStorage.getItem("demo_bookings") || "[]");
        const updatedDemoBookings = [...currentDemoBookings, demoBooking];
        localStorage.setItem("demo_bookings", JSON.stringify(updatedDemoBookings));
        setBookings(updatedDemoBookings);

        // Update seats count and bookedByUserIds in trip collection (allowed for everyone)
        if (trip.id) {
          const updatedSeats = trip.bookedSeats + 1;
          const currentBookedUserIds = trip.bookedByUserIds || [];
          const updatedBookedUserIds = currentBookedUserIds.includes(currentUser.uid)
            ? currentBookedUserIds
            : [...currentBookedUserIds, currentUser.uid];

          await updateTrip(trip.id, { 
            bookedSeats: updatedSeats,
            bookedByUserIds: updatedBookedUserIds
          });
          setTrips((prev) => prev.map((t) => t.id === trip.id ? { 
            ...t, 
            bookedSeats: updatedSeats,
            bookedByUserIds: updatedBookedUserIds
          } : t));
        }

        showToast(`¡Reserva confirmada para ${trip.name}!`, "success");
        if (isAdminUser(currentUser)) {
          setActiveTab("admin");
          setAdminSubTab("pilot");
        } else {
          setActiveTab("catalog");
        }
      } else {
        await addBooking(newBooking);
        
        // Update seats count and bookedByUserIds in trip collection
        if (trip.id) {
          const updatedSeats = trip.bookedSeats + 1;
          const currentBookedUserIds = trip.bookedByUserIds || [];
          const updatedBookedUserIds = currentBookedUserIds.includes(currentUser.uid)
            ? currentBookedUserIds
            : [...currentBookedUserIds, currentUser.uid];

          await updateTrip(trip.id, { 
            bookedSeats: updatedSeats,
            bookedByUserIds: updatedBookedUserIds
          });
          setTrips((prev) => prev.map((t) => t.id === trip.id ? { 
            ...t, 
            bookedSeats: updatedSeats,
            bookedByUserIds: updatedBookedUserIds
          } : t));
        }

        // Update bookings list
        const userBookings = await fetchUserBookings(currentUser.uid);
        setBookings(userBookings);

        showToast(`¡Reserva confirmada para ${trip.name}!`, "success");
        if (isAdminUser(currentUser)) {
          setActiveTab("admin");
          setAdminSubTab("pilot");
        } else {
          setActiveTab("catalog");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Error al procesar la reserva", "error");
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (!window.confirm(`¿Seguro que quieres cancelar tu reserva de "${booking.tripName}"?`)) return;

    try {
      // Find trip and decrement seats and remove booked user ID
      const matchingTrip = trips.find((t) => t.id === booking.tripId);
      if (matchingTrip && matchingTrip.id) {
        const updatedSeats = Math.max(0, matchingTrip.bookedSeats - 1);
        const currentBookedUserIds = matchingTrip.bookedByUserIds || [];
        const updatedBookedUserIds = currentBookedUserIds.filter((uid) => uid !== booking.userId);

        await updateTrip(matchingTrip.id, { 
          bookedSeats: updatedSeats,
          bookedByUserIds: updatedBookedUserIds
        });
        setTrips((prev) => prev.map((t) => t.id === matchingTrip.id ? { 
          ...t, 
          bookedSeats: updatedSeats,
          bookedByUserIds: updatedBookedUserIds
        } : t));
      }

      if (currentUser && currentUser.uid === DEMO_USER.uid) {
        const currentDemoBookings = JSON.parse(localStorage.getItem("demo_bookings") || "[]");
        const updatedDemoBookings = currentDemoBookings.filter((b: any) => b.id !== booking.id);
        localStorage.setItem("demo_bookings", JSON.stringify(updatedDemoBookings));
        setBookings(updatedDemoBookings);
      } else {
        await deleteBooking(booking.id || "");
        setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      }
      showToast("Reserva cancelada correctamente", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al cancelar la reserva", "error");
    }
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    showToast("¡Te has suscrito al newsletter del motero!", "success");
    setNewsletterEmail("");
  };

  // Filter and search logic for Catalog
  const filteredTrips = trips.filter((trip) => {
    // Hide trips booked by other users:
    // If a trip has been booked/chosen by anyone, and the current user is not in that list, hide it.
    const isBookedBySomeoneElse = trip.bookedByUserIds && 
                                  trip.bookedByUserIds.length > 0 && 
                                  (!currentUser || !trip.bookedByUserIds.includes(currentUser.uid));
    if (isBookedBySomeoneElse) {
      return false;
    }

    const matchesSearch = (trip.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (trip.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || (trip.difficulty || "").toLowerCase() === difficultyFilter.toLowerCase();
    const matchesMap = !mapSelectedLocation || (trip.location || "").toLowerCase() === mapSelectedLocation.toLowerCase();

    return matchesSearch && matchesDifficulty && matchesMap;
  });

  // Calculations for Stats (Admin)
  const totalSalesVal = trips.reduce((acc, t) => acc + (t.bookedSeats * t.price), 0);
  const totalSeatsAvail = trips.reduce((acc, t) => acc + t.totalSeats, 0);
  const totalSeatsBooked = trips.reduce((acc, t) => acc + t.bookedSeats, 0);
  const averageOccupancy = totalSeatsAvail > 0 ? Math.round((totalSeatsBooked / totalSeatsAvail) * 100) : 0;

  // Europe/World interactive map coordinates
  const MAP_MARKERS = [
    { name: "Noruega", x: 190, y: 55, count: 2, label: "Noruega (Fiordos / Cabo Norte)" },
    { name: "Alpes", x: 185, y: 120, count: 1, label: "Alpes (Suiza/Italia)" },
    { name: "España", x: 135, y: 155, count: 2, label: "España (Pirineos / Picos de Europa)" },
    { name: "EEUU", x: 45, y: 110, count: 1, label: "Ruta 66 (EEUU)" },
    { name: "Argentina", x: 85, y: 240, count: 1, label: "Patagonia (Fin del Mundo)" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0F1115] text-on-surface select-none pb-12">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in-50 slide-in-from-top-12 border ${
          feedbackMsg.type === "success" 
            ? "bg-green-950/90 text-green-300 border-green-500/30" 
            : "bg-red-950/90 text-red-300 border-red-500/30"
        }`}>
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Hero Header with dynamic tabs */}
      <header className="border-b border-glass-border bg-[#16191F] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              onClick={() => setActiveTab("landing")} 
              className="flex items-center cursor-pointer group transition-all h-20"
            >
              <img 
                src="/src/assets/images/bikertrip_logo_clean_1783505511852.jpg" 
                alt="BikerTrip Logo" 
                referrerPolicy="no-referrer"
                className="h-16 w-auto object-contain group-hover:scale-105 transition-all duration-300"
              />
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex bg-surface-container rounded-2xl p-1 border border-glass-border">
              <button
                onClick={() => setActiveTab("landing")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "landing" 
                    ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10" 
                    : "text-on-surface-variant hover:text-white hover:bg-white/5"
                }`}
              >
                <Home className="w-4 h-4" />
                Inicio
              </button>

              <button
                onClick={() => { setActiveTab("catalog"); setMapSelectedLocation(null); }}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "catalog" 
                    ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10" 
                    : "text-on-surface-variant hover:text-white hover:bg-white/5"
                }`}
              >
                <Compass className="w-4 h-4" />
                Explorar Catálogo
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "reviews" 
                    ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10" 
                    : "text-on-surface-variant hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Reseñas
              </button>

              {isAdminUser(currentUser) && (
                <button
                  onClick={() => { setActiveTab("admin"); setAdminSubTab("dashboard"); }}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "admin" 
                      ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10" 
                      : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Panel de Control
                </button>
              )}
            </nav>

            {/* Session Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 bg-surface-container-low hover:bg-surface-container-high border border-glass-border rounded-xl text-on-surface-variant hover:text-primary transition-all cursor-pointer flex items-center justify-center"
                title={theme === "light" ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
              >
                {theme === "light" ? <Moon className="w-4.5 h-4.5 text-slate-700" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-3 bg-surface-container-high border border-glass-border px-3.5 py-1.5 rounded-2xl">
                  {currentUser.photoURL && (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName} 
                      className="w-8 h-8 rounded-full border border-primary/40 referrerPolicy='no-referrer'" 
                    />
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{currentUser.displayName}</p>
                    <p className="text-[9px] text-on-surface-variant/70 truncate uppercase font-mono tracking-wider">Piloto</p>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    title="Cerrar Sesión" 
                    className="p-1 hover:bg-white/10 rounded text-on-surface-variant hover:text-error transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUseDemo}
                    className="px-3 py-1.5 bg-surface-container border border-glass-border rounded-xl text-xs font-bold hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Demo JJMario (Admin)
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    Entrar / Registrarse
                  </button>
                  <button
                    onClick={handleGoogleSignIn}
                    className="px-3 py-1.5 bg-primary text-[#0F1115] rounded-xl text-xs font-bold glow-btn transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Google
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation on Mobile */}
      <div className="md:hidden flex justify-around bg-[#16191F] border-b border-glass-border py-2 px-1">
        <button
          onClick={() => setActiveTab("landing")}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${
            activeTab === "landing" ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          <Home className="w-4 h-4" />
          Inicio
        </button>
        <button
          onClick={() => { setActiveTab("catalog"); setMapSelectedLocation(null); }}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${
            activeTab === "catalog" ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          <Compass className="w-4 h-4" />
          Explorar
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${
            activeTab === "reviews" ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Reseñas
        </button>
        {isAdminUser(currentUser) && (
          <button
            onClick={() => { setActiveTab("admin"); setAdminSubTab("dashboard"); }}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 ${
              activeTab === "admin" ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <Shield className="w-4 h-4" />
            Control
          </button>
        )}
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-1 w-full">
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-3">
            <span className="relative flex h-8 w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-primary"></span>
            </span>
            <p className="text-sm font-mono text-on-surface-variant/60 animate-pulse uppercase tracking-widest">Iniciando sistemas BikerTrip...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            
            {/* VIEW 0: LANDING PAGE */}
            {activeTab === "landing" && (
              <LandingPageView 
                trips={trips}
                onExploreTrips={(difficulty, search) => {
                  setActiveTab("catalog");
                  setMapSelectedLocation(null);
                  if (difficulty) setDifficultyFilter(difficulty);
                  else setDifficultyFilter("all");
                  if (search) setSearchTerm(search);
                  else setSearchTerm("");
                }}
                onDemoAccess={handleUseDemo}
                currentUser={currentUser}
              />
            )}

            {/* VIEW 1: EXPLORAR CATALOGO (HOME) */}
            {activeTab === "catalog" && (
              <div className="space-y-8">
                {/* Intro Hero Header */}
                <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden glass-panel glowing-accent border border-glass-border">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="max-w-2xl relative z-10 text-left">
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-primary/20">
                      Rutas de Ensueño 2026/2027
                    </span>
                    <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
                      Próximas Salidas para <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Explorar el Mundo</span>
                    </h2>
                    <p className="mt-4 text-on-surface-variant text-base md:text-lg leading-relaxed">
                      Planifica, haz tu reserva y prepárate para recorrer los lugares más inhóspitos del planeta. Todo sincronizado en la nube de forma transparente y guiado por nuestra inteligencia artificial experta.
                    </p>
                  </div>
                </div>

                {/* Grid layout containing Interactive Map and Search filters */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Interactive Map */}
                  <div className="lg:col-span-8 glass-panel rounded-3xl p-6 flex flex-col border border-glass-border bg-surface-container-low relative justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-white">Mapa de Expediciones Activas</h3>
                        <p className="text-xs text-on-surface-variant/70">Visualiza el itinerario y los puntos de inicio (A) y fin (B) de cada viaje</p>
                      </div>
                      {selectedMapTrip && (
                        <button
                          onClick={() => setSelectedMapTrip(null)}
                          className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-semibold hover:bg-primary/30 transition-all cursor-pointer"
                        >
                          Mostrar todos los destinos
                        </button>
                      )}
                    </div>

                    <div className="flex-1 w-full min-h-[350px]">
                      <RouteMap 
                        trips={trips} 
                        selectedTrip={selectedMapTrip} 
                        onSelectTrip={setSelectedMapTrip} 
                      />
                    </div>
                  </div>

                  {/* Right Column: Search, Stats Sidebar & Newsletter */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Filter Container */}
                    <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container-low text-left space-y-4">
                      <h3 className="font-bold text-base text-white flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        Filtrar Aventuras
                      </h3>

                      {/* Search */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide">Buscar por nombre o país</label>
                        <div className="relative">
                          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/40" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ej. Alpes, Noruega, Pirineos..."
                            className="w-full bg-surface-container-low border border-glass-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
                          />
                        </div>
                      </div>

                      {/* Difficulty Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wide">Dificultad de la ruta</label>
                        <select
                          value={difficultyFilter}
                          onChange={(e) => setDifficultyFilter(e.target.value)}
                          className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
                        >
                          <option value="all">Todas las dificultades</option>
                          <option value="iniciación">Iniciación</option>
                          <option value="fácil">Fácil</option>
                          <option value="media">Media / Intermedio</option>
                          <option value="avanzado">Avanzado / Duro</option>
                        </select>
                      </div>

                      {/* Quick advice callout */}
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-on-surface-variant leading-normal">
                          ¿No tienes claro cuál es tu nivel de conducción? Pregúntale a nuestro copiloto **Rider Buddy** flotante en la esquina inferior derecha.
                        </p>
                      </div>
                    </div>

                    {/* Custom Tailored Tour Request */}
                    <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-gradient-to-br from-surface-container-low to-primary-container/10 text-left relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
                        <Compass className="w-36 h-36" />
                      </div>
                      <h3 className="font-bold text-base text-white mb-2">¿Ruta a Medida?</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                        Diseñamos el itinerario soñado para ti y tu grupo de amigos: hoteles, alquiler de motos de trail/carretera, asistencia en coche y guías experimentados.
                      </p>
                      <button 
                        onClick={() => {
                          showToast("Solicitud de itinerario a medida enviada. ¡Nos vemos en carretera!", "success");
                        }}
                        className="w-full py-2.5 bg-surface-container border border-primary text-primary hover:bg-primary hover:text-[#0F1115] rounded-xl font-bold text-xs transition-all cursor-pointer"
                      >
                        Contactar con Diseñador de Rutas
                      </button>
                    </div>

                    {/* Newsletter Subscribe */}
                    <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container-low text-left">
                      <h3 className="font-bold text-base text-white mb-1">Boletín del Motero</h3>
                      <p className="text-xs text-on-surface-variant/70 mb-4">Recibe consejos de mecánica, nuevas rutas exclusivas y cupones de descuento.</p>
                      
                      {newsletterSubscribed ? (
                        <div className="p-3.5 bg-green-950/40 border border-green-500/30 rounded-2xl flex items-center gap-2 text-green-400 text-xs font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          ¡Suscrito correctamente! Revisa tu bandeja de entrada.
                        </div>
                      ) : (
                        <form onSubmit={handleSubscribeNewsletter} className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Tu correo electrónico"
                            className="flex-1 bg-surface-container-low border border-glass-border rounded-xl px-3 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-primary transition-all"
                          />
                          <button
                            type="submit"
                            className="bg-primary text-[#0F1115] px-4 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            Unirse
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid of Trip Cards */}
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-2xl text-white">Catálogo de Salidas Programadas</h3>
                      <p className="text-sm text-on-surface-variant">Mostrando {filteredTrips.length} de {trips.length} expediciones organizadas</p>
                    </div>
                  </div>

                  {trips.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-glass-border rounded-3xl bg-surface-container-low max-w-xl mx-auto space-y-4">
                      <Compass className="w-12 h-12 text-primary mx-auto animate-pulse" />
                      <h4 className="text-white font-bold text-lg">No hay rutas programadas en la plataforma</h4>
                      <p className="text-on-surface-variant text-sm">
                        Actualmente no hay ninguna expedición activa en BikerTrip. El administrador creará y programará nuevas rutas próximamente.
                      </p>
                      <button
                        onClick={() => setActiveTab("admin")}
                        className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Ir a Gestión Admin para Crear la Primera Ruta
                      </button>
                    </div>
                  ) : filteredTrips.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-glass-border rounded-3xl bg-surface-container-low">
                      <Compass className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3 animate-bounce" />
                      <p className="text-on-surface-variant text-sm font-mono uppercase tracking-widest">Ninguna ruta coincide con los filtros</p>
                      <button
                        onClick={() => { setSearchTerm(""); setDifficultyFilter("all"); setMapSelectedLocation(null); }}
                        className="mt-3 text-xs text-primary font-bold hover:underline"
                      >
                        Limpiar todos los filtros
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTrips.map((trip, idx) => {
                        const occupancyPercent = Math.round((trip.bookedSeats / trip.totalSeats) * 100);
                        const isFull = trip.bookedSeats >= trip.totalSeats;
                        const isAlmostFull = !isFull && (trip.totalSeats - trip.bookedSeats) <= 2;

                        const tripReviews = reviews.filter((r) => r.tripId === trip.id);
                        const hasReviews = tripReviews.length > 0;
                        const avgRoute = hasReviews 
                          ? (tripReviews.reduce((sum, r) => sum + r.ratingRoute, 0) / tripReviews.length).toFixed(1) 
                          : null;
                        const avgGuide = hasReviews 
                          ? (tripReviews.reduce((sum, r) => sum + r.ratingGuide, 0) / tripReviews.length).toFixed(1) 
                          : null;

                        return (
                          <div 
                            key={trip.id || `catalog-trip-${idx}-${trip.name}`}
                            className="group relative flex flex-col bg-surface-container rounded-3xl overflow-hidden border border-glass-border hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1.5"
                          >
                            {/* Trip Image & Badges */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                              <img 
                                src={trip.image} 
                                alt={trip.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100 referrerPolicy='no-referrer'" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                              
                              {/* Difficulty Tag */}
                              <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg shadow-lg border ${
                                trip.difficulty === "Duro" || trip.difficulty === "Avanzado"
                                  ? "bg-red-950/90 text-red-300 border-red-500/20"
                                  : trip.difficulty === "Media" || trip.difficulty === "Intermedio"
                                  ? "bg-amber-950/90 text-amber-300 border-amber-500/20"
                                  : "bg-green-950/90 text-green-300 border-green-500/20"
                              }`}>
                                {trip.difficulty}
                              </span>

                              {/* Days / Duration Tag */}
                              <span className="absolute top-4 right-4 bg-black/80 border border-glass-border text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shadow-lg">
                                {trip.duration || `${trip.days} días`}
                              </span>

                              {/* Status indicators */}
                              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <span className="text-white font-display font-extrabold text-xl">
                                  {trip.price.toLocaleString("es-ES")}€
                                </span>
                                
                                {isFull ? (
                                  <span className="bg-red-500 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                                    COMPLETO
                                  </span>
                                ) : isAlmostFull ? (
                                  <span className="bg-primary-container text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow animate-pulse">
                                    Últimas plazas
                                  </span>
                                ) : (
                                  <span className="bg-green-500 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                                    Plazas Libres
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Trip Body */}
                            <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                              <div>
                                <div className="flex items-center gap-1 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {trip.location} {trip.distance ? `• ${trip.distance}` : ""}
                                </div>
                                <h4 className="font-bold text-base text-white group-hover:text-primary transition-colors line-clamp-1">
                                  {trip.name}
                                </h4>
                                {hasReviews && (
                                  <div className="flex items-center gap-2.5 mt-1.5 text-[11px] font-semibold text-primary">
                                    <div className="flex items-center gap-0.5">
                                      <Star className="w-3 h-3 fill-primary text-primary" />
                                      <span className="text-slate-400 font-normal">Ruta:</span> <span className="text-white font-mono">{avgRoute}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      <span className="text-slate-400 font-normal">Guía:</span> <span className="text-amber-400 font-mono">{avgGuide}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab("reviews");
                                      }}
                                      className="text-[10px] text-primary hover:underline ml-auto cursor-pointer"
                                    >
                                      Opiniones ({tripReviews.length})
                                    </button>
                                  </div>
                                )}
                                <p className="text-xs text-on-surface-variant/80 leading-normal line-clamp-2 mt-2">
                                  {trip.description}
                                </p>
                              </div>

                              {/* Occupancy Indicator */}
                              <div className="space-y-1.5 pt-2 border-t border-glass-border/40">
                                <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-medium">
                                  <span>Ocupación de la Ruta</span>
                                  <span className="font-mono">{trip.bookedSeats} / {trip.totalSeats} Plazas ({occupancyPercent}%)</span>
                                </div>
                                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden border border-white/5">
                                  <div 
                                    style={{ width: `${occupancyPercent}%` }} 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isFull 
                                        ? "bg-red-500" 
                                        : isAlmostFull 
                                        ? "bg-primary-container" 
                                        : "bg-primary"
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2.5 pt-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMapTrip(trip);
                                    const mapElement = document.querySelector(".lg\\:col-span-8");
                                    if (mapElement) {
                                      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
                                    }
                                  }}
                                  className="flex-1 py-3 px-2 bg-[#1A1E26] border border-glass-border hover:bg-[#ff7a00]/10 hover:border-[#ff7a00]/30 rounded-xl font-bold text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <Compass className="w-3.5 h-3.5 text-[#ff7a00]" />
                                  Ver Mapa
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleBookTrip(trip)}
                                  disabled={isFull}
                                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                                    isFull 
                                      ? "bg-white/5 border border-glass-border text-on-surface-variant/40 cursor-not-allowed" 
                                      : "bg-primary text-[#0F1115] hover:scale-[1.02] active:scale-95 glow-btn font-extrabold"
                                  }`}
                                >
                                  {isFull ? "Completo" : "Reservar"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* VIEW 2: PANEL DE USUARIO (JJMARIO) */}
            {activeTab === "admin" && adminSubTab === "pilot" && (
              <div className="space-y-8 text-left animate-fade-in">
                {/* Segmented Control Selector */}
                <div className="flex justify-center sm:justify-start">
                  <div className="bg-[#16191F] border border-glass-border p-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                    <button
                      onClick={() => setAdminSubTab("dashboard")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        adminSubTab === "dashboard"
                          ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10"
                          : "text-on-surface-variant hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Gestión de Administración
                    </button>
                    <button
                      onClick={() => setAdminSubTab("pilot")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        adminSubTab === "pilot"
                          ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10"
                          : "text-on-surface-variant hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Mi Panel de Piloto
                    </button>
                  </div>
                </div>

                {/* Custom Banner Profile */}
                <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden glass-panel border border-glass-border flex flex-col md:flex-row items-center gap-6 justify-between bg-gradient-to-r from-surface-container to-surface-container-low">
                  <div className="absolute -right-12 -top-12 opacity-10 pointer-events-none transform rotate-12">
                    <Award className="w-48 h-48 text-primary" />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <img 
                      src={currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                      alt="JJMario (Admin)" 
                      className="w-16 h-16 rounded-full border-2 border-primary/40 shadow-xl referrerPolicy='no-referrer'"
                    />
                    <div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <h2 className="font-display font-extrabold text-2xl text-white">¡Hola, {currentUser?.displayName?.split(" ")[0] || "JJMario"}!</h2>
                        <span className="px-2.5 py-0.5 bg-primary-container text-white text-[9px] uppercase tracking-widest font-mono font-bold rounded-full border border-primary/20">
                          Piloto Experto
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant/80 mt-1">Miembro de BikerTrip desde Marzo 2024 • ID: {currentUser?.uid?.substring(0, 8)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-[#0A0B0E] border border-glass-border px-4 py-2.5 rounded-2xl text-center min-w-[80px]">
                      <p className="text-[9px] uppercase font-mono tracking-widest text-on-surface-variant/60">Reservas</p>
                      <p className="font-display font-extrabold text-lg text-primary">{bookings.length}</p>
                    </div>
                    <div className="bg-[#0A0B0E] border border-glass-border px-4 py-2.5 rounded-2xl text-center min-w-[80px]">
                      <p className="text-[9px] uppercase font-mono tracking-widest text-on-surface-variant/60">Kilómetros</p>
                      <p className="font-display font-extrabold text-lg text-primary">8.420</p>
                    </div>
                    <div className="bg-[#0A0B0E] border border-glass-border px-4 py-2.5 rounded-2xl text-center min-w-[80px]">
                      <p className="text-[9px] uppercase font-mono tracking-widest text-on-surface-variant/60">Calificación</p>
                      <p className="font-display font-extrabold text-lg text-primary flex items-center justify-center gap-0.5">5.0 <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" /></p>
                    </div>
                  </div>
                </div>

                {/* Dashboard layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Sidebar Menu */}
                  <div className="lg:col-span-3 glass-panel rounded-3xl p-5 border border-glass-border bg-surface-container-low h-max space-y-2">
                    <button className="w-full text-left bg-primary text-[#0F1115] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                      <span>Dashboard Principal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => showToast("Ajustes del Perfil (Demo)", "success")} className="w-full text-left hover:bg-white/5 text-on-surface-variant hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                      <span>Mi Perfil de Conductor</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </button>
                    <button onClick={() => showToast("Pagos y Facturas (Demo)", "success")} className="w-full text-left hover:bg-white/5 text-on-surface-variant hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                      <span>Pagos y Facturas</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </button>
                    <button onClick={() => showToast("Seguro de Asistencia (Demo)", "success")} className="w-full text-left hover:bg-white/5 text-on-surface-variant hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                      <span>Seguro de Asistencia</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </button>
                    <button onClick={handleSignOut} className="w-full text-left hover:bg-red-950/20 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                      <span>Cerrar Sesión</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>

                    {/* Theme Toggle Widget */}
                    <div className="pt-4 mt-4 border-t border-glass-border">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-on-surface-variant/70 mb-2 px-1">Tema / Apariencia</p>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container rounded-xl border border-glass-border">
                        <button
                          onClick={() => setTheme("light")}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "light"
                              ? "bg-white text-slate-900 shadow-md border border-slate-200"
                              : "text-on-surface-variant hover:text-white"
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          Claro
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            theme === "dark"
                              ? "bg-slate-900 text-white shadow-md border border-slate-800"
                              : "text-on-surface-variant hover:text-white"
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5 text-slate-400" />
                          Oscuro
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="lg:col-span-9 space-y-6">
                    {/* Urgent Action Banner */}
                    <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-white">Requerido: Sube tu Carnet de Conducir internacional</h4>
                        <p className="text-xs text-on-surface-variant/80 mt-1 leading-normal">
                          Para tu próxima aventura ("Noruega: Fiordos & Glaciares"), las autoridades escandinavas requieren poseer el visado o permiso internacional de circulación antes del 15 de Julio. Sube el PDF en el apartado Ajustes.
                        </p>
                      </div>
                    </div>

                    {/* Active Booking Detail */}
                    <div className="space-y-4">
                      <h3 className="font-display font-extrabold text-xl text-white">Próximo Destino Reservado</h3>
                      
                      {bookings.length === 0 ? (
                        <div className="p-10 text-center border border-dashed border-glass-border rounded-3xl bg-surface-container-low">
                          <Compass className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-2" />
                          <p className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">No tienes ninguna reserva activa</p>
                          <button
                            onClick={() => setActiveTab("catalog")}
                            className="mt-3.5 px-4 py-2 bg-primary text-[#131313] rounded-xl text-xs font-bold glow-btn transition-all cursor-pointer"
                          >
                            Ir al Catálogo de Rutas
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map((booking, idx) => {
                            const matchedTrip = trips.find((t) => t.id === booking.tripId);
                            return (
                              <div 
                                key={booking.id || `user-booking-${idx}`}
                                className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container-low flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
                              >
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/20 text-[9px] uppercase tracking-widest font-mono font-bold rounded">
                                      {booking.status}
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant/60 font-mono">ID RESERVA: {booking.id?.substring(0, 8).toUpperCase()}</span>
                                  </div>

                                  <h4 className="font-bold text-lg text-white">{booking.tripName}</h4>

                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                                    <div>
                                      <span className="text-[9px] text-on-surface-variant/50 uppercase font-mono tracking-wide block">Fecha de Reserva</span>
                                      <span className="text-xs text-white font-medium">{booking.bookingDate}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-on-surface-variant/50 uppercase font-mono tracking-wide block">Duración</span>
                                      <span className="text-xs text-white font-medium">{matchedTrip?.days || 12} días de rodada</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-on-surface-variant/50 uppercase font-mono tracking-wide block">Precio Total</span>
                                      <span className="text-xs text-primary font-bold">{(booking.priceTotal).toLocaleString("es-ES")}€</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-glass-border">
                                  <button 
                                    onClick={() => showToast("Voucher de viaje descargado (PDF)", "success")}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-surface-container-high border border-glass-border text-on-surface hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-primary" />
                                    Descargar Voucher
                                  </button>
                                  <button 
                                    onClick={() => showToast("Factura descargada (PDF)", "success")}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-surface-container-high border border-glass-border text-on-surface hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-primary" />
                                    Factura PDF
                                  </button>
                                  <button 
                                    onClick={() => handleCancelBooking(booking)}
                                    className="flex-1 md:flex-none py-2 px-4 bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-950/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                  >
                                    Cancelar Reserva
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Past Journeys Logs */}
                    <div className="space-y-4">
                      <h3 className="font-display font-extrabold text-xl text-white">Historial de Viajes / Bitácora</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Log 1 */}
                        <div className="glass-panel rounded-2xl p-4 border border-glass-border bg-surface-container flex gap-3.5 items-start">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Compass className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant/50">Mayo 2024</span>
                            <h4 className="font-bold text-sm text-white">Costa Brava Road Adventure</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                              ))}
                            </div>
                            <span className="text-[10px] text-on-surface-variant block pt-1">Ruta finalizada con éxito. ¡Increíble asfalto!</span>
                          </div>
                        </div>

                        {/* Log 2 */}
                        <div className="glass-panel rounded-2xl p-4 border border-glass-border bg-surface-container flex gap-3.5 items-start">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Compass className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-on-surface-variant/50">Marzo 2024</span>
                            <h4 className="font-bold text-sm text-white">Desierto de Almería Experience</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                              ))}
                            </div>
                            <span className="text-[10px] text-on-surface-variant block pt-1">Sensación total de libertad en paisajes áridos de película.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Policies and Assistance */}
                    <div className="p-6 rounded-3xl bg-surface-container border border-glass-border text-left space-y-4">
                      <h4 className="font-bold text-sm text-white">Política de Cancelación Flexi-Moto</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        En BikerTrip sabemos que los contratiempos surgen. Cancela gratis hasta 30 días antes del inicio del tour para recibir un cupón del 100% canjeable de por vida en cualquier otra ruta o reembolso del 85% de la tarifa cobrada.
                      </p>
                      <div className="pt-2 border-t border-glass-border/40 flex items-center justify-between">
                        <span className="text-xs text-on-surface-variant/80">¿Necesitas soporte telefónico prioritario?</span>
                        <a 
                          href="tel:+34900000000" 
                          onClick={(e) => { e.preventDefault(); showToast("Llamando a soporte BikerTrip... (+34 900 123 456)", "success"); }}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          +34 900 123 456
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* VIEW 3: ADMIN CONTROL PANEL */}
            {activeTab === "admin" && adminSubTab === "dashboard" && (
              <div className="space-y-8 text-left animate-fade-in">
                {/* Segmented Control Selector */}
                <div className="flex justify-center sm:justify-start">
                  <div className="bg-[#16191F] border border-glass-border p-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                    <button
                      onClick={() => setAdminSubTab("dashboard")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        adminSubTab === "dashboard"
                          ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10"
                          : "text-on-surface-variant hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Gestión de Administración
                    </button>
                    <button
                      onClick={() => setAdminSubTab("pilot")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        adminSubTab === "pilot"
                          ? "bg-primary text-[#0F1115] shadow-md shadow-primary/10"
                          : "text-on-surface-variant hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Mi Panel de Piloto
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Total Sales (calculated) */}
                  <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container">
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-on-surface-variant/60">Volumen Ventas Totales</span>
                    <h3 className="font-display font-extrabold text-3xl text-white mt-2">
                      {totalSalesVal.toLocaleString("es-ES")}€
                    </h3>
                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>+14.2% este mes</span>
                    </div>
                  </div>

                  {/* Registered Users */}
                  <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container">
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-on-surface-variant/60">Plazas Reservadas</span>
                    <h3 className="font-display font-extrabold text-3xl text-white mt-2">
                      {totalSeatsBooked} Plazas
                    </h3>
                    <div className="flex items-center gap-1 text-on-surface-variant/80 text-xs mt-2">
                      <span>De un total de {totalSeatsAvail} disponibles</span>
                    </div>
                  </div>

                  {/* Average Occupancy */}
                  <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container">
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-on-surface-variant/60">Ocupación Media</span>
                    <h3 className="font-display font-extrabold text-3xl text-primary mt-2">
                      {averageOccupancy}%
                    </h3>
                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2 font-semibold">
                      <span>Ruta Noruega agotada</span>
                    </div>
                  </div>

                  {/* Cancel rate */}
                  <div className="glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container">
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-on-surface-variant/60">Tasa de Cancelación</span>
                    <h3 className="font-display font-extrabold text-3xl text-white mt-2">
                      1.8%
                    </h3>
                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                      <span>-0.4% vs año anterior</span>
                    </div>
                  </div>
                </div>

                {/* Mid row: Sales columns and circular occupancy gauge */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left block: Monthly sales bar chart */}
                  <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container-low text-left space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white">Ventas Mensuales (€)</h3>
                      <p className="text-xs text-on-surface-variant/60">Histórico de reservas liquidadas en los últimos 6 meses</p>
                    </div>

                    {/* Custom SVG Bar Chart */}
                    <div className="relative pt-6 aspect-[21/9] bg-[#101010] rounded-2xl border border-glass-border flex items-end justify-around px-4 pb-12">
                      {/* Y-Axis guide lines */}
                      <div className="absolute inset-x-0 top-1/4 border-b border-white/5 pointer-events-none"></div>
                      <div className="absolute inset-x-0 top-2/4 border-b border-white/5 pointer-events-none"></div>
                      <div className="absolute inset-x-0 top-3/4 border-b border-white/5 pointer-events-none"></div>

                      {/* January */}
                      <div className="flex flex-col items-center gap-2 group relative w-12">
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-surface-container-highest px-2 py-1 rounded border border-glass-border text-[10px] font-bold text-white transition-all z-20 whitespace-nowrap shadow-lg">18,400€</div>
                        <div className="w-6 bg-surface-container-high rounded-t-lg h-24 group-hover:bg-primary-container transition-all"></div>
                        <span className="text-[10px] text-on-surface-variant/60 font-mono absolute -bottom-7">ENE</span>
                      </div>

                      {/* February */}
                      <div className="flex flex-col items-center gap-2 group relative w-12">
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-surface-container-highest px-2 py-1 rounded border border-glass-border text-[10px] font-bold text-white transition-all z-20 whitespace-nowrap shadow-lg">24,500€</div>
                        <div className="w-6 bg-surface-container-high rounded-t-lg h-32 group-hover:bg-primary-container transition-all"></div>
                        <span className="text-[10px] text-on-surface-variant/60 font-mono absolute -bottom-7">FEB</span>
                      </div>

                      {/* March */}
                      <div className="flex flex-col items-center gap-2 group relative w-12">
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-surface-container-highest px-2 py-1 rounded border border-glass-border text-[10px] font-bold text-white transition-all z-20 whitespace-nowrap shadow-lg">48,200€</div>
                        <div className="w-6 bg-primary rounded-t-lg h-44 shadow-lg shadow-primary/25 group-hover:scale-105 transition-all"></div>
                        <span className="text-[10px] text-primary font-mono font-bold absolute -bottom-7">MAR</span>
                      </div>

                      {/* April */}
                      <div className="flex flex-col items-center gap-2 group relative w-12">
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-surface-container-highest px-2 py-1 rounded border border-glass-border text-[10px] font-bold text-white transition-all z-20 whitespace-nowrap shadow-lg">31,000€</div>
                        <div className="w-6 bg-surface-container-high rounded-t-lg h-36 group-hover:bg-primary-container transition-all"></div>
                        <span className="text-[10px] text-on-surface-variant/60 font-mono absolute -bottom-7">ABR</span>
                      </div>

                      {/* May */}
                      <div className="flex flex-col items-center gap-2 group relative w-12">
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-surface-container-highest px-2 py-1 rounded border border-glass-border text-[10px] font-bold text-white transition-all z-20 whitespace-nowrap shadow-lg">39,800€</div>
                        <div className="w-6 bg-surface-container-high rounded-t-lg h-40 group-hover:bg-primary-container transition-all"></div>
                        <span className="text-[10px] text-on-surface-variant/60 font-mono absolute -bottom-7">MAY</span>
                      </div>

                      {/* June */}
                      <div className="flex flex-col items-center gap-2 group relative w-12">
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-surface-container-highest px-2 py-1 rounded border border-glass-border text-[10px] font-bold text-white transition-all z-20 whitespace-nowrap shadow-lg">45,600€</div>
                        <div className="w-6 bg-surface-container-high rounded-t-lg h-42 group-hover:bg-primary-container transition-all"></div>
                        <span className="text-[10px] text-on-surface-variant/60 font-mono absolute -bottom-7">JUN</span>
                      </div>
                    </div>
                  </div>

                  {/* Right block: Circular occupancy gauge */}
                  <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-glass-border bg-surface-container-low text-left flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white">Estado de Ocupación</h3>
                      <p className="text-xs text-on-surface-variant/60">Análisis porcentual acumulado de todas las plazas activas</p>
                    </div>

                    <div className="relative py-6 flex items-center justify-center">
                      {/* SVG Gauge */}
                      <svg className="w-36 h-36 transform -rotate-90">
                        {/* Background line */}
                        <circle 
                          cx="72" cy="72" r="58" 
                          stroke="rgba(255, 182, 148, 0.05)" 
                          strokeWidth="8" 
                          fill="transparent" 
                        />
                        {/* Active arc */}
                        <circle 
                          cx="72" cy="72" r="58" 
                          stroke="#ffb694" 
                          strokeWidth="10" 
                          fill="transparent" 
                          strokeDasharray={364.4}
                          strokeDashoffset={364.4 - (364.4 * averageOccupancy) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      {/* Center stats */}
                      <div className="absolute flex flex-col items-center">
                        <span className="font-display font-black text-3xl text-white">{totalSeatsBooked}</span>
                        <span className="text-[9px] font-mono tracking-widest text-on-surface-variant/60 uppercase">PLAZAS RESERVADAS</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-glass-border/40">
                      <div>
                        <span className="text-[9px] text-on-surface-variant/60 uppercase block">Próximo Mes</span>
                        <span className="text-xs text-white font-bold">+18 reservas</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant/60 uppercase block">Cerradas</span>
                        <span className="text-xs text-white font-bold">12 salidas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimization Advice banner */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3.5">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Recomendación Copiloto IA: Optimización de Ventas</h4>
                    <p className="text-xs text-on-surface-variant/80 mt-1 leading-normal">
                      La ruta **Picos de Europa** cuenta con tan solo un 20% de plazas reservadas para la salida de Septiembre. Sugerimos realizar una campaña segmentada vía el boletín del motero o aplicar un descuento automático "Último Minuto" del 10% para acelerar reservas.
                    </p>
                  </div>
                </div>

                {/* CRUD table of active trips */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-white">Inventario de Rutas & Programación</h3>
                      <p className="text-sm text-on-surface-variant">Agrega, edita, duplica o elimina los viajes en tiempo real sincronizado con Firebase</p>
                    </div>

                    <button
                      onClick={() => { setEditingTrip(null); setIsModalOpen(true); }}
                      className="px-5 py-3 bg-primary text-[#131313] rounded-2xl text-xs font-bold glow-btn transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Añadir Nuevo Viaje
                    </button>
                  </div>

                  <div className="overflow-x-auto glass-panel rounded-3xl border border-glass-border">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#171717]/80 border-b border-glass-border text-on-surface-variant font-mono text-[10px] uppercase tracking-wider">
                          <th className="py-4 px-6">Detalles de la Ruta</th>
                          <th className="py-4 px-6">Dificultad</th>
                          <th className="py-4 px-6">Precio</th>
                          <th className="py-4 px-6">Ocupación</th>
                          <th className="py-4 px-6 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-glass-border/30 bg-[#131313]/50">
                        {trips.map((trip, idx) => {
                          const occupancyPercent = Math.round((trip.bookedSeats / trip.totalSeats) * 100);
                          return (
                            <tr key={trip.id || `admin-trip-${idx}-${trip.name}`} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={trip.image} 
                                    alt={trip.name} 
                                    className="w-12 h-12 rounded-xl object-cover border border-glass-border shrink-0 referrerPolicy='no-referrer'" 
                                  />
                                  <div>
                                    <h4 className="font-bold text-sm text-white">{trip.name}</h4>
                                    <p className="text-[10px] text-on-surface-variant/80 mt-0.5">{trip.location} • {trip.days} días</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase tracking-wide font-bold ${
                                  trip.difficulty === "Duro" || trip.difficulty === "Avanzado"
                                    ? "bg-red-950/80 text-red-300"
                                    : "bg-amber-950/80 text-amber-300"
                                }`}>
                                  {trip.difficulty}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-display font-semibold text-white">
                                {trip.price.toLocaleString("es-ES")}€
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3 min-w-[120px]">
                                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden border border-white/5">
                                    <div 
                                      style={{ width: `${occupancyPercent}%` }} 
                                      className="h-full bg-primary rounded-full"
                                    ></div>
                                  </div>
                                  <span className="text-xs font-mono font-medium text-white shrink-0">
                                    {trip.bookedSeats}/{trip.totalSeats}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {trip.name === "Alpujarra" ? (
                                    <>
                                      <button
                                        disabled
                                        title="La ruta oficial 'Alpujarra' no se puede editar"
                                        className="p-2 opacity-30 cursor-not-allowed rounded-lg text-on-surface-variant"
                                      >
                                        <Settings className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDuplicateTrip(trip)}
                                        title="Duplicar ruta"
                                        className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                      <button
                                        disabled
                                        title="La ruta oficial 'Alpujarra' no se puede eliminar"
                                        className="p-2 opacity-30 cursor-not-allowed rounded-lg text-on-surface-variant"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => { setEditingTrip(trip); setIsModalOpen(true); }}
                                        title="Editar ruta"
                                        className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                                      >
                                        <Settings className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDuplicateTrip(trip)}
                                        title="Duplicar ruta"
                                        className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTrip(trip.id || "")}
                                        title="Eliminar ruta"
                                        className="p-2 hover:bg-red-950/20 rounded-lg text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsView
                trips={trips}
                reviews={reviews}
                currentUser={currentUser}
                onAddReview={handleCreateReview}
                onDeleteReview={handleDeleteReview}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating AI Assistant */}
      <Chatbot />

      {/* Adding / Editing Modal */}
      <TripModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTrip(null); }}
        onSave={handleSaveTrip}
        tripToEdit={editingTrip}
      />

      {/* Email/Password Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all duration-300">
          <div className="relative w-full max-w-md bg-[#16191F] border border-glass-border rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthEmail("");
                setAuthPassword("");
                setAuthName("");
                setAuthError("");
              }}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Tabs */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-1 bg-surface-container rounded-xl border border-glass-border">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    authMode === "login" 
                      ? "bg-primary text-[#0F1115]" 
                      : "text-on-surface-variant hover:text-white"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError("");
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    authMode === "register" 
                      ? "bg-primary text-[#0F1115]" 
                      : "text-on-surface-variant hover:text-white"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white mt-4">
                {authMode === "login" ? "¡Hola de nuevo, Piloto!" : "Únete a BikerTrip"}
              </h3>
              <p className="text-xs text-on-surface-variant/80 max-w-sm mx-auto">
                {authMode === "login" 
                  ? "Inicia sesión con tu correo electrónico para gestionar tus reservas de aventuras." 
                  : "Regístrate para reservar rutas épicas en moto y ver tus expediciones programadas."}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="flex items-start gap-2.5 bg-red-950/25 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold font-mono text-on-surface-variant/90 uppercase tracking-wider block">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                    <input 
                      type="text"
                      required
                      placeholder="Juan Pérez"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-900 border border-glass-border focus:border-primary focus:ring-1 focus:ring-primary text-sm text-white px-10 py-3 rounded-2xl outline-none transition-all placeholder:text-on-surface-variant/45"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold font-mono text-on-surface-variant/90 uppercase tracking-wider block">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="email"
                    required
                    placeholder="piloto@bikertrip.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-glass-border focus:border-primary focus:ring-1 focus:ring-primary text-sm text-white px-10 py-3 rounded-2xl outline-none transition-all placeholder:text-on-surface-variant/45"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold font-mono text-on-surface-variant/90 uppercase tracking-wider block">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                  <input 
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-glass-border focus:border-primary focus:ring-1 focus:ring-primary text-sm text-white px-10 py-3 rounded-2xl outline-none transition-all placeholder:text-on-surface-variant/45"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authActionLoading}
                className="w-full py-3 bg-primary text-[#0F1115] hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 text-xs font-bold rounded-2xl uppercase tracking-wider glow-btn transition-all duration-250 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {authActionLoading ? (
                  <div className="w-4 h-4 border-2 border-[#0F1115] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                  </>
                )}
              </button>
            </form>

            {/* Quick SSO Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-glass-border"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-on-surface-variant/60 uppercase">O bien continuar con</span>
              <div className="flex-grow border-t border-glass-border"></div>
            </div>

            {/* Provider Auth */}
            <button
              onClick={() => {
                handleGoogleSignIn();
                setIsAuthModalOpen(false);
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-glass-border text-white text-xs font-bold rounded-2xl uppercase tracking-wider hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Cuenta de Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
