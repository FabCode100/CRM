import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function CreateClient() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  // Função simples para formatar telefone enquanto digita (ex: (11) 91234-5678)
  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11); // max 11 dígitos (DDD + telefone)
    let formatted = digits;

    if (digits.length > 10) {
      // (99) 99999-9999
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 5) {
      // (99) 9999-9999
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      // (99) 9999
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      // (99
      formatted = `(${digits}`;
    }

    return formatted;
  }

  function handlePhoneChange(text: string) {
    setPhone(formatPhone(text));
  }

  function validateFields() {
    const newErrors = {
      name: !name.trim(),
      email: !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      phone: !phone.trim() || phone.replace(/\D/g, '').length < 10,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  }

  async function handleCreateClient() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/clients', {
        name,
        email,
        phone: phone.replace(/\D/g, ''), // envia só números para o backend
      });
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      Alert.alert('Erro', 'Não foi possível criar o cliente.');
    } finally {
      setLoading(false);
    }
  }

  function clearFields() {
    setName('');
    setEmail('');
    setPhone('');
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
        <Text style={styles.title}>Novo Cliente</Text>

        <TextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          style={[styles.input, errors.name && styles.inputError]}
          returnKeyType="next"
          autoCapitalize="words"
        />

        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, errors.email && styles.inputError]}
          returnKeyType="next"
        />

        <TextInput
          placeholder="Telefone (ex: (11) 91234-5678)"
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          style={[styles.input, errors.phone && styles.inputError]}
          returnKeyType="done"
          maxLength={15}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Salvando...' : 'Salvar Cliente'}
            onPress={handleCreateClient}
            disabled={loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Limpar Campos" onPress={clearFields} color="#888" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
