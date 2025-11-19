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
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import apiService from '../services/apiService';
import sessionService from '../services/sessionService';

const primaryDark = '#131A26';
const accentBlue = '#00BFFF';

export default function StandardScreen({ route, navigation }) {
  const { user } = route.params;
  const [userTickets, setUserTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: Crear, 1: Mis Tickets
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (currentTab === 1) {
      loadUserTickets();
    }
  }, [currentTab]);

  const loadUserTickets = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getUserTickets(user.ID.toString());
      if (result.success) {
        setUserTickets(result.tickets || []);
      } else {
        Alert.alert('Error', result.message || 'Error al cargar tickets');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (titulo, descripcion) => {
    try {
      const result = await apiService.createTicket(
        user.ID.toString(),
        titulo,
        descripcion
      );
      if (result.success) {
        Alert.alert('Éxito', 'Ticket creado correctamente');
        setShowCreateModal(false);
        await loadUserTickets();
        setCurrentTab(1);
      } else {
        Alert.alert('Error', result.message || 'Error al crear ticket');
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

  const renderTicket = ({ item }) => (
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TICKET SHADOW SUPPORT</Text>
        <Text style={styles.headerSubtitle}>¡Bienvenido, {user.Nombre || 'Usuario'}!</Text>
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
            Crear Ticket
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

      {currentTab === 0 ? (
        <ScrollView contentContainerStyle={styles.createContainer}>
          <Text style={styles.createTitle}>Crear Nuevo Ticket</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.createButtonText}>+ Nuevo Ticket</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          {isLoading ? (
            <ActivityIndicator size="large" color={accentBlue} style={styles.loader} />
          ) : (
            <FlatList
              data={userTickets}
              renderItem={renderTicket}
              keyExtractor={(item, index) => item.ID?.toString() || index.toString()}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadUserTickets} />}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No has creado ningún ticket</Text>
              }
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      )}

      <CreateTicketModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTicket}
      />
    </View>
  );
}

function CreateTicketModal({ visible, onClose, onCreate }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.content}>
          <Text style={modalStyles.title}>Nuevo Ticket</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.confirmButton}
              onPress={() => {
                if (titulo && descripcion) {
                  onCreate(titulo, descripcion);
                  setTitulo('');
                  setDescripcion('');
                } else {
                  Alert.alert('Error', 'Por favor, completa todos los campos');
                }
              }}
            >
              <Text style={modalStyles.confirmButtonText}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  createContainer: {
    padding: 24,
    alignItems: 'center',
  },
  createTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: accentBlue,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
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
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    padding: 12,
    marginRight: 12,
  },
  confirmButton: {
    backgroundColor: accentBlue,
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});


