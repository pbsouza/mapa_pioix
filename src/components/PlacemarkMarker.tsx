import React, { useMemo } from 'react';
import { Marker } from '@vis.gl/react-google-maps';
import { PlacemarkFeature } from '../types/kml';

interface PlacemarkMarkerProps {
  placemark: PlacemarkFeature;
  isSelected: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  onClick: () => void;
}

export const PlacemarkMarker = React.memo(function PlacemarkMarker({
  placemark,
  isSelected,
  isOrigin,
  isDestination,
  onClick,
}: PlacemarkMarkerProps) {
  if (!placemark.point) return null;

  const icon = useMemo(() => {
    const color = isOrigin
      ? '#059669' // emerald-600
      : isDestination
      ? '#e11d48' // rose-600
      : isSelected
      ? '#2563eb' // blue-600
      : placemark.categoryColor || '#3b82f6';

    const width = isSelected ? 36 : isOrigin || isDestination ? 34 : 28;
    const height = Math.round(width * 1.28);
    const strokeWidth = isSelected ? 2.5 : 2;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 32 41">
      <defs>
        <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path d="M16 1 C7.716 1 1 7.716 1 16 C1 25.5 16 40 16 40 C16 40 31 25.5 31 16 C31 7.716 24.284 1 16 1 Z" 
            fill="${color}" stroke="#ffffff" stroke-width="${strokeWidth}" filter="url(#sh)"/>
      <circle cx="16" cy="15" r="${isSelected ? 6.5 : 5.5}" fill="#ffffff"/>
      ${
        isOrigin
          ? `<path d="M16 10 L19 18 L16 16.5 L13 18 Z" fill="${color}"/>`
          : isDestination
          ? `<path d="M13.5 10.5 H18.5 V15 H13.5 Z" fill="${color}"/>`
          : ''
      }
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
  }, [placemark.categoryColor, isSelected, isOrigin, isDestination]);

  return (
    <Marker
      position={{ lat: placemark.point.lat, lng: placemark.point.lng }}
      title={placemark.name}
      onClick={onClick}
      icon={icon}
      zIndex={isSelected ? 50 : isOrigin || isDestination ? 40 : 10}
    />
  );
});
