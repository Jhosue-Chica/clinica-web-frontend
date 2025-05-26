import axios from 'axios';

// Configuración base de Axios
const apiClient = axios.create({
  baseURL: 'https://localhost:7021/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Configuración específica para desarrollo con SSL
  httpsAgent: process.env.NODE_ENV === 'development' 
    ? { rejectUnauthorized: false } // Ignora certificados autofirmados en desarrollo
    : undefined
});

console.log('[API] Cliente API inicializado con URL base:', 'https://localhost:7021/api');

// Interceptores para logging y manejo de errores
apiClient.interceptors.request.use(
  config => {
    console.log(`[API] Solicitud ${config.method.toUpperCase()} a ${config.url}`, config.data || '');
    return config;
  },
  error => {
    console.error('[API] Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    console.log(`[API] Respuesta de ${response.config.url}:`, { 
      status: response.status, 
      statusText: response.statusText,
      data: response.data ? 'Datos recibidos' : 'Sin datos' 
    });
    return response;
  },
  error => {
    console.error(`[API] Error en la respuesta:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Servicio de Médicos
const medicosService = {
  getAll: async () => {
    console.log('[MedicosService] Obteniendo todos los médicos');
    try {
      const response = await apiClient.get('/medicos');
      console.log('[MedicosService] getAll exitoso, registros obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('[MedicosService] Error en getAll:', error.message);
      throw error;
    }
  },
  getById: async (id) => {
    console.log(`[MedicosService] Obteniendo médico con ID: ${id}`);
    try {
      const response = await apiClient.get(`/medicos/${id}`);
      console.log('[MedicosService] getById exitoso:', response.data.id);
      return response.data;
    } catch (error) {
      console.error(`[MedicosService] Error en getById para ID ${id}:`, error.message);
      throw error;
    }
  },
  create: async (medico) => {
    console.log('[MedicosService] Creando nuevo médico:', medico);
    try {
      const response = await apiClient.post('/medicos', medico);
      console.log('[MedicosService] Médico creado exitosamente, ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('[MedicosService] Error al crear médico:', error.message);
      throw error;
    }
  },
  update: async (id, medico) => {
    console.log(`[MedicosService] Actualizando médico ID ${id}:`, medico);
    try {
      const response = await apiClient.put(`/medicos/${id}`, medico);
      console.log(`[MedicosService] Médico ${id} actualizado exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`[MedicosService] Error al actualizar médico ${id}:`, error.message);
      throw error;
    }
  },
  delete: async (id) => {
    console.log(`[MedicosService] Eliminando médico ID: ${id}`);
    try {
      const response = await apiClient.delete(`/medicos/${id}`);
      console.log(`[MedicosService] Médico ${id} eliminado exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`[MedicosService] Error al eliminar médico ${id}:`, error.message);
      throw error;
    }
  }
};

// Servicio de Pacientes
const pacientesService = {
  getAll: async () => {
    console.log('[PacientesService] Obteniendo todos los pacientes');
    try {
      const response = await apiClient.get('/pacientes');
      console.log('[PacientesService] getAll exitoso, registros obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('[PacientesService] Error en getAll:', error.message);
      throw error;
    }
  },
  getById: async (id) => {
    console.log(`[PacientesService] Obteniendo paciente con ID: ${id}`);
    try {
      const response = await apiClient.get(`/pacientes/${id}`);
      console.log('[PacientesService] getById exitoso:', response.data.id);
      return response.data;
    } catch (error) {
      console.error(`[PacientesService] Error en getById para ID ${id}:`, error.message);
      throw error;
    }
  },
  create: async (paciente) => {
    console.log('[PacientesService] Creando nuevo paciente:', paciente);
    try {
      const response = await apiClient.post('/pacientes', paciente);
      console.log('[PacientesService] Paciente creado exitosamente, ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('[PacientesService] Error al crear paciente:', error.message);
      throw error;
    }
  },
  update: async (id, paciente) => {
    console.log(`[PacientesService] Actualizando paciente ID ${id}:`, paciente);
    try {
      const response = await apiClient.put(`/pacientes/${id}`, paciente);
      console.log(`[PacientesService] Paciente ${id} actualizado exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`[PacientesService] Error al actualizar paciente ${id}:`, error.message);
      throw error;
    }
  },
  delete: async (id) => {
    console.log(`[PacientesService] Eliminando paciente ID: ${id}`);
    try {
      const response = await apiClient.delete(`/pacientes/${id}`);
      console.log(`[PacientesService] Paciente ${id} eliminado exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`[PacientesService] Error al eliminar paciente ${id}:`, error.message);
      throw error;
    }
  }
};

// Servicio de Citas
const citasService = {
  getAll: async () => {
    console.log('[CitasService] Obteniendo todas las citas');
    try {
      const response = await apiClient.get('/citas');
      console.log('[CitasService] getAll exitoso, registros obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('[CitasService] Error en getAll:', error.message);
      throw error;
    }
  },
  getById: async (id) => {
    console.log(`[CitasService] Obteniendo cita con ID: ${id}`);
    try {
      const response = await apiClient.get(`/citas/${id}`);
      console.log('[CitasService] getById exitoso:', response.data.id);
      return response.data;
    } catch (error) {
      console.error(`[CitasService] Error en getById para ID ${id}:`, error.message);
      throw error;
    }
  },
  create: async (cita) => {
    console.log('[CitasService] Creando nueva cita:', cita);
    try {
      const response = await apiClient.post('/citas', cita);
      console.log('[CitasService] Cita creada exitosamente, ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('[CitasService] Error al crear cita:', error.message);
      throw error;
    }
  },
  update: async (id, cita) => {
    console.log(`[CitasService] Actualizando cita ID ${id}:`, cita);
    try {
      const response = await apiClient.put(`/citas/${id}`, cita);
      console.log(`[CitasService] Cita ${id} actualizada exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`[CitasService] Error al actualizar cita ${id}:`, error.message);
      throw error;
    }
  },
  delete: async (id) => {
    console.log(`[CitasService] Eliminando cita ID: ${id}`);
    try {
      const response = await apiClient.delete(`/citas/${id}`);
      console.log(`[CitasService] Cita ${id} eliminada exitosamente`);
      return response.data;
    } catch (error) {
      console.error(`[CitasService] Error al eliminar cita ${id}:`, error.message);
      throw error;
    }
  }
};

export { medicosService, pacientesService, citasService };
