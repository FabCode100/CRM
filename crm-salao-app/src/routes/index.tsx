import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsList from '../screens/AppointmentsList';
import CreateAppointment from '../screens/CreateAppointment';
import AppointmentDetails from '../screens/AppointmentDetails';
import EditAppointment from '../screens/EditAppointment';
import ClientsList from '../screens/ClientList';
import CreateClient from '../screens/CreateClient';
import EditClient from '../screens/EditClient';
import Reports from '../screens/Reports';

// Tipagem das rotas principais
export interface Appointment {
    price?: number;
    id: number;
    date: string;
    service: string;
    status: 'pendente' | 'concluido' | 'cancelado'; 
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

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Tabs: undefined | { screen?: keyof TabParamList };
    CreateAppointment: { client?: Client };
    CreateClient: undefined;
    AppointmentDetails: { appointment: Appointment };
    EditAppointment: { appointment: Appointment };
    EditClient: { client: Client };
};

export type TabParamList = {
    ClientsList: undefined;
    Appointments: undefined;
    Reports: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabRoutes() {
    let iconName: string;
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',

                tabBarIcon: ({ focused, color, size }) => {


                    if (route.name === 'ClientsList') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Appointments') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Reports') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="ClientsList"
                component={ClientsList}
                options={{ title: 'Clientes' }}
            />
            <Tab.Screen
                name="Appointments"
                component={AppointmentsList}
                options={{ title: 'Agendamentos' }}
            />
            <Tab.Screen
                name="Reports"
                component={Reports}
                options={{ title: 'Relatórios' }}
            />
        </Tab.Navigator>
    );
}

// 👉 Rotas principais com login e tabs
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
                <Stack.Screen name="EditClient" component={EditClient} options={{ title: 'Editar Cliente' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
