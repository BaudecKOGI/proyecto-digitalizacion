import React from 'react';
import { Navigate } from 'react-router-dom';

// Al unificar el inicio de sesión, redirigimos automáticamente a /auth/sign-in
export const Login = () => <Navigate to="/auth/sign-in" replace />;