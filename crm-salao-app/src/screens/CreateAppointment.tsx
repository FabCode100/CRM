import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes/index.tsx';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
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

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get('/clients');
        setClients(response.data);

        // 🟡 Seleciona automaticamente o cliente passado pela rota (se houver)
        if (route.params?.client) {
          setClientId(route.params.client.id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar clientes');
      } finally {
        setLoadingClients(false);
      }
    }

    fetchClients();
  }, []);

  async function handleCreate() {
    if (!date || !time || !service || !clientId) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoadingCreate(true);
    try {
      await api.post('/appointments', {
        date: `${date}T${time}:00Z`,
        service,
        clientId,
        notes: '',
      });
      Alert.alert('Sucesso', 'Agendamento criado!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar agendamento');
    } finally {
      setLoadingCreate(false);
    }
  }

  if (loadingClients) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>

      <TextInput
        placeholder="Data (ex: 2025-06-20)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Hora (ex: 15:30)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Serviço"
        value={service}
        onChangeText={setService}
        style={styles.input}
      />

      <Text>Cliente:</Text>
      <Picker
        selectedValue={clientId}
        onValueChange={(itemValue) => setClientId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um cliente" value={null} />
        {clients.map((client) => (
          <Picker.Item key={client.id} label={client.name} value={client.id} />
        ))}
      </Picker>

      <Button
        title={loadingCreate ? 'Criando...' : 'Criar'}
        onPress={handleCreate}
        disabled={loadingCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    marginBottom: 20,
  },
});
