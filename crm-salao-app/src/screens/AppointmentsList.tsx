import React, { useCallback, useState } from 'react';
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

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

type NavigationProps = NavigationProp<RootStackParamList>;

interface Appointment {
    id: number;
    date: string; // formato ISO completo com tempo ex: 2025-06-14T15:30:00Z
    status: 'pendente' | 'concluido' | 'cancelado';
    client: {
        name: string;
    };
    service: string;
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
        // Formatar hora e minuto com zero à esquerda
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        return `${day} de ${monthName} de ${year} às ${hours}:${minutes}`;
    } catch {
        return dateISO;
    }
}

export default function AppointmentsList() {
    const navigation = useNavigation<NavigationProps>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'concluido' | 'cancelado'>('todos');
    const [sortAsc, setSortAsc] = useState(true);

    async function fetchAppointments() {
        try {
            setLoading(true);
            const response = await api.get('/appointments');
            setAppointments(response.data);
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

    function handleStatusChange(appointmentId: number, newStatus: 'pendente' | 'concluido' | 'cancelado') {
        // Chama a API para atualizar status
        api.patch(`/appointments/${appointmentId}`, { status: newStatus })
            .then(() => {
                setAppointments(current =>
                    current.map(appt =>
                        appt.id === appointmentId ? { ...appt, status: newStatus } : appt
                    )
                );
            })
            .catch(() => Alert.alert('Erro', 'Não foi possível atualizar o status.'));
    }

    function getStatusStyle(status: string) {
        switch (status) {
            case 'concluido':
                return { backgroundColor: '#d4edda', color: '#155724', icon: 'check-circle' };
            case 'pendente':
                return { backgroundColor: '#fff3cd', color: '#856404', icon: 'schedule' };
            case 'cancelado':
                return { backgroundColor: '#f8d7da', color: '#721c24', icon: 'cancel' };
            default:
                return { backgroundColor: '#e2e3e5', color: '#383d41', icon: 'help' };
        }
    }

    // Filtros e ordenação aplicados
    const filteredAppointments = appointments
        .filter(appt => filterStatus === 'todos' || appt.status === filterStatus)
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (sortAsc) return dateA.getTime() - dateB.getTime();
            else return dateB.getTime() - dateA.getTime();
        });

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agendamentos</Text>

            {/* Filtros */}
            <View style={styles.filterRow}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={filterStatus}
                        onValueChange={(itemValue: any) => setFilterStatus(itemValue as any)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Todos" value="todos" />
                        <Picker.Item label="Pendentes" value="pendente" />
                        <Picker.Item label="Concluídos" value="concluido" />
                        <Picker.Item label="Cancelados" value="cancelado" />
                    </Picker>
                </View>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortAsc(!sortAsc)}
                    activeOpacity={0.7}
                >
                    <Icon
                        name={sortAsc ? 'arrow-upward' : 'arrow-downward'}
                        size={22}
                        color="#6200ee"
                    />
                    <Text style={styles.sortButtonText}>Ordenar por data</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200ee" />
                </View>
            ) : (
                <FlatList
                    data={filteredAppointments}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={filteredAppointments.length === 0 && { flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAppointments} />}
                    renderItem={({ item }) => {
                        const statusStyle = getStatusStyle(item.status);

                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AppointmentDetails', { appointment: item })}
                                activeOpacity={0.85}
                                style={[
                                    styles.card,
                                    { backgroundColor: statusStyle.backgroundColor },
                                    Platform.select({
                                        ios: {
                                            shadowColor: statusStyle.color,
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 6,
                                        },
                                        android: {
                                            elevation: 5,
                                        },
                                    }),
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.client}>{item.client?.name}</Text>

                                    <TouchableOpacity
                                        style={[styles.statusButton, { backgroundColor: statusStyle.color + '22' }]}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            if (item.status === 'pendente') handleStatusChange(item.id, 'concluido');
                                            else if (item.status === 'concluido') handleStatusChange(item.id, 'cancelado');
                                            else handleStatusChange(item.id, 'pendente');
                                        }}
                                    >
                                        <Icon
                                            name={statusStyle.icon}
                                            size={18}
                                            color={statusStyle.color}
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text style={[styles.statusText, { color: statusStyle.color, fontWeight: '600' }]}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.row}>
                                    <Icon name="build" size={16} color="#555" style={styles.icon} />
                                    <Text style={styles.service}>{item.service}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Icon name="schedule" size={16} color="#777" style={styles.icon} />
                                    <Text style={styles.date}>{formatDateTime(item.date)}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

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
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 30 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, color: '#222' },

    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        flex: 1,
        marginRight: 10,
        height: 50,
        justifyContent: 'center',
    },

    picker: {
        height: 60,
        color: '#333',
        backgroundColor: '#fff',
        width: '100%',    // força pegar a largura toda do container
        ...Platform.select({
            android: {
                // Android às vezes precisa de padding interno
                paddingHorizontal: 8,
                paddingVertical: 0,
            },
        }),
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6200ee',
        backgroundColor: '#f0e9ff',
        height: 50,
    },
    sortButtonText: {
        marginLeft: 6,
        color: '#6200ee',
        fontWeight: '600',
        fontSize: 14,
    },

    card: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#fafafa',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    client: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        flex: 1,
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statusText: {
        fontSize: 14,
    },

    service: {
        fontSize: 16,
        color: '#555',
    },
    date: {
        fontSize: 14,
        color: '#777',
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 6,
    },

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
    fabText: {
        fontSize: 36,
        color: '#fff',
        lineHeight: 36,
        fontWeight: 'bold',
    },
});
