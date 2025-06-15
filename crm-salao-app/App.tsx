import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/routes';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
      <AuthProvider>
        <Routes />
      </AuthProvider>
  );
}
