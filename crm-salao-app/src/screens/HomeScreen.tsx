import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Bem-vindo ao CRM do Salão!</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
}
