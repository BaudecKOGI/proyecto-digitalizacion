import React from 'react';
import { CareersExplorer } from '@/components/editor/CareersExplorer';
import { fetchProyectosSoftwareAdmin } from '../../../services/api';

export default function CareersSoftware() {
  return <CareersExplorer mode="software" fetchFn={fetchProyectosSoftwareAdmin} />;
}