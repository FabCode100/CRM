import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import api from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../routes/index.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export default function ClientsList() {
  const navigation = useNavigation<NavigationProps>();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchClients() {
          try {
              setLoading(true);
              const response = await api.get('/clients');
              setClients(response.data);
          } catch (err) {
              console.error('Erro ao buscar clientes:', err);
          } finally {
              setLoading(false);
          }
      }
  
      // Atualiza a lista sempre que a tela for focada
      useFocusEffect(
          useCallback(() => {
              fetchClients();
          }, [])
      );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <Button
        title="Novo Cliente"
        onPress={() => navigation.navigate('CreateClient')}
      />

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateAppointment', { client: item })
            }
          >
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              {item.email && <Text>Email: {item.email}</Text>}
              {item.phone && <Text>Telefone: {item.phone}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontWeight: 'bold', fontSize: 18 },
});
