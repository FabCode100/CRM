import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes/index';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      const sortedClients = response.data.sort((a: Client, b: Client) =>
        a.name.localeCompare(b.name)
      );
      setClients(sortedClients);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      Alert.alert('Erro', 'Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleDelete(client: Client) {
    Alert.alert(
      'Excluir cliente',
      `Tem certeza que deseja excluir ${client.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/clients/${client.id}`);
              Alert.alert('Sucesso', 'Cliente excluído com sucesso.');
              fetchClients();
            } catch (err) {
              console.error('Erro ao excluir cliente:', err);
              Alert.alert('Erro', 'Não foi possível excluir o cliente.');
            }
          },
        },
      ]
    );
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
      </View>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={clients.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardTouchable}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateAppointment', { client: item })
              }
              style={styles.cardContent}
              activeOpacity={0.8}
            >
              <View style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>
                {item.email && <Text style={styles.info}>📧 {item.email}</Text>}
                {item.phone && <Text style={styles.info}>📞 {item.phone}</Text>}
              </View>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditClient', { client: item })}
                style={styles.iconButton}
              >
                <Icon name="create-outline" size={22} color="#444" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={styles.iconButton}
              >
                <Icon name="trash-outline" size={22} color="#e53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateClient')}
        activeOpacity={0.8}
      >
        <Icon name="person-add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  cardTouchable: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
    position: 'relative',
  },

  cardContent: {
    flex: 1,
    padding: 18,
  },

  card: {
    borderRadius: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },

  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },

  fab: {
    position: 'absolute',
    right: 25,
    bottom: 30,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  actions: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
    gap: 8,
  },

  iconButton: {
    padding: 6,
  },
});
