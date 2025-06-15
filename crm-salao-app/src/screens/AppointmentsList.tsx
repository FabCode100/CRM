import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes/index.tsx';


type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Appointments'>;

interface Appointment {
    id: number;
    date: string;
    time: string;
    service: string;
    client: {
        name: string;
    };
}

export default function AppointmentsList() {
    const navigation = useNavigation<NavigationProps>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchAppointments() {
        try {
            setLoading(true);
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (err) {
            console.error('Erro ao buscar agendamentos:', err);
        } finally {
            setLoading(false);
        }
    }

    // Atualiza a lista sempre que a tela for focada
    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agendamentos</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('AppointmentDetails', { appointment: item })}>
                        <View style={styles.card}>
                            <Text style={styles.client}>{item.client?.name}</Text>
                            <Text>{item.service}</Text>
                            <Text>{item.date} às {item.time}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Button title="Novo Agendamento" onPress={() => navigation.navigate('CreateAppointment')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    card: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginBottom: 10,
    },
    client: { fontWeight: 'bold', fontSize: 18 }
});
