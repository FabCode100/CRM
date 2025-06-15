import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsList from '../screens/AppointmentsList';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Appointments: undefined;
};
export default function Routes() {
    const { token } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Appointments" component={AppointmentsList} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}
