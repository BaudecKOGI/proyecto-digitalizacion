import { useNavigate } from 'react-router-dom';

import Hero from '../components/landing/sections/Hero';
import AssemblySection from '../components/landing/sections/AssemblySection';
import CallToActionSection from '../components/landing/sections/CallToActionSection';
import DualitySection from '../components/landing/sections/DualitySection';
import OdsTickerSection from '../components/landing/sections/OdsTickerSection';
import HorizontalShowcase from '../components/landing/sections/HorizontalShowcase';

const SECTIONS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'assembly', label: 'Ensamblaje' },
  { id: 'duality', label: 'Dos mundos' },
  { id: 'showcase-3d', label: 'Modelos 3D' },
  { id: 'showcase-dig', label: 'Proyectos digitales' },
];

export default function PublicHome() {
  const navigate = useNavigate();

  const handleOpenGallery = (type, odsId = null) => {
    if (odsId) {
      navigate(`/galeria/${type}?ods=${odsId}`);
    } else {
      navigate(`/galeria/${type}`);
    }
  };

  return (
    <div className="w-full bg-bg text-text">

      <Hero />
      <AssemblySection />
      <DualitySection />
      <OdsTickerSection onSelectOds={(type, odsId) => handleOpenGallery(type, odsId)} />
      <HorizontalShowcase
        onOpenGallery3D={() => handleOpenGallery('3d', null)}
        onOpenGallerySoftware={() => handleOpenGallery('software', null)}
      />
      <CallToActionSection />
    </div>
  );
}