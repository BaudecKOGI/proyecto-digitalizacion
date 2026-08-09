import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const Hub = () => {
  const navigate = useNavigate();
  const [activeSide, setActiveSide] = useState(null);

  return (
    <AuthGuard requiredRole={["EDITOR"]}>
      <style>{`
        .hub-wrapper {
          background-color: transparent !important;
          color: #1a1a1a !important;
          min-height: 100vh;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .hub-title {
          position: absolute !important;
          top: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          background: transparent !important;
          text-align: center;
          width: 100%;
          padding: 0 1rem;
          pointer-events: none;
        }

        .hub-title h1 {
          color: #111827 !important;
          font-size: clamp(1.6rem, 4vw, 2.25rem) !important;
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

        .split { 
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: row;
        }

        .split .half { 
          flex: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1) !important;
          cursor: pointer;
          padding: 6rem 1.5rem 3rem;
        }

        .hub-wrapper .side-3d { background-color: #f4fbfb !important; }
        .hub-wrapper .side-dig { background-color: #f8fafb !important; }

        .hub-wrapper .half-content {
          background-color: #ffffff !important; 
          border-radius: 20px !important;
          padding: 2.5rem 2rem !important;
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
          font-size: 1.4rem !important;
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
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-bottom: 1.5rem !important;
          background: none !important;
          border-radius: 0 !important;
          border: none !important; 
          outline: none !important;
        }

        .hub-wrapper .icon-wrap img.hub-icon {
          width: 72px;
          height: 72px;
          object-fit: contain;
          display: block;
          border: none !important;
          outline: none !important;
        }

        .half.hot { flex: 1.25 !important; }
        
        .half.dim {
          flex: 0.75 !important;
          opacity: 0.55 !important;
          filter: blur(4px) grayscale(15%) !important;
        }

        .half.hot .half-content { 
          transform: scale(1.05) !important; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08) !important;
        }
        .half.dim .half-content { 
          transform: scale(0.95) !important; 
        }

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

        @media (max-width: 900px) {
          .hub-wrapper {
            overflow-y: auto;
          }

          .hub-title {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            padding: 2rem 1.25rem 1.5rem !important;
            pointer-events: auto;
          }

          .split {
            flex-direction: column !important;
            min-height: auto !important;
          }

          .split .half {
            flex: none !important;
            min-height: auto !important;
            width: 100% !important;
            padding: 1.5rem 1.25rem !important;
            opacity: 1 !important;
            filter: none !important;
          }

          .half.hot,
          .half.dim {
            flex: none !important;
            opacity: 1 !important;
            filter: none !important;
          }

          .half.hot .half-content,
          .half.dim .half-content {
            transform: none !important;
          }

          .hub-wrapper .half-content {
            max-width: 100% !important;
            padding: 2rem 1.5rem !important;
          }

          .hub-wrapper .divider-label {
            display: none !important;
          }

          .side-3d {
            border-bottom: 1px solid #e5e7eb;
          }
        }

        @media (max-width: 480px) {
          .hub-title h1 {
            font-size: 1.5rem !important;
          }

          .hub-wrapper .half-content {
            padding: 1.75rem 1.25rem !important;
          }

          .hub-wrapper .icon-wrap {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 1rem !important;
          }

          .hub-wrapper .icon-wrap img.hub-icon {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>

      <div className="hub-wrapper">
        <div 
          className={`split ${activeSide !== null ? 'is-hovered' : ''}`}
          onMouseLeave={() => setActiveSide(null)}
        >
          <div className="hub-title">
            <div className="eyebrow">¿Qué quieres gestionar hoy?</div>
            <h1>Proyectos del Fab Lab</h1>
          </div>

          <div
            className={`half side-3d ${activeSide === '3d' ? 'hot' : activeSide === 'dig' ? 'dim' : ''}`}
            onMouseEnter={() => setActiveSide('3d')}
            onClick={() => navigate('/editor/3d')}
          >
            <div className="half-content">
              <div className="icon-wrap">
                <img src="/assets/icons/icon-3d.png" alt="Modelos 3D" className="hub-icon" />
              </div>
              <div className="half-tag">Fabricación digital</div>
              <div className="half-title">Modelos 3D</div>
              <div className="half-desc">
                Piezas impresas, cortadas o modeladas en el taller físico
              </div>
            </div>
          </div>

          <div className="divider-label mono">VS</div>

          <div
            className={`half side-dig ${activeSide === 'dig' ? 'hot' : activeSide === '3d' ? 'dim' : ''}`}
            onMouseEnter={() => setActiveSide('dig')}
            onClick={() => navigate('/editor/software')}
          >
            <div className="half-content">
              <div className="icon-wrap">
                <img src="/assets/icons/icon-software.png" alt="Proyectos Digitales" className="hub-icon" />
              </div>
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