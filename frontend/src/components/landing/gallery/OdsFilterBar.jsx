import React from 'react';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

export default function OdsFilterBar({
  status,
  proyectos,
  selectedOds,
  handleOdsChange,
  colorClass,
}) {
  if (status !== 'success' || proyectos.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 border-y border-line/60 bg-panel/20 px-[8vw] py-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="font-sans text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted">
          FILTRAR POR OBJETIVO DE DESARROLLO SOSTENIBLE (ONU)
        </div>
        {selectedOds && (
          <button
            onClick={() => handleOdsChange(null)}
            className={`font-sans text-[11px] font-bold hover:underline flex items-center gap-1 ${colorClass}`}
          >
            <span>× Quitar filtro ODS</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleOdsChange(null)}
          className={`shrink-0 border px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-widest transition-colors ${
            selectedOds === null
              ? 'border-text bg-text text-bg'
              : 'border-line bg-panel text-muted hover:border-text hover:text-text'
          }`}
        >
          Todos ({proyectos.length})
        </button>
        {ODS_LIST.map((ods) => {
          const count = proyectos.filter((p) => Number(p.ods) === ods.id).length;
          const isSelected = selectedOds === ods.id;
          return (
            <button
              key={ods.id}
              onClick={() => handleOdsChange(isSelected ? null : ods.id)}
              className={`group shrink-0 flex items-center gap-2 border px-3.5 py-1.5 font-sans text-[11px] font-bold transition-all ${
                isSelected
                  ? 'border-text bg-panel text-text shadow-sm'
                  : 'border-line/80 bg-panel/60 text-muted hover:border-text hover:text-text'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: ods.color }}
              />
              <span>{ods.label.replace(/^ODS \d+:\s*/, `${ods.id < 10 ? '0' + ods.id : ods.id} · `)}</span>
              {count > 0 && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 font-mono ${
                    isSelected ? 'bg-text text-bg' : 'bg-line/60 text-muted'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
