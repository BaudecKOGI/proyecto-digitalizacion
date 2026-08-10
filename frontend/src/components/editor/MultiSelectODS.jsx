import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { ODS_LIST } from '@/pages/dashboard/digitalProjects/odsData';

export const MultiSelectODS = ({ value = [], onChange, placeholder = "Seleccionar ODS..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeOption = (id) => {
    onChange(value.filter(v => v !== id));
  };

  const filteredOptions = ODS_LIST.filter(ods =>
    ods.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(ods.id).includes(searchTerm)
  );

  // Obtener los objetos ODS seleccionados
  const selectedODS = ODS_LIST.filter(ods => value.includes(ods.id));

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Botón de selección */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 bg-[var(--bg-general)] border border-[var(--line)] rounded-lg text-[var(--text-main)] text-sm cursor-pointer transition-colors ${
          isOpen ? 'border-[var(--accent)]' : ''
        } flex items-center justify-between min-h-[44px]`}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedODS.length === 0 ? (
            <span className="text-[var(--text-muted)]">{placeholder}</span>
          ) : (
            selectedODS.slice(0, 3).map((ods) => (
              <span
                key={ods.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: ods.color || '#6b7280' }}
              >
                ODS {ods.id}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(ods.id);
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
          {selectedODS.length > 3 && (
            <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-general)] px-1.5 py-0.5 rounded">
              +{selectedODS.length - 3}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-[var(--text-muted)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--panel)] border border-[var(--line)] rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
          {/* Buscador */}
          <div className="p-2 border-b border-[var(--line)] sticky top-0 bg-[var(--panel)]">
            <input
              type="text"
              placeholder="Buscar ODS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-[var(--bg-general)] border border-[var(--line)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de opciones */}
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[var(--text-muted)]">No se encontraron ODS</div>
            ) : (
              filteredOptions.map((ods) => {
                const isSelected = value.includes(ods.id);
                return (
                  <div
                    key={ods.id}
                    onClick={() => toggleOption(ods.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent)]/10 text-[var(--text-main)]'
                        : 'hover:bg-[var(--bg-general)]'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-sm border flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? ods.color || '#002B49' : 'transparent',
                        borderColor: isSelected ? ods.color || '#002B49' : '#94a3b8',
                      }}
                    >
                      {isSelected && <Check size={10} className="text-white" />}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: isSelected ? ods.color || '#002B49' : 'inherit' }}
                    >
                      {ods.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};