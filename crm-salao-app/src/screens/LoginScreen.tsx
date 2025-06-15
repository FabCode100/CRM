import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {
        try {
            await login(email, password);
        } catch (err: any) {
            console.log('Login error:', err.response?.data || err.message);
            Alert.alert('Erro', err.response?.data?.message || 'Falha no login');
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <Button title="Entrar" onPress={handleLogin} />
        </View>
    );
}
