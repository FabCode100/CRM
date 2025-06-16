import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../routes/index';
import api from '../services/api';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'EditClient'>;
type RouteProps = RouteProp<RootStackParamList, 'EditClient'>;

export default function EditClient() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();
    const { client } = route.params;

    const [name, setName] = useState(client.name);
    const [email, setEmail] = useState(client.email ?? '');
    const [phone, setPhone] = useState(client.phone ?? '');

    async function handleSave() {
        if (!name.trim()) {
            Alert.alert('Erro', 'O nome é obrigatório.');
            return;
        }

        try {
            await api.patch(`/clients/${client.id}`, {
                name,
                email,
                phone,
            });

            Alert.alert('Sucesso', 'Cliente atualizado com sucesso.');
            navigation.goBack();
        } catch (err) {
            console.error('Erro ao atualizar cliente:', err);
            Alert.alert('Erro', 'Não foi possível atualizar o cliente.');
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Cliente</Text>

            <Text style={styles.label}>Nome *</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite o email"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Digite o telefone"
                keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </ScrollView>
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
    },

    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
        color: '#444',
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

    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#6200ee',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
