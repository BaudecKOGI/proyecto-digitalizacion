import React from 'react';

export default function OdsWheel({ odsData, activeId, onHover }) {
  const size = 660;
  const center = size / 2;
  const radius = 300;
  const numSlices = odsData.length;
  const anglePerSlice = 360 / numSlices;

  // Helpers for polar to cartesian conversion
  const polarToCartesian = (centerX, centerY, r, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (r * Math.cos(angleInRadians)),
      y: centerY + (r * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x, y, r, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M", x, y,
      "L", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");

    return d;
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-lg">
        {odsData.map((ods, i) => {
          const startAngle = i * anglePerSlice;
          const endAngle = (i + 1) * anglePerSlice;
          const isActive = activeId === ods.id;
          
          return (
            <g
              key={ods.id}
              className="cursor-pointer transition-transform duration-300 transform origin-center"
              style={{ transform: isActive ? 'scale(1.04)' : 'scale(1)' }}
              onMouseEnter={() => onHover(ods.id)}
            >
              <path
                d={describeArc(center, center, radius, startAngle, endAngle)}
                fill={ods.color}
                stroke="#ffffff"
                strokeWidth="3"
                className="transition-all duration-300"
                style={{
                  filter: isActive ? 'brightness(1.15)' : 'brightness(1)',
                }}
              />
              
              {/* Text for the ODS number at the edge of the slice */}
              {(() => {
                const midAngle = startAngle + (anglePerSlice / 2);
                const textPos = polarToCartesian(center, center, radius * 0.82, midAngle);
                return (
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="white"
                    fontSize="24"
                    fontWeight="bold"
                    fontFamily="Roboto, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none"
                    style={{
                      transform: `rotate(${midAngle}deg)`,
                      transformOrigin: `${textPos.x}px ${textPos.y}px`
                    }}
                  >
                    {ods.id}
                  </text>
                );
              })()}
            </g>
          );
        })}
        {/* Center circle */}
        <circle cx={center} cy={center} r={radius * 0.35} fill="white" />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1f2937"
          fontSize="48"
          fontWeight="900"
          fontFamily="Poppins, sans-serif"
          className="pointer-events-none"
        >
          ODS
        </text>
      </svg>
    </div>
  );
}
