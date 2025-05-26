import React, { useState, useEffect } from 'react';
import { citasService, medicosService, pacientesService } from '../services/api';

const CitasPage = () => {
  // Estados para la gestión de citas
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    duracion: 30,
    motivoConsulta: '',
    medicoId: '',
    pacienteId: ''
  });
  
  // Estado para la cita en edición
  const [currentCitaId, setCurrentCitaId] = useState(null);
  
  // Estado para el envío de formulario
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Función para cargar todos los datos necesarios
  const fetchAllData = async () => {
    console.log('[CitasPage] Iniciando carga de todos los datos');
    setLoading(true);
    setError(null);
    
    try {
      console.log('[CitasPage] Realizando llamadas paralelas a APIs');
      // Cargar datos en paralelo
      const [citasData, medicosData, pacientesData] = await Promise.all([
        citasService.getAll(),
        medicosService.getAll(),
        pacientesService.getAll()
      ]);
      
      console.log('[CitasPage] Datos recibidos exitosamente:',
        '\n- Citas:', citasData?.length || 0,
        '\n- Médicos:', medicosData?.length || 0,
        '\n- Pacientes:', pacientesData?.length || 0
      );
      
      setCitas(citasData);
      setMedicos(medicosData);
      setPacientes(pacientesData);
    } catch (err) {
      console.error('[CitasPage] Error al cargar datos:', err.message, err.stack);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      console.log('[CitasPage] Finalizando proceso de carga de datos');
      setLoading(false);
    }
  };
  
  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      fecha: '',
      hora: '',
      duracion: 30,
      motivoConsulta: '',
      medicoId: '',
      pacienteId: ''
    });
    setCurrentCitaId(null);
    setFormMode('create');
  };
  
  // Abrir formulario para crear una nueva cita
  const handleNewCita = () => {
    resetForm();
    setShowForm(true);
    setFormMode('create');
  };
  
  // Abrir formulario para editar una cita existente
  const handleEditCita = (cita) => {
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const fecha = cita.fecha 
      ? new Date(cita.fecha).toISOString().split('T')[0]
      : '';
      
    // Formatear la hora (HH:MM)
    const hora = cita.hora || '';
      
    setFormData({
      fecha: fecha,
      hora: hora,
      duracion: cita.duracion || 30,
      motivoConsulta: cita.motivoConsulta || '',
      medicoId: cita.medicoId || '',
      pacienteId: cita.pacienteId || ''
    });
    setCurrentCitaId(cita.id);
    setShowForm(true);
    setFormMode('edit');
  };
  
  // Validar el formulario antes de enviar
  const validateForm = () => {
    if (!formData.fecha) return 'La fecha es obligatoria';
    if (!formData.hora) return 'La hora es obligatoria';
    if (!formData.medicoId) return 'Debe seleccionar un médico';
    if (!formData.pacienteId) return 'Debe seleccionar un paciente';
    
    return null; // No hay errores
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    console.log('[CitasPage] Iniciando submit de formulario de cita');
    e.preventDefault();
    
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      console.warn('[CitasPage] Error de validación en formulario:', validationError);
      setError(validationError);
      return;
    }
    
    console.log(`[CitasPage] Iniciando ${formMode === 'create' ? 'creación' : 'actualización'} de cita`);
    console.log('[CitasPage] Datos del formulario:', formData);
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (formMode === 'create') {
        // Crear nueva cita
        console.log('[CitasPage] Enviando petición de creación de cita');
        const nuevaCita = await citasService.create(formData);
        console.log('[CitasPage] Cita creada exitosamente:', nuevaCita);
        setSuccessMessage('Cita creada exitosamente');
      } else {
        // Actualizar cita existente
        console.log(`[CitasPage] Enviando petición de actualización de cita ID: ${currentCitaId}`);
        const citaActualizada = await citasService.update(currentCitaId, formData);
        console.log('[CitasPage] Cita actualizada exitosamente:', citaActualizada);
        setSuccessMessage('Cita actualizada exitosamente');
      }
      
      // Recargar la lista y resetear el formulario
      console.log('[CitasPage] Recargando datos después de guardar');
      fetchAllData();
      setShowForm(false);
      resetForm();
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('[CitasPage] Error al guardar cita:', err.message, err.stack);
      setError(`Error al ${formMode === 'create' ? 'crear' : 'actualizar'} la cita. Por favor, intenta nuevamente.`);
    } finally {
      console.log('[CitasPage] Finalizando proceso de guardado de cita');
      setSubmitting(false);
    }
  };
  
  // Manejar la eliminación de una cita
  const handleDeleteCita = async (id) => {
    console.log(`[CitasPage] Solicitando confirmación para eliminar cita ID: ${id}`);
    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      console.log(`[CitasPage] Eliminación de cita ID: ${id} cancelada por el usuario`);
      return;
    }
    
    console.log(`[CitasPage] Iniciando proceso de eliminación de cita ID: ${id}`);
    setLoading(true);
    setError(null);
    
    try {
      console.log(`[CitasPage] Enviando petición de eliminación al servidor para cita ID: ${id}`);
      await citasService.delete(id);
      console.log(`[CitasPage] Cita ID: ${id} eliminada exitosamente en el servidor`);
      
      // Actualizar la lista local sin necesidad de recargar
      console.log(`[CitasPage] Actualizando estado local para reflejar la eliminación`);
      const citasAnteriores = [...citas];
      const citasNuevas = citas.filter(cita => cita.id !== id);
      console.log(`[CitasPage] Citas antes: ${citasAnteriores.length}, Citas después: ${citasNuevas.length}`);
      setCitas(citasNuevas);
      
      setSuccessMessage('Cita eliminada exitosamente');
      console.log(`[CitasPage] Mensaje de éxito establecido`);
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        console.log(`[CitasPage] Limpiando mensaje de éxito`);
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error(`[CitasPage] Error al eliminar cita ID: ${id}:`, err.message, err.stack);
      setError('Error al eliminar la cita. Por favor, intenta nuevamente.');
    } finally {
      console.log(`[CitasPage] Finalizando proceso de eliminación de cita ID: ${id}`);
      setLoading(false);
    }
  };
  
  // Cancelar el formulario
  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
    setError(null);
  };

  // Encontrar nombre de médico por ID
  const getMedicoNombre = (medicoId) => {
    const medico = medicos.find(m => m.id === medicoId);
    return medico ? `${medico.nombre} ${medico.apellido}` : 'No asignado';
  };
  
  // Encontrar nombre de paciente por ID
  const getPacienteNombre = (pacienteId) => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'No asignado';
  };

  // Formatear fecha para mostrar en la tabla
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Citas</h1>
        <button className="btn btn-primary" onClick={handleNewCita}>
          Nueva Cita
        </button>
      </div>
      
      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      {error && !loading && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {/* Formulario para crear/editar citas */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {formMode === 'create' ? 'Nueva Cita' : 'Editar Cita'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fecha">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="hora">Hora</label>
                    <input
                      type="time"
                      className="form-control"
                      id="hora"
                      name="hora"
                      value={formData.hora}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="medicoId">Médico</label>
                    <select
                      className="form-control"
                      id="medicoId"
                      name="medicoId"
                      value={formData.medicoId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un médico</option>
                      {medicos.map(medico => (
                        <option key={medico.id} value={medico.id}>
                          {medico.nombre} {medico.apellido} - {medico.especialidad}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pacienteId">Paciente</label>
                    <select
                      className="form-control"
                      id="pacienteId"
                      name="pacienteId"
                      value={formData.pacienteId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un paciente</option>
                      {pacientes.map(paciente => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.nombre} {paciente.apellido} - {paciente.dni}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="duracion">Duración (minutos)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="duracion"
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="motivoConsulta">Motivo de Consulta</label>
                    <textarea
                      className="form-control"
                      id="motivoConsulta"
                      name="motivoConsulta"
                      value={formData.motivoConsulta}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="form-group mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary me-2" 
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleCancelForm}
                  disabled={submitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Tabla de citas */}
      {loading && citas.length === 0 ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="mt-3">Cargando citas...</p>
        </div>
      ) : citas.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Duración</th>
                <th>Médico</th>
                <th>Paciente</th>
                <th>Motivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{formatDate(cita.fecha)}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.duracion} min</td>
                  <td>{getMedicoNombre(cita.medicoId)}</td>
                  <td>{getPacienteNombre(cita.pacienteId)}</td>
                  <td>
                    {cita.motivoConsulta && cita.motivoConsulta.length > 30
                      ? `${cita.motivoConsulta.substring(0, 30)}...`
                      : cita.motivoConsulta}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEditCita(cita)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDeleteCita(cita.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          No hay citas programadas. ¡Agrega una nueva!
        </div>
      )}
    </div>
  );
};

export default CitasPage;
