import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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

  // Validações para data e hora no formato esperado
  function isValidDate(dateStr: string) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const dateObj = new Date(dateStr);
    return !isNaN(dateObj.getTime());
  }

  function isValidTime(timeStr: string) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeStr);
  }

  function validateFields() {
    const newErrors = {
      date: !date.trim() || !isValidDate(date),
      time: !time.trim() || !isValidTime(time),
      service: !service.trim(),
      clientId: !clientId,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  }

  async function handleCreate() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Preencha corretamente todos os campos.');
      return;
    }

    setLoadingCreate(true);
    try {
      await api.post('/appointments', {
        date: `${date}T${time}:00Z`, // ISO UTC
        service,
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
    setClientId(null);
    setErrors({});
  }

  if (loadingClients) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Novo Agendamento</Text>

      <TextInput
        placeholder="Data (ex: 2025-06-20)"
        value={date}
        onChangeText={setDate}
        style={[styles.input, errors.date && styles.inputError]}
        returnKeyType="next"
        maxLength={10} // YYYY-MM-DD
      />

      <TextInput
        placeholder="Hora (ex: 15:30)"
        value={time}
        onChangeText={setTime}
        style={[styles.input, errors.time && styles.inputError]}
        returnKeyType="next"
        maxLength={5} // HH:mm
      />

      <TextInput
        placeholder="Serviço"
        value={service}
        onChangeText={setService}
        style={[styles.input, errors.service && styles.inputError]}
        returnKeyType="next"
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

      <View style={styles.buttonContainer}>
        <Button
          title={loadingCreate ? 'Criando...' : 'Criar Agendamento'}
          onPress={handleCreate}
          disabled={loadingCreate}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Limpar Campos" onPress={clearFields} color="#888" />
      </View>
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
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
