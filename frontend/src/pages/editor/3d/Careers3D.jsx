import React from 'react';
import { CareersExplorer } from '@/components/editor/CareersExplorer';
import { fetchProyectos3D } from '@/services/api';

export const Careers3D = () => {
  return <CareersExplorer mode="3d" fetchFn={fetchProyectos3D} />;
};