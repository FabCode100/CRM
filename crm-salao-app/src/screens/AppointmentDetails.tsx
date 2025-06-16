import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
    ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../routes/index';
import api from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type AppointmentDetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

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
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        return `${day} de ${monthName} de ${year} às ${hours}:${minutes}`;
    } catch {
        return dateISO;
    }
}

export default function AppointmentDetails() {
    const route = useRoute<AppointmentDetailsRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { appointment } = route.params;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'concluido':
                return '#2e7d32';
            case 'pendente':
                return '#ff9800';
            case 'cancelado':
                return '#c62828';
            default:
                return '#333';
        }
    };

    async function handleDelete() {
        Alert.alert('Confirmar', 'Deseja mesmo excluir este agendamento?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/appointments/${appointment.id}`);
                        Alert.alert('Sucesso', 'Agendamento excluído.');
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
                    }
                },
            },
        ]);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>

            <View style={styles.card}>
                <View style={styles.row}>
                    <Icon name="person" size={20} color="#555" style={styles.icon} />
                    <Text style={styles.label}>Cliente:</Text>
                </View>
                <Text style={styles.value}>{appointment.client.name}</Text>

                <View style={styles.row}>
                    <Icon name="build" size={20} color="#555" style={styles.icon} />
                    <Text style={styles.label}>Serviço:</Text>
                </View>
                <Text style={styles.value}>{appointment.service}</Text>

                <View style={styles.row}>
                    <Icon name="schedule" size={20} color="#555" style={styles.icon} />
                    <Text style={styles.label}>Data:</Text>
                </View>
                <Text style={styles.value}>{formatDateTime(appointment.date)}</Text>

                <View style={styles.row}>
                    <Icon name="info" size={20} color="#555" style={styles.icon} />
                    <Text style={styles.label}>Status:</Text>
                </View>
                <Text style={[styles.statusValue, { color: getStatusColor(appointment.status ?? '') }]}>
                    {(appointment.status ?? 'Desconhecido').charAt(0).toUpperCase() + (appointment.status ?? 'Desconhecido').slice(1)}
                </Text>


                {appointment.notes ? (
                    <>
                        <View style={styles.row}>
                            <Icon name="notes" size={20} color="#555" style={styles.icon} />
                            <Text style={styles.label}>Observações:</Text>
                        </View>
                        <Text style={styles.value}>{appointment.notes}</Text>
                    </>
                ) : null}
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#6200ee' }]}
                    onPress={() => navigation.navigate('EditAppointment', { appointment })}
                >
                    <Icon name="edit" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#c62828' }]}
                    onPress={handleDelete}
                >
                    <Icon name="delete" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={18} color="#6200ee" style={{ marginRight: 6 }} />
                <Text style={[styles.buttonText, { color: '#6200ee' }]}>Voltar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 18,
        borderRadius: 12,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontWeight: '600',
        fontSize: 15,
        color: '#333',
    },
    value: {
        fontSize: 16,
        color: '#555',
        marginLeft: 28,
        marginTop: 4,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 28,
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    backButton: {
        backgroundColor: '#e9e1ff',
    },
});
