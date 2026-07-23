import { useState } from 'react';

import Navbar from '../components/landing/navigation/PublicNavbar';
import SideNav from '../components/landing/navigation/SideNav';
import Footer from '../components/landing/navigation/PublicFooter';
import GalleryScreen from '../components/landing/navigation/GalleryScreen';
import Hero from '../components/landing/sections/Hero';
import AssemblySection from '../components/landing/sections/AssemblySection';
import StatsSection from '../components/landing/sections/StatsSection';
import DualitySection from '../components/landing/sections/DualitySection';
import Showcase3D from '../components/landing/showcase/Showcase3D';
import ShowcaseSoftware from '../components/landing/showcase/ShowcaseSoftware';
import { fetchProyectos3D, fetchProyectosSoftware } from '../services/api';

const SECTIONS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'assembly', label: 'Ensamblaje' },
  { id: 'duality', label: 'Dos mundos' },
  { id: 'showcase-3d', label: 'Proyectos 3D' },
  { id: 'showcase-dig', label: 'Proyectos digitales' },
];

export default function PublicHome() {
  const [activeGallery, setActiveGallery] = useState(null);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <SideNav sections={SECTIONS} />

      <Hero />
      <StatsSection />
      <AssemblySection />
      <DualitySection />
      <Showcase3D onOpenGallery={() => setActiveGallery('3d')} />
      <ShowcaseSoftware onOpenGallery={() => setActiveGallery('dig')} />
      <Footer />

      <GalleryScreen
        id="gallery-3d"
        active={activeGallery === '3d'}
        onClose={() => setActiveGallery(null)}
        type="3d"
        fetchFn={fetchProyectos3D}
        tag="Fabricación digital"
        title="Proyectos 3D"
        description="Todo lo diseñado y fabricado en el Fab Lab, con su propio visor interactivo."
      />
      <GalleryScreen
        id="gallery-dig"
        active={activeGallery === 'dig'}
        activeGallery={activeGallery}
        onClose={() => setActiveGallery(null)}
        type="software"
        fetchFn={fetchProyectosSoftware}
        tag="Desarrollo de software"
        title="Proyectos Digitales"
        description="Apps, webs y sistemas creados por alumnos, con vista previa en video."
      />
    </div>
  );
}