import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../routes/index';
import api from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AppointmentDetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

export default function AppointmentDetails() {
    const route = useRoute<AppointmentDetailsRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { appointment } = route.params;

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
        <View style={styles.container}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>

            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{appointment.client.name}</Text>

            <Text style={styles.label}>Serviço:</Text>
            <Text style={styles.value}>{appointment.service}</Text>

            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{appointment.date}</Text>

            {appointment.notes ? (
                <>
                    <Text style={styles.label}>Observações:</Text>
                    <Text style={styles.value}>{appointment.notes}</Text>
                </>
            ) : null}

            <View style={styles.buttons}>
                <Button title="Editar" onPress={() => navigation.navigate('EditAppointment', { appointment })} />
                <Button title="Excluir" color="red" onPress={handleDelete} />
                <Button title="Voltar" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    label: { fontWeight: 'bold', fontSize: 16, marginTop: 10 },
    value: { fontSize: 16, marginBottom: 5 },
    buttons: { marginTop: 30, gap: 10 },
});
