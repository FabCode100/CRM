import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsList from '../screens/AppointmentsList';
import CreateAppointment from '../screens/CreateAppointment';
import AppointmentDetails from '../screens/AppointmentDetails';
import EditAppointment from '../screens/EditAppointment';
import ClientsList from '../screens/ClientList';
import CreateClient from '../screens/CreateClient';

export interface Appointment {
  id: number;
  date: string;
  time: string;
  service: string;
  notes?: string;
  clientId?: number;
  client: {
    id?: number;
    name: string;
  };
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

// Tipagem das rotas principais
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Tabs: undefined | { screen?: keyof TabParamList };
  CreateAppointment: { client?: Client };
  CreateClient: undefined;
  AppointmentDetails: { appointment: Appointment };
  EditAppointment: { appointment: Appointment };
};

// Tipagem das tabs
export type TabParamList = {
  ClientsList: undefined;
  Appointments: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Rotas da aba inferior
function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="ClientsList" component={ClientsList} options={{ title: 'Clientes' }} />
      <Tab.Screen name="Appointments" component={AppointmentsList} options={{ title: 'Agendamentos' }} />
    </Tab.Navigator>
  );
}

export default function Routes() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token ? 'Tabs' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tabs" component={TabRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAppointment" component={CreateAppointment} options={{ title: 'Novo Agendamento' }} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} options={{ title: 'Detalhes do Agendamento' }} />
        <Stack.Screen name="EditAppointment" component={EditAppointment} options={{ title: 'Editar Agendamento' }} />
        <Stack.Screen name="CreateClient" component={CreateClient} options={{ title: 'Novo Cliente' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
