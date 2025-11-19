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
} from 'react-native';
import apiService from '../services/apiService';
import sessionService from '../services/sessionService';

const primaryDark = '#131A26';
const accentBlue = '#00BFFF';

export default function AdminScreen({ route, navigation }) {
  const { user } = route.params;
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: Tickets, 1: Usuarios
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadTickets(), loadUsers(), loadTechnicians()]);
    setIsLoading(false);
  };

  const loadTickets = async () => {
    try {
      const result = await apiService.getTickets();
      if (result.success) {
        setTickets(result.tickets || []);
      } else {
        Alert.alert('Error', result.message || 'Error al cargar tickets');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await apiService.getUsers();
      if (result.success) {
        setUsers(result.users || []);
      } else {
        Alert.alert('Error', result.message || 'Error al cargar usuarios');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    }
  };

  const loadTechnicians = async () => {
    try {
      const result = await apiService.getTechnicians();
      if (result.success) {
        setTechnicians(result.technicians || []);
      }
    } catch (e) {
      // Silenciar error
    }
  };

  const handleLogout = async () => {
    await sessionService.logout();
    navigation.replace('Login');
  };

  const handleAssignTicket = async (ticket, prioridad, tecnicoId) => {
    try {
      const result = await apiService.updateTicket(
        ticket.ID.toString(),
        prioridad,
        tecnicoId
      );
      if (result.success) {
        Alert.alert('Éxito', 'Ticket actualizado correctamente');
        await loadTickets();
      } else {
        Alert.alert('Error', result.message || 'Error al actualizar ticket');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    }
  };

  const handleCreateUser = async (nombre, correo, password, rol) => {
    try {
      const result = await apiService.createUser(nombre, correo, password, rol);
      if (result.success) {
        Alert.alert('Éxito', 'Usuario creado correctamente');
        await loadUsers();
      } else {
        Alert.alert('Error', result.message || 'Error al crear usuario');
      }
    } catch (e) {
      Alert.alert('Error', `Error de conexión: ${e.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await apiService.deleteUser(userId);
              if (result.success) {
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
                await loadUsers();
              } else {
                Alert.alert('Error', result.message || 'Error al eliminar usuario');
              }
            } catch (e) {
              Alert.alert('Error', `Error de conexión: ${e.message}`);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return '#4CAF50';
      case 'En proceso':
        return '#FFC107';
      case 'Pendiente':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Crítica':
        return '#F44336';
      case 'Alta':
        return '#FF9800';
      case 'Media':
        return '#2196F3';
      case 'Baja':
        return '#4CAF50';
      default:
        return '#9E9E9E';
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
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedTicket(item);
          setShowAssignModal(true);
        }}
      >
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.Nombre || 'Sin nombre'}</Text>
      <Text style={styles.cardDescription}>
        {item.Correo || ''} - {item.Nombre_Rol || ''}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.ID.toString())}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TICKET SHADOW SUPPORT</Text>
        <Text style={styles.headerSubtitle}>¡Bienvenido, Administrador!</Text>
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
            Tickets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 1 && styles.tabActive]}
          onPress={() => setCurrentTab(1)}
        >
          <Text style={[styles.tabText, currentTab === 1 && styles.tabTextActive]}>
            Usuarios
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={accentBlue} style={styles.loader} />
      ) : (
        <FlatList
          data={currentTab === 0 ? tickets : users}
          renderItem={currentTab === 0 ? renderTicket : renderUser}
          keyExtractor={(item, index) => item.ID?.toString() || index.toString()}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {currentTab === 0 ? 'No hay tickets disponibles' : 'No hay usuarios disponibles'}
            </Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {currentTab === 1 && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateUserModal(true)}
        >
          <Text style={styles.createButtonText}>+ Crear Usuario</Text>
        </TouchableOpacity>
      )}

      {/* Modal para asignar ticket */}
      <AssignTicketModal
        visible={showAssignModal}
        ticket={selectedTicket}
        technicians={technicians}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedTicket(null);
        }}
        onAssign={handleAssignTicket}
      />

      {/* Modal para crear usuario */}
      <CreateUserModal
        visible={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onCreate={handleCreateUser}
      />
    </View>
  );
}

// Componentes de Modal simplificados
function AssignTicketModal({ visible, ticket, technicians, onClose, onAssign }) {
  const [prioridad, setPrioridad] = useState(ticket?.Prioridad || 'Media');
  const [tecnicoId, setTecnicoId] = useState(ticket?.Tecnico_ID?.toString() || null);

  if (!ticket) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.content}>
          <Text style={modalStyles.title}>Asignar Ticket</Text>
          {/* Implementar dropdowns aquí */}
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.confirmButton}
              onPress={() => {
                onAssign(ticket, prioridad, tecnicoId);
                onClose();
              }}
            >
              <Text style={modalStyles.confirmButtonText}>Asignar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function CreateUserModal({ visible, onClose, onCreate }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Estandar');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.content}>
          <Text style={modalStyles.title}>Crear Usuario</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.confirmButton}
              onPress={() => {
                if (nombre && correo && password) {
                  onCreate(nombre, correo, password, rol);
                  setNombre('');
                  setCorreo('');
                  setPassword('');
                  setRol('Estandar');
                  onClose();
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
  editButton: {
    backgroundColor: accentBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: accentBlue,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 5,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
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


