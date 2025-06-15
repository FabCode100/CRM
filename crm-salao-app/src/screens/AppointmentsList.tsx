import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

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
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAppointments() {
            try {
                const response = await api.get('/appointments');
                setAppointments(response.data);
            } catch (err) {
                console.error('Erro ao buscar agendamentos:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAppointments();
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agendamentos</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.client}>{item.client?.name}</Text>
                        <Text>{item.service}</Text>
                        <Text>{item.date} às {item.time}</Text>
                    </View>
                )}
            />
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
