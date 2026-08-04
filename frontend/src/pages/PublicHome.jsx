import { useNavigate } from 'react-router-dom';

import Navbar from '../components/landing/navigation/PublicNavbar';
import SideNav from '../components/landing/navigation/SideNav';
import Footer from '../components/landing/navigation/PublicFooter';
import Hero from '../components/landing/sections/Hero';
import AssemblySection from '../components/landing/sections/AssemblySection';
import CallToActionSection from '../components/landing/sections/CallToActionSection';
import DualitySection from '../components/landing/sections/DualitySection';
import OdsTickerSection from '../components/landing/sections/OdsTickerSection';
import Showcase3D from '../components/landing/showcase/Showcase3D';
import ShowcaseSoftware from '../components/landing/showcase/ShowcaseSoftware';

const SECTIONS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'assembly', label: 'Ensamblaje' },
  { id: 'duality', label: 'Dos mundos' },
  { id: 'showcase-3d', label: 'Proyectos 3D' },
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
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <SideNav sections={SECTIONS} />

      <Hero />
      <AssemblySection />
      <DualitySection />
      <OdsTickerSection onSelectOds={(type, odsId) => handleOpenGallery(type, odsId)} />
      <Showcase3D onOpenGallery={() => handleOpenGallery('3d', null)} />
      <ShowcaseSoftware onOpenGallery={() => handleOpenGallery('software', null)} />
      <CallToActionSection />
      <Footer />
    </div>
  );
}