import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    Alert,
    RefreshControl,
} from 'react-native';
import api from '../services/api';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../routes/index.tsx';
import type { TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Tipagem
type NavigationProps = NavigationProp<RootStackParamList>;

interface Appointment {
    id: number;
    date: string; // ISO 8601 string
    status: 'pendente' | 'concluido' | 'cancelado';
    service: string;
    client: {
        name: string;
    };
}

function formatDateTime(dateISO: string) {
    try {
        const dateObj = new Date(dateISO);
        if (isNaN(dateObj.getTime())) return dateISO;

        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const months = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
        ];
        const monthName = months[dateObj.getMonth()];
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        return `${day} de ${monthName} de ${year} às ${hours}:${minutes}`;
    } catch {
        return dateISO;
    }
}

function getStatusStyle(status: string): TextStyle {
    switch (status) {
        case 'concluido':
            return { color: 'green', fontWeight: 'bold' as TextStyle['fontWeight'] };
        case 'pendente':
            return { color: '#f5a623', fontWeight: 'bold' as TextStyle['fontWeight'] };
        case 'cancelado':
            return { color: 'red', fontWeight: 'bold' as TextStyle['fontWeight'] };
        default:
            return { color: '#666' };
    }
}

export default function AppointmentsList() {
    const navigation = useNavigation<NavigationProps>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchAppointments() {
        try {
            setLoading(true);
            const response = await api.get('/appointments');
            const sortedAppointments = [...response.data].sort((a, b) =>
                new Date(a.date) > new Date(b.date) ? 1 : -1
            );
            setAppointments(sortedAppointments);
        } catch (err) {
            console.error('Erro ao buscar agendamentos:', err);
            Alert.alert('Erro', 'Não foi possível carregar os agendamentos.');
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );

    function renderEmpty() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
                <TouchableOpacity
                    style={styles.addButtonEmpty}
                    onPress={() => navigation.navigate('CreateAppointment', {})}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonText}>+ Novo Agendamento</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agendamentos</Text>

            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={appointments.length === 0 && { flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAppointments} />}
                renderItem={({ item }) => {
                    const isPast = new Date(item.date) < new Date();

                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AppointmentDetails', { appointment: item })}
                            activeOpacity={0.7}
                            style={styles.cardTouchable}
                        >
                            <View style={styles.card}>
                                <Text style={styles.client}>{item.client?.name}</Text>

                                <View style={styles.row}>
                                    <Icon name="build" size={16} color="#555" style={styles.icon} />
                                    <Text style={styles.service}>{item.service}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Icon name="schedule" size={16} color="#777" style={styles.icon} />
                                    <Text style={[styles.date, isPast && styles.pastDate]}>
                                        {formatDateTime(item.date)}
                                    </Text>
                                </View>

                                <View style={styles.row}>
                                    <Icon name="info" size={16} color="#444" style={styles.icon} />
                                    <Text style={[styles.statusText, getStatusStyle(item.status)]}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CreateAppointment', {})}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, color: '#222' },
    cardTouchable: {
        marginBottom: 15,
        borderRadius: 12,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
            android: { elevation: 3 },
        }),
    },
    card: { backgroundColor: '#fafafa', borderRadius: 12, padding: 20 },
    client: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 6 },
    service: { fontSize: 16, color: '#555' },
    date: { fontSize: 14, color: '#777', fontStyle: 'italic' },
    pastDate: { color: 'gray', textDecorationLine: 'line-through' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    emptyText: { fontSize: 18, color: '#999', marginBottom: 20, textAlign: 'center' },
    addButtonEmpty: { backgroundColor: '#6200ee', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30 },
    addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: 30,
        backgroundColor: '#6200ee',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#6200ee',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabText: { fontSize: 36, color: '#fff', lineHeight: 36, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    icon: { marginRight: 6 },
    statusText: { fontSize: 14, marginLeft: 2 },
});
