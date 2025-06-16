import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
} from 'react-native';
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
    const [date, setDate] = useState(
        appointment.date ? appointment.date.split('T')[0] : ''
    );

    function isValidDate(dateString: string) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
    const [notes, setNotes] = useState(appointment.notes || '');
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    function validateFields() {
        const newErrors = {
            service: !service.trim(),
            date: !date.trim() || !isValidDate(date),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    }

    async function handleUpdate() {
        if (!validateFields()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios corretamente.');
            return;
        }

        try {
            // Verifica se já existe um agendamento para o mesmo cliente e data (excluindo o atual)
            const response = await api.get('/appointments', {
                params: {
                    clientId: appointment.client.id,
                    date,
                },
            });

            const conflicting = response.data.find(
                (item: any) => item.id !== appointment.id
            );

            if (conflicting) {
                Alert.alert(
                    'Conflito',
                    'Já existe um agendamento para esse cliente nesta data.'
                );
                return;
            }

            // Se não houver conflito, atualiza
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

    function clearFields() {
        setService('');
        setDate('');
        setNotes('');
        setErrors({});
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Agendamento</Text>

            <TextInput
                placeholder="Serviço"
                value={service}
                onChangeText={setService}
                style={[styles.input, errors.service && styles.inputError]}
            />

            {/* Troquei o TextInputMask por TextInput simples */}
            <TextInput
                placeholder="Data (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                style={[styles.input, errors.date && styles.inputError]}
                keyboardType="numeric"
                maxLength={10}
            />

            <TextInput
                placeholder="Observações"
                value={notes}
                onChangeText={setNotes}
                style={styles.input}
                multiline
                numberOfLines={4}
            />

            <View style={styles.buttonSpacing}>
                <Button title="Salvar alterações" onPress={handleUpdate} />
            </View>

            <View style={styles.buttonSpacing}>
                <Button title="Limpar campos" onPress={clearFields} color="#888" />
            </View>

            <Button title="Cancelar" onPress={() => navigation.goBack()} color="#aaa" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
    buttonSpacing: {
        marginBottom: 12,
    },
});
