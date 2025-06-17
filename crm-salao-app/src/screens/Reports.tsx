import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import type { Appointment } from '../routes/index';

export default function Dashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const { width: screenWidth } = useWindowDimensions();

    async function fetchAppointments() {
        setRefreshing(true);
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Contagem status
    const statusCounts = appointments.reduce(
        (acc, appt) => {
            acc.total++;
            acc[appt.status] = (acc[appt.status] || 0) + 1;
            return acc;
        },
        { total: 0, pendente: 0, concluido: 0, cancelado: 0 }
    );

    // Contagem serviços, clientes e serviços por cliente
    const serviceCounts: Record<string, number> = {};
    const clientCounts: Record<string, number> = {};
    const clientServices: Record<string, Record<string, number>> = {};

    // Para top 3 clientes por valor acumulado (price)
    const clientPriceSums: Record<string, number> = {};

    appointments.forEach((appt) => {
        const service = appt.service;
        const clientName = appt.client?.name || 'Desconhecido';

        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
        clientCounts[clientName] = (clientCounts[clientName] || 0) + 1;

        if (!clientServices[clientName]) {
            clientServices[clientName] = {};
        }
        clientServices[clientName][service] = (clientServices[clientName][service] || 0) + 1;

        // Soma preço por cliente
        const price = typeof appt.price === 'number' ? appt.price : 0;
        clientPriceSums[clientName] = (clientPriceSums[clientName] || 0) + price;
    });

    // Top 3 serviços
    const top3Services = Object.entries(serviceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
    const limitedServiceCounts = Object.fromEntries(top3Services);

    // Top 5 clientes por número de agendamentos
    const sortedClients = Object.entries(clientCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    const clientData = {
        labels: sortedClients.map(([name]) => name),
        datasets: [{ data: sortedClients.map(([, count]) => count) }],
    };

    // Top 3 clientes por valor acumulado
    const top3ClientsByPrice = Object.entries(clientPriceSums)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
    const clientPriceData = {
        labels: top3ClientsByPrice.map(([name]) => name),
        datasets: [{ data: top3ClientsByPrice.map(([, totalPrice]) => totalPrice) }],
    };

    const statusData = {
        labels: ['Pendente', 'Concluído', 'Cancelado'],
        datasets: [{ data: [statusCounts.pendente, statusCounts.concluido, statusCounts.cancelado] }],
    };

    const serviceData = {
        labels: Object.keys(limitedServiceCounts),
        datasets: [{ data: Object.values(limitedServiceCounts) }],
    };

    const selectedClientServiceData = selectedClient && clientServices[selectedClient]
        ? {
            labels: Object.keys(clientServices[selectedClient]),
            datasets: [
                {
                    data: Object.values(clientServices[selectedClient]),
                },
            ],
        }
        : { labels: [], datasets: [{ data: [] }] };

    const chartWidth = screenWidth - 48;

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#f0f0f7',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: { borderRadius: 16 },
        propsForLabels: { fontSize: 13, fontWeight: '600' },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#ddd',
        },
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />}
        >
            <Text style={styles.sectionTitle}>Dashboard</Text>

            <View style={styles.cardsContainer}>
                <View style={[styles.card, styles.cardTotal]}>
                    <MaterialCommunityIcons name="calendar-check" size={36} color="#fff" />
                    <Text style={styles.cardTitle}>Total de Agendamentos</Text>
                    <Text style={styles.cardCount}>{statusCounts.total}</Text>
                </View>
                <View style={[styles.card, styles.cardPendente]}>
                    <MaterialCommunityIcons name="clock-outline" size={36} color="#fff" />
                    <Text style={styles.cardTitle}>Pendentes</Text>
                    <Text style={styles.cardCount}>{statusCounts.pendente}</Text>
                </View>
                <View style={[styles.card, styles.cardConcluido]}>
                    <MaterialCommunityIcons name="check-circle-outline" size={36} color="#fff" />
                    <Text style={styles.cardTitle}>Concluídos</Text>
                    <Text style={styles.cardCount}>{statusCounts.concluido}</Text>
                </View>
                <View style={[styles.card, styles.cardCancelado]}>
                    <MaterialCommunityIcons name="close-circle-outline" size={36} color="#fff" />
                    <Text style={styles.cardTitle}>Cancelados</Text>
                    <Text style={styles.cardCount}>{statusCounts.cancelado}</Text>
                </View>
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Agendamentos por Status</Text>
                <BarChart
                    data={statusData}
                    width={chartWidth}
                    height={220}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    fromZero
                    style={styles.chart}
                    showValuesOnTopOfBars
                    yAxisLabel={''}
                    yAxisSuffix={''}
                />
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Agendamentos por Serviço (Top 3)</Text>
                <BarChart
                    data={serviceData}
                    width={chartWidth}
                    height={220}
                    chartConfig={{
                        ...chartConfig,
                        color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
                    }}
                    verticalLabelRotation={0}
                    fromZero
                    style={styles.chart}
                    showValuesOnTopOfBars
                    yAxisLabel={''}
                    yAxisSuffix={''}
                />
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Top 5 Clientes (Número de Agendamentos)</Text>
                <BarChart
                    data={clientData}
                    width={chartWidth}
                    height={220}
                    chartConfig={{
                        ...chartConfig,
                        color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
                    }}
                    verticalLabelRotation={0}
                    fromZero
                    style={styles.chart}
                    showValuesOnTopOfBars
                    yAxisLabel={''}
                    yAxisSuffix={''}
                />
            </View>

            {/* NOVO GRÁFICO ADICIONADO */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Top 3 Clientes por Valor Acumulado (R$)</Text>
                <BarChart
                    data={clientPriceData}
                    width={chartWidth}
                    height={220}
                    chartConfig={{
                        ...chartConfig,
                        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
                    }}
                    verticalLabelRotation={0}
                    fromZero
                    style={styles.chart}
                    showValuesOnTopOfBars
                    yAxisLabel="R$ "
                    yAxisSuffix=""
                />
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Filtrar Serviços por Cliente</Text>
                <Picker
                    selectedValue={selectedClient}
                    onValueChange={(itemValue) => setSelectedClient(itemValue)}
                    style={{ backgroundColor: '#f0f0f0', borderRadius: 8 }}
                >
                    <Picker.Item label="Selecione um cliente" value={null} />
                    {Object.keys(clientCounts).map((clientName) => (
                        <Picker.Item key={clientName} label={clientName} value={clientName} />
                    ))}
                </Picker>

                {selectedClient && (
                    <>
                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                            Serviços mais realizados por {selectedClient}
                        </Text>
                        <BarChart
                            data={selectedClientServiceData}
                            width={chartWidth}
                            height={220}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
                            }}
                            verticalLabelRotation={0}
                            fromZero
                            style={styles.chart}
                            showValuesOnTopOfBars
                            yAxisLabel={''}
                            yAxisSuffix={''}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 24,
        backgroundColor: '#f5f7fb',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        width: '47%',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        alignItems: 'center',
    },
    cardTotal: {
        backgroundColor: '#4c6ef5',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    cardPendente: { backgroundColor: '#ffe066' },
    cardConcluido: { backgroundColor: '#51cf66' },
    cardCancelado: { backgroundColor: '#ff6b6b' },
    cardTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
    },
    cardCount: {
        marginTop: 6,
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
    },
    chartSection: {
        marginBottom: 32,
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    chart: {
        borderRadius: 16,
        marginTop: 8,
        alignSelf: 'center',
    },
});
