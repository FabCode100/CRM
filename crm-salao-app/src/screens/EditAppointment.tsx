import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/index';
import api from '../services/api';

type RouteProps = RouteProp<RootStackParamList, 'EditAppointment'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

function formatDateBR(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length > 2) formatted += '/' + digits.slice(2, 4);
    if (digits.length > 4) formatted += '/' + digits.slice(4, 8);
    return formatted;
}

function formatTimeBR(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    let formatted = '';
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length > 2) formatted += ':' + digits.slice(2, 4);
    return formatted;
}

function isValidDateBR(dateString: string) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

function isValidTimeBR(timeString: string) {
    if (!/^\d{2}:\d{2}$/.test(timeString)) return false;
    const [hour, minute] = timeString.split(':').map(Number);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export default function EditAppointment() {
    const route = useRoute<RouteProps>();
    const navigation = useNavigation<NavProps>();
    const { appointment } = route.params;

    const initialDate = appointment.date
        ? new Date(appointment.date).toLocaleDateString('pt-BR')
        : '';
    const initialTime = appointment.date
        ? new Date(appointment.date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        : '';

    const [service, setService] = useState(appointment.service);
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialTime);
    const [price, setPrice] = useState(
        appointment.price
            ? appointment.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })
            : ''
    );
    const [notes, setNotes] = useState(appointment.notes || '');
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);

    function handlePriceChange(text: string) {
        const numeric = text.replace(/\D/g, '');
        const intVal = parseInt(numeric || '0', 10);
        const formatted = (intVal / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        setPrice(formatted);
    }

    function handleDateChange(text: string) {
        if (text.length <= 10) setDate(formatDateBR(text));
    }

    function handleTimeChange(text: string) {
        if (text.length <= 5) setTime(formatTimeBR(text));
    }

    function validateFields() {
        const numericPrice = parseFloat(
            price.replace(/\D/g, '').padStart(3, '0').replace(/(\d{2})$/, '.$1')
        );

        const newErrors = {
            service: !service.trim(),
            date: !date.trim() || !isValidDateBR(date),
            time: !time.trim() || !isValidTimeBR(time),
            price: !price.trim() || isNaN(numericPrice) || numericPrice <= 0,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    }

    async function handleUpdate() {
        if (!validateFields()) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios corretamente.');
            return;
        }

        setLoading(true);
        try {
            const [day, month, year] = date.split('/');
            const [hour, minute] = time.split(':');
            const isoDate = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hour),
                Number(minute)
            ).toISOString();

            const response = await api.get('/appointments', {
                params: {
                    clientId: appointment.client.id,
                    date: isoDate,
                },
            });

            const conflicting = response.data.find(
                (item: any) => item.id !== appointment.id
            );

            if (conflicting) {
                Alert.alert(
                    'Conflito',
                    'Já existe um agendamento para esse cliente nesta data e hora.'
                );
                setLoading(false);
                return;
            }

            const numericPrice = parseFloat(
                price.replace(/\D/g, '').padStart(3, '0').replace(/(\d{2})$/, '.$1')
            );

            await api.patch(`/appointments/${appointment.id}`, {
                service,
                price: numericPrice,
                date: isoDate,
                notes,
                clientId: appointment.client.id,
            });

            Alert.alert('Sucesso', 'Agendamento atualizado!');
            navigation.navigate('Tabs', { screen: 'Appointments' });
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível atualizar o agendamento.');
        } finally {
            setLoading(false);
        }
    }

    function clearFields() {
        setService('');
        setDate('');
        setTime('');
        setPrice('');
        setNotes('');
        setErrors({});
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Editar Agendamento</Text>

                <TextInput
                    placeholder="Serviço"
                    value={service}
                    onChangeText={setService}
                    style={[styles.input, errors.service && styles.inputError]}
                />

                <TextInput
                    placeholder="Preço (R$)"
                    value={price}
                    onChangeText={handlePriceChange}
                    keyboardType="numeric"
                    style={[styles.input, errors.price && styles.inputError]}
                />

                <TextInput
                    placeholder="Data (DD/MM/AAAA)"
                    value={date}
                    onChangeText={handleDateChange}
                    keyboardType="numeric"
                    maxLength={10}
                    style={[styles.input, errors.date && styles.inputError]}
                />

                <TextInput
                    placeholder="Hora (HH:MM)"
                    value={time}
                    onChangeText={handleTimeChange}
                    keyboardType="numeric"
                    maxLength={5}
                    style={[styles.input, errors.time && styles.inputError]}
                />

                <TextInput
                    placeholder="Observações"
                    value={notes}
                    onChangeText={setNotes}
                    style={styles.input}
                    multiline
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={loading ? 'Salvando...' : 'Salvar alterações'}
                        onPress={handleUpdate}
                        disabled={loading}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Limpar campos" onPress={clearFields} color="#888" />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Cancelar" onPress={() => navigation.goBack()} color="#aaa" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 40,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fafafa',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
    buttonContainer: {
        marginBottom: 10,
    },
});
