import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsList from '../screens/AppointmentsList';
import { useAuth } from '../contexts/AuthContext';
import CreateAppointment from '../screens/CreateAppointment';
import AppointmentDetails from '../screens/AppointmentDetails';

export interface Appointment {
    id: number;
    date: string;
    time: string;
    service: string;
    notes?: string;
    client: {
        name: string;
    };
}

const Stack = createNativeStackNavigator();
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Appointments: undefined;
    CreateAppointment: undefined;
    AppointmentDetails: { appointment: Appointment };
    EditAppointment: { appointment: Appointment };
};
export default function Routes() {
    const { token } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Appointments" component={AppointmentsList} />
                <Stack.Screen name="CreateAppointment" component={CreateAppointment} />
                <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}
