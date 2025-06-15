// src/screens/EditAppointment.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/index';
import api from '../services/api';

type RouteProps = RouteProp<RootStackParamList, 'EditAppointment'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export default function EditAppointment() {
    const route = useRoute<RouteProps>();
    const navigation = useNavigation<NavProps>();
    const { appointment } = route.params;

    const [service, setService] = useState(appointment.service);
    const [date, setDate] = useState(appointment.date);
    const [notes, setNotes] = useState(appointment.notes || '');

    async function handleUpdate() {
        try {
            await api.patch(`/appointments/${appointment.id}`, {
                service,
                date,
                notes,
                clientId: appointment.client.id,
            });

            Alert.alert('Sucesso', 'Agendamento atualizado!');
            navigation.navigate('Tabs', { screen: 'Appointments' });
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível atualizar o agendamento.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Agendamento</Text>

            <TextInput
                placeholder="Serviço"
                value={service}
                onChangeText={setService}
                style={styles.input}
            />

            <TextInput
                placeholder="Data (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                style={styles.input}
            />

            <TextInput
                placeholder="Observações"
                value={notes}
                onChangeText={setNotes}
                style={styles.input}
            />

            <Button title="Salvar alterações" onPress={handleUpdate} />
            
            <Button title="Cancelar" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 8,
        fontSize: 16,
    },
});
