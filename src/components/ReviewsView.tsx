import React, { useState } from "react";
import { Star, MessageSquare, Plus, Trash2, Calendar, User, Shield, Compass, Award } from "lucide-react";
import { Trip, Review } from "../lib/firebase";

interface ReviewsViewProps {
  trips: Trip[];
  reviews: Review[];
  currentUser: any;
  onAddReview: (review: any) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
  onOpenAuth: () => void;
}

export default function ReviewsView({
  trips,
  reviews,
  currentUser,
  onAddReview,
  onDeleteReview,
  onOpenAuth
}: ReviewsViewProps) {
  const [selectedTripId, setSelectedTripId] = useState("");
  const [ratingRoute, setRatingRoute] = useState(5);
  const [ratingGuide, setRatingGuide] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Ratings Hover states
  const [hoverRoute, setHoverRoute] = useState<number | null>(null);
  const [hoverGuide, setHoverGuide] = useState<number | null>(null);

  // Filter reviews by selected route (optional filter)
  const [filterTripId, setFilterTripId] = useState("all");

  // Aggregate stats
  const filteredReviews = filterTripId === "all" 
    ? reviews 
    : reviews.filter((r) => r.tripId === filterTripId);

  const avgRouteRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.ratingRoute, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const avgGuideRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.ratingGuide, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!currentUser) {
      setFormError("Debes iniciar sesión para escribir una opinión.");
      return;
    }

    if (!selectedTripId) {
      setFormError("Por favor, selecciona una ruta.");
      return;
    }

    if (!comment.trim()) {
      setFormError("Por favor, escribe un comentario de opinión.");
      return;
    }

    const trip = trips.find((t) => t.id === selectedTripId);
    if (!trip) {
      setFormError("La ruta seleccionada no es válida.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddReview({
        tripId: selectedTripId,
        tripName: trip.name,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email || "Piloto Anónimo",
        userPhotoURL: currentUser.photoURL || "",
        ratingRoute,
        ratingGuide,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      });

      // Clear Form
      setSelectedTripId("");
      setRatingRoute(5);
      setRatingGuide(5);
      setComment("");
      setShowForm(false);
    } catch (err: any) {
      setFormError("Error al enviar la reseña. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10" id="reviews-section">
      {/* 1. HEADER HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1F29] to-[#12151C] border border-glass-border rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            Opiniones de Pilotos
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Experiencias BikerTrip
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed">
            Descubre las valoraciones de nuestros clientes reales. Califican la belleza técnica de la ruta, el estado del asfalto, y la atención y profesionalidad de nuestros guías de apoyo.
          </p>
        </div>
      </div>

      {/* 2. STATS OVERVIEW BENTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Route average rating */}
        <div className="bg-[#16191F] border border-glass-border rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Puntuación de la Ruta</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{avgRouteRating}</span>
              <span className="text-sm text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`route-avg-${star}`}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgRouteRating))
                      ? "text-primary fill-primary"
                      : "text-slate-700"
                  }`}
                />
              ))}
              <span className="text-xs text-on-surface-variant ml-2">({reviews.length} reseñas)</span>
            </div>
          </div>
        </div>

        {/* Guide average rating */}
        <div className="bg-[#16191F] border border-glass-border rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Puntuación del Guía</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{avgGuideRating}</span>
              <span className="text-sm text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`guide-avg-${star}`}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgGuideRating))
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-700"
                  }`}
                />
              ))}
              <span className="text-xs text-on-surface-variant ml-2">({reviews.length} reseñas)</span>
            </div>
          </div>
        </div>

        {/* CTA to write review */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2 text-left">
            <h3 className="font-bold text-white text-lg">¿Has rodado con nosotros?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tu opinión ayuda a la comunidad biker a prepararse para la aventura y a nosotros a mejorar el servicio.
            </p>
          </div>
          <div>
            {currentUser ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full py-3 px-4 bg-primary text-[#0F1115] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {showForm ? "Cerrar Formulario" : "Escribir mi Reseña"}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all font-bold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-primary" />
                Identifícate para opinar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. REVIEW CREATION FORM (EXPANDABLE) */}
      {showForm && currentUser && (
        <div className="bg-[#16191F] border border-glass-border rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in text-left">
          <div className="border-b border-glass-border pb-4">
            <h3 className="font-bold text-xl text-white">Escribe tu opinión</h3>
            <p className="text-xs text-on-surface-variant">Completa los datos de tu experiencia en la última aventura.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="bg-red-950/40 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route selection dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Selecciona la Ruta Realizada
                </label>
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full bg-[#1A1F29] border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-white text-sm transition-all"
                  required
                >
                  <option value="">-- Elige una ruta --</option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name} ({trip.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* User Identity Display */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Publicarás como
                </label>
                <div className="flex items-center gap-3 bg-[#1A1F29] border border-glass-border p-3 rounded-xl">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-primary/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary text-xs font-bold">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white">
                      {currentUser.displayName || currentUser.email || "Piloto de BikerTrip"}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400">Verificado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Stars Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Route Rating */}
              <div className="bg-[#1A1F29] border border-glass-border p-4 rounded-xl space-y-3">
                <div>
                  <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                    Valoración de la Ruta
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    ¿Qué tal el asfalto, paisajes y trazado de curvas?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={`rate-route-star-${star}`}
                      onClick={() => setRatingRoute(star)}
                      onMouseEnter={() => setHoverRoute(star)}
                      onMouseLeave={() => setHoverRoute(null)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRoute !== null ? hoverRoute : ratingRoute)
                            ? "text-primary fill-primary"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-primary ml-2">
                    {ratingRoute} {ratingRoute === 5 ? "¡Excelente!" : ratingRoute >= 4 ? "Muy Buena" : ratingRoute >= 3 ? "Aceptable" : ratingRoute >= 2 ? "Regular" : "Mala"}
                  </span>
                </div>
              </div>

              {/* Guide Rating */}
              <div className="bg-[#1A1F29] border border-glass-border p-4 rounded-xl space-y-3">
                <div>
                  <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                    Valoración del Guía
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    ¿Te sentiste seguro? ¿Explicó bien el briefing técnico?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={`rate-guide-star-${star}`}
                      onClick={() => setRatingGuide(star)}
                      onMouseEnter={() => setHoverGuide(star)}
                      onMouseLeave={() => setHoverGuide(null)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverGuide !== null ? hoverGuide : ratingGuide)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                    {ratingGuide} {ratingGuide === 5 ? "¡Insuperable!" : ratingGuide >= 4 ? "Excelente" : ratingGuide >= 3 ? "Bueno" : ratingGuide >= 2 ? "Mejorable" : "Insatisfactorio"}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Escribe tu opinión / Comentario
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos los detalles: la parada para almorzar, la seguridad en el grupo, los consejos del guía, etc..."
                className="w-full min-h-[120px] bg-[#1A1F29] border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-white text-sm transition-all resize-y"
                required
              />
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-primary text-[#0F1115] hover:scale-105 active:scale-95 transition-all font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Publicar Reseña"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. REVIEWS FILTER AND LIST */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-glass-border pb-4">
          <div className="text-left">
            <h3 className="font-bold text-xl text-white">Todas las Reseñas ({filteredReviews.length})</h3>
            <p className="text-xs text-on-surface-variant">Lee las experiencias de los pilotos que han rodado.</p>
          </div>

          {/* Filtering Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Filtrar por ruta:</span>
            <select
              value={filterTripId}
              onChange={(e) => setFilterTripId(e.target.value)}
              className="bg-[#16191F] border border-glass-border rounded-xl px-3 py-2 outline-none text-white text-xs"
            >
              <option value="all">Ver todas las rutas</option>
              {trips.map((trip) => (
                <option key={`filter-${trip.id}`} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-glass-border rounded-2xl bg-[#16191F] space-y-4">
            <MessageSquare className="w-12 h-12 text-primary mx-auto animate-pulse" />
            <h4 className="text-white font-bold text-lg">Aún no hay opiniones</h4>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">
              No se han publicado valoraciones para la ruta seleccionada. ¡Sé el primero en compartir tu experiencia de conducción!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => {
              const formattedDate = new Date(review.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });

              const isOwner = currentUser && (currentUser.uid === review.userId);
              const isAdmin = currentUser && (
                currentUser.email === "jjmariotg@gmail.com" ||
                currentUser.email === "admin@bikertrip.com" ||
                currentUser.uid === "demo-jjmario-123" ||
                currentUser.uid === "demo-admin-uid"
              );

              return (
                <div
                  key={review.id}
                  className="bg-[#16191F] border border-glass-border rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all text-left"
                >
                  <div className="space-y-4">
                    {/* User Profile and Details */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        {review.userPhotoURL ? (
                          <img
                            src={review.userPhotoURL}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full border border-primary/20 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary text-sm font-bold border border-glass-border">
                            {review.userName[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{review.userName}</h4>
                          <span className="text-[10px] text-on-surface-variant flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      {/* Delete Option for Owner/Admin */}
                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => onDeleteReview(review.id || "")}
                          className="p-1.5 hover:bg-red-950/20 text-on-surface-variant hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Reseña"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Route context */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-primary font-bold">
                      <Compass className="w-3.5 h-3.5" />
                      {review.tripName}
                    </div>

                    {/* Double Star Rating Grid */}
                    <div className="grid grid-cols-2 gap-3 bg-[#1A1F29]/50 border border-glass-border/30 p-3 rounded-xl">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">
                          Valoración Ruta
                        </span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={`star-route-${review.id}-${star}`}
                              className={`w-3.5 h-3.5 ${
                                star <= review.ratingRoute
                                  ? "text-primary fill-primary"
                                  : "text-slate-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">
                          Valoración Guía
                        </span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={`star-guide-${review.id}-${star}`}
                              className={`w-3.5 h-3.5 ${
                                star <= review.ratingGuide
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-sm text-on-surface-variant leading-relaxed italic break-words">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
