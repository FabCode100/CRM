import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../routes/index';

type NavigationProps = NavigationProp<RootStackParamList>;

function formatPhoneBR(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length > 5) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length > 0) {
    return `(${digits}`;
  }
  return '';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(dateStr: string) {
  // Verifica formato dd/mm/yyyy
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function formatDateBR(text: string): string {
  const cleaned = text.replace(/\D/g, '').slice(0, 8);
  let formatted = '';
  if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
  if (cleaned.length >= 3) formatted += '/' + cleaned.substring(2, 4);
  if (cleaned.length >= 5) formatted += '/' + cleaned.substring(4, 8);
  return formatted;
}

function convertDateBRtoISO(dateBR: string | null): string | null {
  if (!dateBR) return null;
  const [day, month, year] = dateBR.split('/');
  if (!day || !month || !year) return null;
  const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`);
  return date.toISOString();
}

export default function CreateClient() {
  const navigation = useNavigation<NavigationProps>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  function handlePhoneChange(text: string) {
    setPhone(formatPhoneBR(text));
  }

  function validateFields() {
    const newErrors = {
      name: !name.trim(),
      email: !email.trim() || !isValidEmail(email),
      phone: !phone.trim() || phone.replace(/\D/g, '').length < 10,
      birthday: birthday.trim() !== '' && !isValidDate(birthday),
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
        phone: phone.replace(/\D/g, ''),
        birthday: birthday.trim() === '' ? null : convertDateBRtoISO(birthday),
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
    setBirthday('');
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
          returnKeyType="next"
          maxLength={15}
        />

        <TextInput
          placeholder="Data de Aniversário (dd/mm/yyyy)"
          value={birthday}
          onChangeText={(text) => setBirthday(formatDateBR(text))}
          keyboardType="numeric"
          style={[styles.input, errors.birthday && styles.inputError]}
          returnKeyType="done"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleCreateClient}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Cliente</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#888', marginTop: 10 }]}
          onPress={clearFields}
        >
          <Text style={styles.buttonText}>Limpar Campos</Text>
        </TouchableOpacity>
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
