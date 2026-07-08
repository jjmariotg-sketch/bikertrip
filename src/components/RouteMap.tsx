import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Trip } from "../lib/firebase";
import { Navigation, Compass } from "lucide-react";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY.trim().length > 0;

interface RouteMapProps {
  trips: Trip[];
  selectedTrip: Trip | null;
  onSelectTrip: (trip: Trip | null) => void;
}

export default function RouteMap({ trips, selectedTrip, onSelectTrip }: RouteMapProps) {
  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-[#0A0B0E] border border-glass-border rounded-2xl aspect-[16/9] min-h-[350px] text-center text-on-surface">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto border border-primary/30">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Google Maps API Key Requerido</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Para visualizar las rutas y coordenadas reales de BikerTrip, necesitas configurar tu API Key de Google Maps en AI Studio.
          </p>
          <div className="text-left bg-surface-container p-4 rounded-xl border border-glass-border space-y-2 text-[11px] leading-normal">
            <p className="font-bold text-white">Cómo configurar el API Key:</p>
            <ol className="list-decimal pl-4 space-y-1 text-on-surface-variant">
              <li>Consigue un API Key en la Consola de Google Cloud.</li>
              <li>Abre <strong>Settings</strong> (⚙️ icono de engranaje arriba a la derecha).</li>
              <li>Selecciona la pestaña <strong>Secrets</strong>.</li>
              <li>Crea un secret llamado <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> y pega tu clave.</li>
            </ol>
          </div>
          <p className="text-[10px] text-primary/80">La aplicación se compilará automáticamente una vez guardado el secreto.</p>
        </div>
      </div>
    );
  }

  // Granada coordinates as a solid default center
  const defaultCenter = { lat: 37.1773, lng: -3.5986 };
  
  return (
    <div className="relative bg-[#0A0B0E] rounded-2xl aspect-[16/9] min-h-[350px] border border-glass-border overflow-hidden w-full h-full">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={8}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: "100%", height: "100%" }}
          gestureHandling="cooperative"
          disableDefaultUI={false}
        >
          {selectedTrip && selectedTrip.startLatLng && selectedTrip.endLatLng && (
            <RouteDisplay 
              origin={selectedTrip.startLatLng} 
              destination={selectedTrip.endLatLng} 
            />
          )}

          <MapMarkers 
            trips={trips} 
            selectedTrip={selectedTrip} 
            onSelectTrip={onSelectTrip} 
          />
        </Map>
      </APIProvider>

      {/* Floating Info Card */}
      <div className="absolute top-3 left-3 z-10 max-w-xs bg-[#0F1115]/95 border border-glass-border p-3.5 rounded-xl shadow-xl backdrop-blur-md">
        {selectedTrip ? (
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5 text-primary" />
              <span>Ruta: {selectedTrip.name}</span>
            </div>
            <p className="text-[11px] text-white font-medium line-clamp-3">{selectedTrip.description}</p>
            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-glass-border text-[10px]">
              <div>
                <span className="text-on-surface-variant font-semibold block uppercase text-[8px] tracking-wide">Inicio:</span>
                <span className="text-white font-mono">{selectedTrip.startLocationName || "Punto de Inicio"}</span>
              </div>
              <div>
                <span className="text-on-surface-variant font-semibold block uppercase text-[8px] tracking-wide">Destino:</span>
                <span className="text-white font-mono">{selectedTrip.endLocationName || "Punto Final"}</span>
              </div>
            </div>
            <button
              onClick={() => onSelectTrip(null)}
              className="w-full mt-1.5 py-1 px-2.5 bg-white/5 border border-glass-border hover:bg-white/10 rounded-lg text-[9px] text-on-surface-variant hover:text-white transition-all font-semibold"
            >
              Mostrar todos los destinos
            </button>
          </div>
        ) : (
          <div className="text-left space-y-1">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary" />
              Explorador de Rutas
            </h4>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Haz clic en los marcadores de moto o presiona "Ver Ruta en Mapa" en las tarjetas para visualizar el itinerario real con polilíneas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;
    
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: "DRIVING",
      fields: ["path", "viewport"],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({
            strokeColor: "#ff7a00", // Bright neon orange accent for biker route
            strokeOpacity: 0.9,
            strokeWeight: 6,
          });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) {
          map.fitBounds(routes[0].viewport);
        }
      }
    }).catch(err => {
      console.error("Error computing route: ", err);
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

interface MapMarkersProps {
  trips: Trip[];
  selectedTrip: Trip | null;
  onSelectTrip: (trip: Trip | null) => void;
}

function MapMarkers({ trips, selectedTrip, onSelectTrip }: MapMarkersProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || trips.length === 0) return;
    
    // Fit bounds only if no specific trip is selected
    if (!selectedTrip) {
      const bounds = new google.maps.LatLngBounds();
      let hasCoords = false;
      
      trips.forEach(t => {
        if (t.startLatLng) {
          bounds.extend(t.startLatLng);
          hasCoords = true;
        }
        if (t.endLatLng) {
          bounds.extend(t.endLatLng);
          hasCoords = true;
        }
      });
      
      if (hasCoords) {
        map.fitBounds(bounds);
        // Prevent too deep of a zoom on a single point
        const listener = google.maps.event.addListener(map, "bounds_changed", () => {
          if (map.getZoom()! > 12) map.setZoom(10);
          google.maps.event.removeListener(listener);
        });
      }
    }
  }, [map, trips, selectedTrip]);

  // If a specific trip is selected, only show its start and end markers
  if (selectedTrip) {
    return (
      <>
        {selectedTrip.startLatLng && (
          <AdvancedMarker 
            position={selectedTrip.startLatLng} 
            title={`Inicio: ${selectedTrip.startLocationName || selectedTrip.name}`}
          >
            <Pin background="#ff7a00" glyphColor="#000" glyphText="A" />
          </AdvancedMarker>
        )}
        {selectedTrip.endLatLng && (
          <AdvancedMarker 
            position={selectedTrip.endLatLng} 
            title={`Fin: ${selectedTrip.endLocationName || "Destino"}`}
          >
            <Pin background="#10B981" glyphColor="#fff" glyphText="B" />
          </AdvancedMarker>
        )}
      </>
    );
  }

  // Show starting points of all trips
  return (
    <>
      {trips.map((trip, idx) => {
        if (!trip.startLatLng) return null;
        const key = trip.id || `trip-marker-${idx}`;
        
        return (
          <AdvancedMarker
            key={key}
            position={trip.startLatLng}
            title={trip.name}
            onClick={() => {
              onSelectTrip(trip);
            }}
          >
            <Pin background="#ff7a00" glyphColor="#000" glyphText="🏍️" />
          </AdvancedMarker>
        );
      })}
    </>
  );
}
