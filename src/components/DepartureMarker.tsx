import { useMemo } from 'react';
import { Marker } from '@vis.gl/react-google-maps';
import { LatLng } from '../types/kml';

interface DepartureMarkerProps {
  position: LatLng;
  label?: string;
  isDraggable?: boolean;
  onDragEnd?: (pos: LatLng) => void;
}

export function DepartureMarker({
  position,
  label = 'Ponto de Partida',
  isDraggable = true,
  onDragEnd,
}: DepartureMarkerProps) {
  const icon = useMemo(() => {
    const width = 38;
    const height = Math.round(width * 1.3);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 34 44">
      <defs>
        <filter id="dsh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <path d="M17 1 C8.163 1 1 8.163 1 17 C1 27.5 17 43 17 43 C17 43 33 27.5 33 17 C33 8.163 25.837 1 17 1 Z" 
            fill="#059669" stroke="#ffffff" stroke-width="2.5" filter="url(#dsh)"/>
      <circle cx="17" cy="16" r="7" fill="#ffffff"/>
      <circle cx="17" cy="16" r="4" fill="#059669"/>
    </svg>`;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize:
        typeof google !== 'undefined' && google.maps?.Size
          ? new google.maps.Size(width, height)
          : undefined,
      anchor:
        typeof google !== 'undefined' && google.maps?.Point
          ? new google.maps.Point(width / 2, height)
          : undefined,
    };
  }, []);

  return (
    <Marker
      position={{ lat: position.lat, lng: position.lng }}
      title={label}
      draggable={isDraggable}
      icon={icon}
      onDragEnd={(e) => {
        if (e.latLng && onDragEnd) {
          onDragEnd({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
      }}
      zIndex={60}
    />
  );
}
