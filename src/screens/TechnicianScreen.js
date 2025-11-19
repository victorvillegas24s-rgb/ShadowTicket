import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import apiService from '../services/apiService';
import sessionService from '../services/sessionService';

const primaryDark = '#131A26';
const accentBlue = '#00BFFF';

export default function TechnicianScreen({ route, navigation }) {
  const { user } = route.params;
  const [allTickets, setAllTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: Todos, 1: Asignados

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    const technicianId = user.ID.toString();
    try {
      const [allResult, assignedResult] = await Promise.all([
        apiService.getTickets(),
        apiService.getAssignedTickets(technicianId),
      ]);

      if (allResult.success) {
        const sorted = (allResult.tickets || []).sort((a, b) => {
          const priorityOrder = { Crítica: 4, Alta: 3, Media: 2, Baja: 1 };
          return (priorityOrder[b.Prioridad] || 0) - (priorityOrder[a.Prioridad] || 0);
        });
        setAllTickets(sorted);
      }

      if (assignedResult.success) {
        setAssignedTickets(assignedResult.tickets || []);
      }
    } catch (e) {
      Alert.alert('Error', `Error al cargar tickets: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTicket = async (ticketId) => {
    try {
      const result = await apiService.acceptTicket(ticketId, user.ID.toString());
      if (result.success) {
        Alert.alert('Éxito', 'Ticket aceptado correctamente');
        await loadTickets();
      } else {
        Alert.alert('Error', result.message || 'Error al aceptar ticket');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      const result = await apiService.closeTicket(ticketId);
      if (result.success) {
        Alert.alert('Éxito', 'Ticket cerrado correctamente');
        await loadTickets();
      } else {
        Alert.alert('Error', result.message || 'Error al cerrar ticket');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    }
  };

  const handleLogout = async () => {
    await sessionService.logout();
    navigation.replace('Login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return '#4CAF50';
      case 'En proceso': return '#FFC107';
      case 'Pendiente': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Crítica': return '#F44336';
      case 'Alta': return '#FF9800';
      case 'Media': return '#2196F3';
      case 'Baja': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const renderTicket = ({ item }) => {
    const isAssigned = item.Tecnico_ID?.toString() === user.ID.toString();

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.Titulo || 'Sin título'}</Text>
        <Text style={styles.cardDescription}>{item.Descripcion || ''}</Text>
        <View style={styles.chipContainer}>
          <View style={[styles.chip, { backgroundColor: getStatusColor(item.Estado) }]}>
            <Text style={styles.chipText}>{item.Estado || 'Pendiente'}</Text>
          </View>
          {item.Prioridad && (
            <View style={[styles.chip, { backgroundColor: getPriorityColor(item.Prioridad) }]}>
              <Text style={styles.chipText}>{item.Prioridad}</Text>
            </View>
          )}
        </View>
        {isAssigned ? (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleCloseTicket(item.ID.toString())}
          >
            <Text style={styles.buttonText}>Cerrar Ticket</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptTicket(item.ID.toString())}
          >
            <Text style={styles.buttonText}>Aceptar Ticket</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TICKET SHADOW SUPPORT</Text>
        <Text style={styles.headerSubtitle}>¡Bienvenido, {user.Nombre || 'Técnico'}!</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <Text style={styles.menuButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 0 && styles.tabActive]}
          onPress={() => setCurrentTab(0)}
        >
          <Text style={[styles.tabText, currentTab === 0 && styles.tabTextActive]}>
            Todos los Tickets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 1 && styles.tabActive]}
          onPress={() => setCurrentTab(1)}
        >
          <Text style={[styles.tabText, currentTab === 1 && styles.tabTextActive]}>
            Mis Tickets
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={accentBlue} style={styles.loader} />
      ) : (
        <FlatList
          data={currentTab === 0 ? allTickets : assignedTickets}
          renderItem={renderTicket}
          keyExtractor={(item, index) => item.ID?.toString() || index.toString()}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadTickets} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {currentTab === 0
                ? 'No hay tickets disponibles'
                : 'No tienes tickets asignados'}
            </Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: primaryDark,
    padding: 16,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: accentBlue,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  menuButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  menuButtonText: {
    color: '#FFF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: accentBlue,
  },
  tabText: {
    color: '#999',
  },
  tabTextActive: {
    color: accentBlue,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: accentBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});


