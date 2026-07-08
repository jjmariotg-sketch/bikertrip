import React, { useState, useEffect } from "react";
import { X, Save, Edit, Compass, DollarSign, Calendar } from "lucide-react";
import { Trip } from "../lib/firebase";

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  tripToEdit?: Trip | null;
}

export default function TripModal({ isOpen, onClose, onSave, tripToEdit }: TripModalProps) {
  const [name, setName] = useState("");
  const [days, setDays] = useState(7);
  const [difficulty, setDifficulty] = useState<Trip["difficulty"]>("Intermedio");
  const [price, setPrice] = useState(1200);
  const [bookedSeats, setBookedSeats] = useState(0);
  const [totalSeats, setTotalSeats] = useState(12);
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [startLocationName, setStartLocationName] = useState("");
  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [endLocationName, setEndLocationName] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLng, setEndLng] = useState("");

  useEffect(() => {
    if (tripToEdit) {
      setName(tripToEdit.name || "");
      setDays(tripToEdit.days || 7);
      setDifficulty(tripToEdit.difficulty || "Intermedio");
      setPrice(tripToEdit.price || 1200);
      setBookedSeats(tripToEdit.bookedSeats || 0);
      setTotalSeats(tripToEdit.totalSeats || 12);
      setImage(tripToEdit.image || "");
      setLocation(tripToEdit.location || "");
      setDescription(tripToEdit.description || "");
      setDuration(tripToEdit.duration || "");
      setDistance(tripToEdit.distance || "");
      setStartLocationName(tripToEdit.startLocationName || "");
      setStartLat(tripToEdit.startLatLng?.lat !== undefined ? String(tripToEdit.startLatLng.lat) : "");
      setStartLng(tripToEdit.startLatLng?.lng !== undefined ? String(tripToEdit.startLatLng.lng) : "");
      setEndLocationName(tripToEdit.endLocationName || "");
      setEndLat(tripToEdit.endLatLng?.lat !== undefined ? String(tripToEdit.endLatLng.lat) : "");
      setEndLng(tripToEdit.endLatLng?.lng !== undefined ? String(tripToEdit.endLatLng.lng) : "");
    } else {
      setName("");
      setDays(1);
      setDifficulty("Media");
      setPrice(120);
      setBookedSeats(0);
      setTotalSeats(6);
      setImage("");
      setLocation("");
      setDescription("");
      setDuration("");
      setDistance("");
      setStartLocationName("");
      setStartLat("");
      setStartLng("");
      setEndLocationName("");
      setEndLat("");
      setEndLng("");
    }
  }, [tripToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sLat = parseFloat(startLat);
    const sLng = parseFloat(startLng);
    const eLat = parseFloat(endLat);
    const eLng = parseFloat(endLng);

    const tripData: Trip = {
      name,
      days: Number(days),
      difficulty,
      price: Number(price),
      bookedSeats: Number(bookedSeats),
      totalSeats: Number(totalSeats),
      image: image.trim() || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
      location: location.trim() || "España",
      description: description.trim() || "Ruta de aventura en moto espectacular por las mejores curvas.",
      duration: duration.trim(),
      distance: distance.trim(),
      bookedByUserIds: tripToEdit?.bookedByUserIds || [],
      startLocationName: startLocationName.trim() || undefined,
      startLatLng: (!isNaN(sLat) && !isNaN(sLng)) ? { lat: sLat, lng: sLng } : undefined,
      endLocationName: endLocationName.trim() || undefined,
      endLatLng: (!isNaN(eLat) && !isNaN(eLng)) ? { lat: eLat, lng: eLng } : undefined
    };

    if (tripToEdit?.id) {
      tripData.id = tripToEdit.id;
    }

    onSave(tripData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-surface-container rounded-3xl overflow-hidden border border-glass-border shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-surface-container-high border-b border-glass-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">
                {tripToEdit ? "Editar Ruta Activa" : "Crear Nueva Ruta de Aventura"}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Formulario de Configuración de Viaje
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-full text-on-surface-variant hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Nombre de la Ruta / Viaje
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Alpes Suizos: El Desafío del Stelvio"
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Country / Location */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Ubicación / País
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Noruega"
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Precio (€)
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Ej. 2100"
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Dificultad
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Trip["difficulty"])}
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              >
                <option value="Iniciación">Iniciación</option>
                <option value="Fácil">Fácil</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Media">Media</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Duro">Duro</option>
              </select>
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Duración (Días)
              </label>
              <input
                type="number"
                required
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Booked Seats */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Plazas Reservadas
              </label>
              <input
                type="number"
                required
                min="0"
                max={totalSeats}
                value={bookedSeats}
                onChange={(e) => setBookedSeats(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Total Seats */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Plazas Totales
              </label>
              <input
                type="number"
                required
                min="1"
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Distancia (ej: 150km)
              </label>
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Ej. 150km"
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Duration (e.g. 8h) */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Duración en Horas (ej: 8h)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej. 8h"
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Image URL */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo..."
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all"
              />
            </div>

            {/* Google Maps Route Coordinates */}
            <div className="col-span-1 md:col-span-2 border border-glass-border/40 p-4 rounded-2xl bg-white/2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Configuración de Google Maps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Point */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Punto de Inicio (Nombre)
                  </label>
                  <input
                    type="text"
                    value={startLocationName}
                    onChange={(e) => setStartLocationName(e.target.value)}
                    placeholder="Ej: Granada, España"
                    className="w-full bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 outline-none focus:border-primary text-on-surface text-xs transition-all"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={startLat}
                      onChange={(e) => setStartLat(e.target.value)}
                      placeholder="Lat: 37.1773"
                      className="w-full bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 outline-none focus:border-primary text-on-surface text-xs transition-all"
                    />
                    <input
                      type="number"
                      step="any"
                      value={startLng}
                      onChange={(e) => setStartLng(e.target.value)}
                      placeholder="Lng: -3.5986"
                      className="w-full bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 outline-none focus:border-primary text-on-surface text-xs transition-all"
                    />
                  </div>
                </div>

                {/* End Point */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Punto de Destino (Nombre)
                  </label>
                  <input
                    type="text"
                    value={endLocationName}
                    onChange={(e) => setEndLocationName(e.target.value)}
                    placeholder="Ej: Trevélez, España"
                    className="w-full bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 outline-none focus:border-primary text-on-surface text-xs transition-all"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={endLat}
                      onChange={(e) => setEndLat(e.target.value)}
                      placeholder="Lat: 36.9011"
                      className="w-full bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 outline-none focus:border-primary text-on-surface text-xs transition-all"
                    />
                    <input
                      type="number"
                      step="any"
                      value={endLng}
                      onChange={(e) => setEndLng(e.target.value)}
                      placeholder="Lng: -3.2661"
                      className="w-full bg-surface-container-low border border-glass-border rounded-xl px-3 py-2 outline-none focus:border-primary text-on-surface text-xs transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Descripción de la Ruta
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escribe los detalles de la ruta, asfalto, paradas y puntos de interés..."
                rows={3}
                className="w-full bg-surface-container-low border border-glass-border rounded-xl px-4 py-3 outline-none focus:border-primary text-on-surface text-sm transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-glass-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-glass-border text-on-surface-variant hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              Guardar Viaje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
