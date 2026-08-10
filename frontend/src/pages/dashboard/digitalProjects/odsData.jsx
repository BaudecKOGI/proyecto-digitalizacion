import * as React from "react";
import { Typography } from "@mui/material";

import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree";
import { BowlFood } from "@phosphor-icons/react/dist/ssr/BowlFood";
import { Heartbeat } from "@phosphor-icons/react/dist/ssr/Heartbeat";
import { BookOpen } from "@phosphor-icons/react/dist/ssr/BookOpen";
import { GenderIntersex } from "@phosphor-icons/react/dist/ssr/GenderIntersex";
import { Drop } from "@phosphor-icons/react/dist/ssr/Drop";
import { Sun } from "@phosphor-icons/react/dist/ssr/Sun";
import { TrendUp } from "@phosphor-icons/react/dist/ssr/TrendUp";
import { Cube } from "@phosphor-icons/react/dist/ssr/Cube";
import { Equals } from "@phosphor-icons/react/dist/ssr/Equals";
import { Buildings } from "@phosphor-icons/react/dist/ssr/Buildings";
import { Recycle } from "@phosphor-icons/react/dist/ssr/Recycle";
import { GlobeHemisphereWest } from "@phosphor-icons/react/dist/ssr/GlobeHemisphereWest";
import { FishSimple } from "@phosphor-icons/react/dist/ssr/FishSimple";
import { Tree } from "@phosphor-icons/react/dist/ssr/Tree";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { Handshake } from "@phosphor-icons/react/dist/ssr/Handshake";

export const ODS_LIST = [
  { id: 1, label: "ODS 1: Fin de la Pobreza", fullTitle: "FIN DE LA POBREZA", color: "#E5243B", icon: UsersThree },
  { id: 2, label: "ODS 2: Hambre Cero", fullTitle: "HAMBRE CERO", color: "#DDA63A", icon: BowlFood },
  { id: 3, label: "ODS 3: Salud y Bienestar", fullTitle: "SALUD Y BIENESTAR", color: "#4C9F38", icon: Heartbeat },
  { id: 4, label: "ODS 4: Educación de Calidad", fullTitle: "EDUCACIÓN DE CALIDAD", color: "#C5192D", icon: BookOpen },
  { id: 5, label: "ODS 5: Igualdad de Género", fullTitle: "IGUALDAD DE GÉNERO", color: "#FF3A21", icon: GenderIntersex },
  { id: 6, label: "ODS 6: Agua Limpia y Saneamiento", fullTitle: "AGUA LIMPIA Y SANEAMIENTO", color: "#26BDE2", icon: Drop },
  { id: 7, label: "ODS 7: Energía Asequible", fullTitle: "ENERGÍA ASEQUIBLE Y NO CONTAMINANTE", color: "#FCC30B", icon: Sun },
  { id: 8, label: "ODS 8: Trabajo Decente", fullTitle: "TRABAJO DECENTE Y CRECIMIENTO ECONÓMICO", color: "#A21942", icon: TrendUp },
  { id: 9, label: "ODS 9: Industria e Innovación", fullTitle: "INDUSTRIA, INNOVACIÓN E INFRAESTRUCTURA", color: "#FD6925", icon: Cube },
  { id: 10, label: "ODS 10: Reducción de Desigualdades", fullTitle: "REDUCCIÓN DE LAS DESIGUALDADES", color: "#DD1367", icon: Equals },
  { id: 11, label: "ODS 11: Ciudades Sostenibles", fullTitle: "CIUDADES Y COMUNIDADES SOSTENIBLES", color: "#FD9D24", icon: Buildings },
  { id: 12, label: "ODS 12: Producción Responsable", fullTitle: "PRODUCCIÓN Y CONSUMO RESPONSABLES", color: "#BF8B2E", icon: Recycle },
  { id: 13, label: "ODS 13: Acción por el Clima", fullTitle: "ACCIÓN POR EL CLIMA", color: "#3F7E44", icon: GlobeHemisphereWest },
  { id: 14, label: "ODS 14: Vida Submarina", fullTitle: "VIDA SUBMARINA", color: "#0A97D9", icon: FishSimple },
  { id: 15, label: "ODS 15: Vida Terrestre", fullTitle: "VIDA DE ECOSISTEMAS TERRESTRES", color: "#56C02B", icon: Tree },
  { id: 16, label: "ODS 16: Paz y Justicia", fullTitle: "PAZ, JUSTICIA E INSTITUCIONES SÓLIDAS", color: "#00689D", icon: Scales },
  { id: 17, label: "ODS 17: Alianzas", fullTitle: "ALIANZAS PARA LOGRAR LOS OBJETIVOS", color: "#19486A", icon: Handshake }
];

export const getODSById = (id) => {
  return ODS_LIST.find(item => item.id === Number(id));
};

export const getODSListByIds = (ids) => {
  if (!ids || !Array.isArray(ids)) return [];
  return ids.map(id => getODSById(id)).filter(Boolean);
};

export function OdsBadge({ odsNum }) {
  if (!odsNum) return null;
  const found = ODS_LIST.find((item) => item.id === Number(odsNum));
  if (!found) return null;
  return (
    <Typography
      component="span"
      variant="caption"
      sx={{
        color: "text.secondary",
        fontWeight: 600,
        fontSize: "0.78rem",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {found.label}
    </Typography>
  );
}

export function OdsBadges({ odsIds, size = "small", maxDisplay = 3 }) {
  if (!odsIds || odsIds.length === 0) return null;
  const items = getODSListByIds(odsIds);
  const displayItems = items.slice(0, maxDisplay);
  const remaining = items.length - maxDisplay;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {displayItems.map((ods) => (
        <span
          key={ods.id}
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            color: '#475569',
            fontSize: size === 'small' ? '0.65rem' : '0.75rem',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          ODS {ods.id}
        </span>
      ))}
      {remaining > 0 && (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: '#6b7280',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700
          }}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}