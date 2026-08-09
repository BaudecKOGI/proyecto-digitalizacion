import React, { useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

export default function GalleryFilters({
  children,
  status,
  proyectos,
  selectedOds,
  handleOdsChange,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  handleCategoryChange,
  colorClass,
}) {
  const hasProjects = status === 'success' && proyectos.length > 0;
  // Derive unique categories dynamically from the loaded projects
  const uniqueCategories = hasProjects ? [...new Set(proyectos.map(p => p.categoria_nombre).filter(Boolean))].sort() : [];

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isOdsOpen, setIsOdsOpen] = useState(true);

  const toggleCategory = (cat) => {
    if (selectedCategory.includes(cat)) {
      handleCategoryChange(selectedCategory.filter(c => c !== cat));
    } else {
      handleCategoryChange([...selectedCategory, cat]);
    }
  };

  const toggleOds = (odsId) => {
    if (selectedOds.includes(odsId)) {
      handleOdsChange(selectedOds.filter(id => id !== odsId));
    } else {
      handleOdsChange([...selectedOds, odsId]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-2 lg:px-6">

      {/* SECCIÓN ODS (Barra Lateral Izquierda) */}
      {hasProjects && (
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
          <div className="flex flex-col gap-5 py-4 pr-2">

            {/* Categorías (Ahora arriba) */}
            {uniqueCategories.length > 0 && (
              <>
                <div
                  className="flex items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <div className="text-[18px] text-[#111928] font-medium leading-[22px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Categorías
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedCategory.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryChange([]);
                        }}
                        className="text-[16px] text-[#111928] font-normal leading-[20px] hover:underline flex items-center gap-1"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <span>Limpiar</span>
                      </button>
                    )}
                    <CaretDown size={20} className={`text-[#111928] transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <div className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ${isCategoriesOpen ? 'max-h-[3000px] opacity-100 mt-3' : 'max-h-0 opacity-0 !mt-0'}`}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory.length === 0}
                      onChange={() => handleCategoryChange([])}
                      className="w-4 h-4 rounded border-gray-300 text-text focus:ring-text cursor-pointer transition-colors mt-[2px] shrink-0"
                    />
                    <span className="text-[16px] leading-[19px] font-light text-[#212529] transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Todas las categorías
                    </span>
                  </label>
                  {uniqueCategories.map((cat) => (
                    <label key={cat} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategory.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-gray-300 text-text focus:ring-text cursor-pointer transition-colors mt-[2px] shrink-0"
                      />
                      <span className="text-[16px] leading-[19px] font-light text-[#212529] transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Separador */}
                <div className="mt-4 border-t border-[#111928]"></div>
              </>
            )}

            {/* ODS (Ahora abajo) */}
            <div
              className="flex items-center justify-between gap-4 cursor-pointer select-none"
              onClick={() => setIsOdsOpen(!isOdsOpen)}
            >
              <div className="text-[18px] text-[#111928] font-medium leading-[22px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
                ODS
              </div>
              <div className="flex items-center gap-3">
                {selectedOds.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOdsChange([]);
                    }}
                    className="text-[16px] text-[#111928] font-normal leading-[20px] hover:underline flex items-center gap-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <span>Limpiar</span>
                  </button>
                )}
                <CaretDown size={20} className={`text-[#111928] transition-transform duration-300 ${isOdsOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            <div className={`flex flex-col gap-3 pr-2 transition-all duration-300 overflow-hidden ${isOdsOpen ? 'max-h-[3000px] opacity-100 mt-3' : 'max-h-0 opacity-0 !mt-0'}`}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedOds.length === 0}
                  onChange={() => handleOdsChange([])}
                  className="w-4 h-4 rounded border-gray-300 text-text focus:ring-text cursor-pointer transition-colors mt-[2px] shrink-0"
                />
                <span className="text-[16px] leading-[19px] font-light text-[#212529] transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Todos los ODS
                </span>
              </label>


              {ODS_LIST.map((ods) => {
                return (
                  <label key={ods.id} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedOds.includes(ods.id)}
                      onChange={() => toggleOds(ods.id)}
                      className="w-4 h-4 rounded border-gray-300 text-text focus:ring-text cursor-pointer transition-colors mt-[2px] shrink-0"
                    />
                    <div className="flex flex-1 items-start justify-between min-w-0">
                      <span className="text-[16px] leading-[19px] font-light text-[#212529] transition-colors pr-2" title={ods.label} style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {ods.label.replace(/^ODS \d+:\s*/, `${ods.id < 10 ? '0' + ods.id : ods.id} · `)}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* CONTENIDO PRINCIPAL (Derecha) */}
      <div className="flex-1 min-w-0 flex flex-col">
        {hasProjects && (
          <div className="mb-10 flex flex-col gap-4 xl:flex-row xl:items-center py-4">

            {/* Buscador */}
            <div className="relative w-full xl:w-80 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <MagnifyingGlass size={18} className="text-muted" weight="bold" />
              </div>
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-line bg-white py-2.5 pl-11 pr-4 text-[16px] font-normal italic leading-[28px] text-[#111928] shadow-sm placeholder:text-muted focus:border-[#111928] focus:outline-none focus:ring-1 focus:ring-[#111928] transition-all"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              />
            </div>

          </div>
        )}

        {/* GRID DE PROYECTOS */}
        {children}
      </div>
    </div>
  );
}
