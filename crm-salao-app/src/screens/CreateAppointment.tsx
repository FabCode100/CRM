import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes/index';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'CreateAppointment'
>;
type RouteProps = RouteProp<RootStackParamList, 'CreateAppointment'>;

interface Client {
  id: number;
  name: string;
}

// Funções de formatação e validação (mantidas iguais)
function formatDateBR(text: string) {
  const cleaned = text.replace(/\D/g, '').slice(0, 8);
  let formatted = '';
  if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
  if (cleaned.length >= 3) formatted += '/' + cleaned.substring(2, 4);
  if (cleaned.length >= 5) formatted += '/' + cleaned.substring(4, 8);
  return formatted;
}

function formatTimeBR(text: string) {
  const cleaned = text.replace(/\D/g, '').slice(0, 4);
  let formatted = '';
  if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
  if (cleaned.length >= 3) formatted += ':' + cleaned.substring(2, 4);
  return formatted;
}

function isValidDateBR(dateStr: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidTimeBR(timeStr: string) {
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return false;
  const [hour, minute] = timeStr.split(':').map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function formatToBRL(value: string) {
  const numericValue = value.replace(/\D/g, '');
  const integerValue = parseInt(numericValue || '0', 10);
  return (integerValue / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function CreateAppointment() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [clientId, setClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [price, setPrice] = useState('');

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get('/clients');
        setClients(response.data);

        if (route.params?.client) {
          setClientId(route.params.client.id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os clientes.');
      } finally {
        setLoadingClients(false);
      }
    }
    fetchClients();
  }, [route.params]);

  function validateFields() {
    const newErrors = {
      date: !date.trim() || !isValidDateBR(date),
      time: !time.trim() || !isValidTimeBR(time),
      service: !service.trim(),
      price:
        !price.trim() ||
        isNaN(
          parseFloat(
            price
              .replace(/\D/g, '')
              .padStart(3, '0')
              .replace(/(\d{2})$/, '.$1')
          )
        ),
      clientId: !clientId,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  }

  const handlePriceChange = (text: string) => {
    setPrice(formatToBRL(text));
  };

  async function handleCreate() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Preencha corretamente todos os campos.');
      return;
    }

    setLoadingCreate(true);

    const numericPrice = parseFloat(
      price
        .replace(/\D/g, '') // só números
        .padStart(3, '0') // garante pelo menos 3 dígitos
        .replace(/(\d{2})$/, '.$1') // insere ponto decimal
    );

    const [day, month, year] = date.split('/').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const dt = new Date(year, month - 1, day, hour, minute);

    const isoString = dt.toISOString();

    try {
      await api.post('/appointments', {
        date: isoString,
        service,
        price: numericPrice,
        clientId,
        notes: '',
      });
      Alert.alert('Sucesso', 'Agendamento criado!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao criar agendamento');
    } finally {
      setLoadingCreate(false);
    }
  }

  function clearFields() {
    setDate('');
    setTime('');
    setService('');
    setPrice('');
    setClientId(null);
    setErrors({});
  }

  if (loadingClients) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Novo Agendamento</Text>

      <TextInput
        placeholder="Data (DD/MM/AAAA)"
        value={date}
        onChangeText={(text) => setDate(formatDateBR(text))}
        style={[styles.input, errors.date && styles.inputError]}
        maxLength={10}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Hora (HH:MM)"
        value={time}
        onChangeText={(text) => setTime(formatTimeBR(text))}
        style={[styles.input, errors.time && styles.inputError]}
        maxLength={5}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Serviço"
        value={service}
        onChangeText={setService}
        style={[styles.input, errors.service && styles.inputError]}
      />

      <TextInput
        placeholder="Valor do Serviço (ex: R$ 100,00)"
        value={price}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
        style={[styles.input, errors.price && styles.inputError]}
      />

      <Text style={styles.label}>Cliente:</Text>
      <Picker
        selectedValue={clientId}
        onValueChange={(itemValue) => setClientId(itemValue)}
        style={[styles.picker, errors.clientId && styles.inputError]}
      >
        <Picker.Item label="Selecione um cliente" value={null} />
        {clients.map((client) => (
          <Picker.Item key={client.id} label={client.name} value={client.id} />
        ))}
      </Picker>

      <TouchableOpacity
        style={[styles.button, loadingCreate && { opacity: 0.6 }]}
        onPress={handleCreate}
        disabled={loadingCreate}
      >
        {loadingCreate ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Criar Agendamento</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#888', marginTop: 10 }]}
        onPress={clearFields}
      >
        <Text style={styles.buttonText}>Limpar Campos</Text>
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
    textAlign: 'center',
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

  picker: {
    marginBottom: 20,
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
