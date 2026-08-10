import React, { memo, useEffect, useState } from 'react';
import { MapContainer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CITIES = [
  {
    name: 'Lima',
    coordinates: [-12.0464, -77.0428],
    color: '#7C3AED',
  },
  {
    name: 'Huancayo',
    coordinates: [-12.0651, -75.2048],
    color: '#4F46E5',
  },
  {
    name: 'Cusco',
    coordinates: [-13.5319, -71.9675],
    color: '#6802C1',
  },
  {
    name: 'Arequipa',
    coordinates: [-16.409, -71.535],
    color: '#DC2626',
  },
];

const createCustomIcon = (color, name) => {
  return divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          background-color: ${color};
          border-radius: 50%;
          opacity: 0.25;
          animation: pulse 2s infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          z-index: 10;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const geoJsonStyle = {
  fillColor: '#EAB308',
  weight: 1.5,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.8,
};

const PeruMap = memo(() => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON del Perú
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/PER.geo.json')
      .then((res) => res.json())
      .then((geojsonData) => {
        setGeoData(geojsonData);
      })
      .catch((err) => console.error('Error cargando mapa:', err));
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full h-full min-h-[500px]">
      <div className="w-full flex-grow relative z-0">
        <MapContainer
          center={[-9.5, -75.0]}
          zoom={5}
          zoomControl={false} // Quitamos botones de zoom para que parezca un vector estático
          scrollWheelZoom={false}
          dragging={false} // Evitamos que el usuario mueva el mapa para mantenerlo centrado
          doubleClickZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 0, background: 'transparent' }}
          className="transparent-leaflet"
        >
          {geoData && <GeoJSON data={geoData} style={geoJsonStyle} />}

          {CITIES.map(({ name, coordinates, color }) => (
            <Marker
              key={name}
              position={coordinates}
              icon={createCustomIcon(color, name)}
            >
              <Tooltip
                direction="top"
                offset={[0, -15]}
                opacity={1}
                permanent
                className="custom-leaflet-tooltip"
              >
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: '900',
                  color: '#1E1B4B',
                  background: 'transparent',
                }}>
                  {name}
                </span>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-2 mb-4 flex flex-wrap justify-center gap-4 relative z-10">
        {CITIES.map(({ name, color }) => (
          <div key={name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-xs font-semibold text-gray-700"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Estilos adicionales */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .transparent-leaflet {
          background: transparent !important;
        }
        .transparent-leaflet .leaflet-control-container {
          display: none;
        }
        .custom-leaflet-tooltip {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          text-shadow: 0 0 10px rgba(255,255,255,1), 0 0 5px rgba(255,255,255,1);
        }
        .custom-leaflet-tooltip::before {
          display: none !important;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3); }
          70% { transform: scale(1.5); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
      `}} />
    </div>
  );
});

export default PeruMap;
