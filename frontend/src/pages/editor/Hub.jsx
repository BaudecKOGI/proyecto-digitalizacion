import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const Hub = () => {
  const navigate = useNavigate();
  const [activeSide, setActiveSide] = useState(null);

  return (
    <AuthGuard requiredRole={["EDITOR"]}>
      <style>{`
        /* =========================================
           1. ESTRUCTURA Y ELIMINACIÓN DEL FONDO DEL TÍTULO
           ========================================= */
        .hub-wrapper {
          background-color: transparent !important;
          color: #1a1a1a !important;
          height: 100vh;
          overflow: hidden;
        }

        /* QUITAMOS CUALQUIER BLOQUE O BARRA BLANCA DEL TÍTULO */
        .hub-title {
          position: absolute !important;
          top: 3rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          background: transparent !important; /* 100% transparente */
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          pointer-events: none; /* Para que no bloquee los clics */
          text-align: center;
          width: 100%;
        }

        .hub-title h1 {
          color: #111827 !important;
          font-size: 2.25rem !important;
          font-weight: 800 !important;
          margin: 0 !important;
        }
        
        .hub-title .eyebrow {
          color: #6b7280 !important;
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          margin-bottom: 0.5rem !important;
        }

        /* =========================================
           2. PANELES QUE OCUPAN EL 100% DE ALTO
           ========================================= */
        .split { 
          position: relative;
          height: 100vh;
          width: 100vw;
          display: flex;
        }

        .split .half { 
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1) !important;
          cursor: pointer;
        }

        /* Fondos continuos hasta arriba del todo */
        .hub-wrapper .side-3d { background-color: #f4fbfb !important; }
        .hub-wrapper .side-dig { background-color: #f8fafb !important; }

        /* =========================================
           3. LAS TARJETAS (LOS CUADRITOS BLANCOS)
           ========================================= */
        .hub-wrapper .half-content {
          background-color: #ffffff !important; 
          border-radius: 20px !important;
          padding: 3.5rem 2.5rem !important;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05) !important;
          border: 1px solid #f3f4f6 !important;
          
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.7s ease !important;
        }

        .hub-wrapper .half-title {
          color: #111827 !important;
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          margin-bottom: 0.75rem !important;
        }
        
        .hub-wrapper .half-desc {
          color: #6b7280 !important;
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
        }

        .hub-wrapper .half-tag {
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          margin-bottom: 0.75rem !important;
        }
        .side-3d .half-tag { color: #0ebab1 !important; }
        .side-dig .half-tag { color: #5b21b6 !important; }

        .hub-wrapper .icon-wrap {
          width: 72px !important;
          height: 72px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 1.5rem !important;
          font-weight: bold !important;
          margin-bottom: 1.5rem !important;
        }
        .side-3d .icon-wrap { background-color: #e0f2f1 !important; color: #0ebab1 !important; }
        .side-dig .icon-wrap { background-color: #f3e8ff !important; color: #5b21b6 !important; }

        /* =========================================
           4. ANIMACIONES Y EL VS CENTRADO
           ========================================= */
        .half.hot { flex: 1.25 !important; }
        
        .half.dim {
          flex: 0.75 !important;
          opacity: 0.5 !important;
          filter: blur(6px) grayscale(20%) !important;
        }

        .half.hot .half-content { 
          transform: scale(1.05) !important; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08) !important;
        }
        .half.dim .half-content { 
          transform: scale(0.95) !important; 
        }

        /* Divisor VS fijado al centro exacto */
        .hub-wrapper .divider-label {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
          z-index: 20;
          pointer-events: none;
          width: 42px; 
          height: 42px;
          border-radius: 50%;
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 11px; 
          font-weight: 700;
          background-color: #ffffff !important;
          color: #6b7280 !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
        }

        .split.is-hovered .divider-label {
          opacity: 0 !important;
          transform: translate(-50%, -50%) scale(0.5) !important;
        }
      `}</style>

      <div className="hub-wrapper">
        <div 
          className={`split ${activeSide !== null ? 'is-hovered' : ''}`}
          onMouseLeave={() => setActiveSide(null)}
        >
          {/* EL TÍTULO AHORA ES UN ELEMENTO FLOTANTE SIN FONDO */}
          <div className="hub-title">
            <div className="eyebrow">¿Qué quieres gestionar hoy?</div>
            <h1>Proyectos del Fab Lab</h1>
          </div>

          {/* PANEL 3D */}
          <div
            className={`half side-3d ${activeSide === '3d' ? 'hot' : activeSide === 'dig' ? 'dim' : ''}`}
            onMouseEnter={() => setActiveSide('3d')}
            onClick={() => navigate('/editor/3d')}
          >
            <div className="half-content">
              <div className="icon-wrap">▲</div>
              <div className="half-tag">Fabricación digital</div>
              <div className="half-title">Proyectos 3D</div>
              <div className="half-desc">
                Piezas impresas, cortadas o modeladas en el taller físico
              </div>
            </div>
          </div>

          {/* DIVISOR VS */}
          <div className="divider-label mono">VS</div>

          {/* PANEL DIGITAL */}
          <div
            className={`half side-dig ${activeSide === 'dig' ? 'hot' : activeSide === '3d' ? 'dim' : ''}`}
            onMouseEnter={() => setActiveSide('dig')}
            onClick={() => navigate('/editor/software')}
          >
            <div className="half-content">
              <div className="icon-wrap">&lt;/&gt;</div>
              <div className="half-tag">Desarrollo de software</div>
              <div className="half-title">Proyectos Digitales</div>
              <div className="half-desc">
                Apps, webs y sistemas hechos por los alumnos
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};