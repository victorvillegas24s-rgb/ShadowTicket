import axios from 'axios';
import { Platform } from 'react-native';

class ApiService {
  // URL base de la API - detecta la plataforma para usar la URL correcta
  // Para Android emulator: 10.0.2.2
  // Para iOS simulator o Windows/Mac: localhost
  static getBaseUrl() {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api.php';
    } else {
      return 'http://localhost:8000/api.php';
    }
  }

  async login(email, password) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?correo=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`;
      
      console.log('[ApiService] URL de login:', uri);
      console.log('[ApiService] Base URL:', url);
      
      const response = await axios.get(uri, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      console.log('[ApiService] Status code:', response.status);
      console.log('[ApiService] Response data:', response.data);

      if (response.status === 200) {
        const responseBody = response.data;
        
        if (responseBody && responseBody.success === true) {
          const user = responseBody.user;
          console.log('[ApiService] User data:', user);
          return { success: true, user };
        } else {
          const message = responseBody?.message || 'Credenciales inválidas';
          return { success: false, message };
        }
      } else {
        return { success: false, message: `Error de conexión: ${response.status}` };
      }
    } catch (error) {
      console.log('[ApiService] Excepción en login:', error);
      return { 
        success: false, 
        message: `Error de conexión: ${error.message}` 
      };
    }
  }

  async getTickets() {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=get_tickets`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return { success: true, tickets: response.data.tickets || [] };
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async getUserTickets(userId) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=get_user_tickets&user_id=${userId}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return { success: true, tickets: response.data.tickets || [] };
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async getAssignedTickets(technicianId) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=get_assigned_tickets&technician_id=${technicianId}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return { success: true, tickets: response.data.tickets || [] };
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async createTicket(userId, titulo, descripcion) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=create_ticket&user_id=${userId}&titulo=${encodeURIComponent(titulo)}&descripcion=${encodeURIComponent(descripcion)}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async updateTicket(ticketId, prioridad, tecnicoId) {
    try {
      const url = this.constructor.getBaseUrl();
      let uri = `${url}?action=update_ticket&ticket_id=${ticketId}`;
      if (prioridad) uri += `&prioridad=${encodeURIComponent(prioridad)}`;
      if (tecnicoId) uri += `&tecnico_id=${tecnicoId}`;
      
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async acceptTicket(ticketId, technicianId) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=accept_ticket&ticket_id=${ticketId}&technician_id=${technicianId}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async closeTicket(ticketId) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=close_ticket&ticket_id=${ticketId}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async getUsers() {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=get_users`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return { success: true, users: response.data.users || [] };
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async createUser(nombre, correo, password, rol) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=create_user&nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}&password=${encodeURIComponent(password)}&rol=${encodeURIComponent(rol)}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async deleteUser(userId) {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=delete_user&user_id=${userId}`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }

  async getTechnicians() {
    try {
      const url = this.constructor.getBaseUrl();
      const uri = `${url}?action=get_technicians`;
      const response = await axios.get(uri);
      
      if (response.status === 200) {
        return { success: true, technicians: response.data.technicians || [] };
      } else {
        return { success: false, message: `Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: `Error de conexión: ${e.message}` };
    }
  }
}

export default new ApiService();


