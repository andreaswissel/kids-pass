"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CATEGORY_LABELS } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  locationAddress: string;
  partner: { name: string };
  sessions: { startDateTime: string }[];
}

interface ActivityMapProps {
  activities: Activity[];
  onActivitySelect?: (activityId: string) => void;
  className?: string;
}

// Category colors for markers
const CATEGORY_COLORS: Record<string, string> = {
  SPORTS: "#EF8354",
  MUSIC: "#7B68EE",
  ARTS: "#F472B6",
  OUTDOOR: "#10B981",
  CREATIVE: "#F59E0B",
  DANCE: "#EC4899",
  SWIMMING: "#06B6D4",
  MARTIAL_ARTS: "#EF4444",
};

export function ActivityMap({ activities, onActivitySelect, className }: ActivityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter activities with valid coordinates
  const activitiesWithCoords = activities.filter(
    (a) => a.latitude != null && a.longitude != null
  );

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    
    // Calculate center from activities or default to Hamburg
    let center: [number, number] = [9.9937, 53.5511]; // Hamburg default
    
    if (activitiesWithCoords.length > 0) {
      const avgLat = activitiesWithCoords.reduce((sum, a) => sum + (a.latitude || 0), 0) / activitiesWithCoords.length;
      const avgLng = activitiesWithCoords.reduce((sum, a) => sum + (a.longitude || 0), 0) / activitiesWithCoords.length;
      center = [avgLng, avgLat];
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when activities change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each activity
    activitiesWithCoords.forEach((activity) => {
      if (!activity.latitude || !activity.longitude) return;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "activity-marker";
      el.style.cssText = `
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${CATEGORY_COLORS[activity.category] || "#5DBDBA"};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: transform 0.2s;
      `;
      
      // Add emoji based on category
      const categoryEmojis: Record<string, string> = {
        SPORTS: "⚽",
        MUSIC: "🎵",
        ARTS: "🎨",
        OUTDOOR: "🏔️",
        CREATIVE: "✨",
        DANCE: "💃",
        SWIMMING: "🏊",
        MARTIAL_ARTS: "🥋",
      };
      el.innerHTML = categoryEmojis[activity.category] || "📍";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px; color: #2D3B3B;">${activity.title}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${activity.partner.name}</p>
          <span style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            background: ${CATEGORY_COLORS[activity.category] || "#5DBDBA"}20;
            color: ${CATEGORY_COLORS[activity.category] || "#5DBDBA"};
            font-size: 11px;
            font-weight: 600;
          ">${CATEGORY_LABELS[activity.category] || activity.category}</span>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([activity.longitude, activity.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Click handler
      el.addEventListener("click", () => {
        onActivitySelect?.(activity.id);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have activities
    if (activitiesWithCoords.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      activitiesWithCoords.forEach((a) => {
        if (a.latitude && a.longitude) {
          bounds.extend([a.longitude, a.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [activities, mapLoaded, onActivitySelect, activitiesWithCoords]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className={`bg-bg-cream rounded-[var(--radius-xl)] p-8 text-center ${className}`}>
        <p className="text-5xl mb-4">🗺️</p>
        <h3 className="text-lg font-bold text-kidspass-text mb-2">Map coming soon!</h3>
        <p className="text-kidspass-text-muted text-sm">
          Configure NEXT_PUBLIC_MAPBOX_TOKEN to enable the map view.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-[var(--radius-xl)] overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-[var(--radius-lg)] p-3 shadow-lg">
        <p className="text-xs font-semibold text-kidspass-text mb-2">Categories</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(CATEGORY_COLORS).slice(0, 6).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ background: color }}
              />
              <span className="text-xs text-kidspass-text-muted">
                {CATEGORY_LABELS[cat] || cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

