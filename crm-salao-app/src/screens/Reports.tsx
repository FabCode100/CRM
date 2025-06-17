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
import api from '../services/api';
import type { Appointment } from '../routes/index';

export default function Dashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [refreshing, setRefreshing] = useState(false);
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

    const statusCounts = appointments.reduce(
        (acc, appt) => {
            acc.total++;
            acc[appt.status] = (acc[appt.status] || 0) + 1;
            return acc;
        },
        { total: 0, pendente: 0, concluido: 0, cancelado: 0 }
    );

    const serviceCounts: Record<string, number> = {};
    const clientCounts: Record<string, number> = {};
    appointments.forEach((appt) => {
        serviceCounts[appt.service] = (serviceCounts[appt.service] || 0) + 1;
        const name = appt.client?.name || 'Desconhecido';
        clientCounts[name] = (clientCounts[name] || 0) + 1;
    });

    // Limitar a top 3 serviços para o gráfico
    const top3Services = Object.entries(serviceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
    const limitedServiceCounts = Object.fromEntries(top3Services);

    function getBarChartData(counts: Record<string, number>) {
        return {
            labels: Object.keys(counts),
            datasets: [{ data: Object.values(counts) }],
        };
    }

    const statusData = getBarChartData({
        pendente: statusCounts.pendente,
        concluido: statusCounts.concluido,
        cancelado: statusCounts.cancelado,
    });

    const serviceData = getBarChartData(limitedServiceCounts);

    const sortedClients = Object.entries(clientCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    const clientData = getBarChartData(Object.fromEntries(sortedClients));

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
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />
            }
        >
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

            {/* Gráficos */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Agendamentos por Status</Text>
                <BarChart
                    data={statusData}
                    width={chartWidth}
                    height={220}
                    yAxisInterval={1}
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
                    yAxisInterval={1}
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
                <Text style={styles.sectionTitle}>Top 5 Clientes</Text>
                <BarChart
                    data={clientData}
                    width={chartWidth}
                    height={220}
                    yAxisInterval={1}
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
    cardPendente: {
        backgroundColor: '#ffe066',
    },
    cardConcluido: {
        backgroundColor: '#51cf66',
    },
    cardCancelado: {
        backgroundColor: '#ff6b6b',
    },
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
        paddingHorizontal: 4,
    },
    chart: {
        borderRadius: 16,
        marginTop: 8,
        alignSelf: 'center',
    },
});
