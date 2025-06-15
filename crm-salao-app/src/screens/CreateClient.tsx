import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function CreateClient() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  async function handleCreateClient() {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome do cliente é obrigatório.');
      return;
    }

    try {
      await api.post('/clients', {
        name,
        email,
        phone,
      });

      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      navigation.goBack(); // ou navigation.navigate('ClientsList');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      Alert.alert('Erro', 'Não foi possível criar o cliente.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Cliente</Text>

      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Button title="Salvar Cliente" onPress={handleCreateClient} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 8,
  },
});
