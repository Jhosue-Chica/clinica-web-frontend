import React, { useState, useEffect } from 'react';
import { pacientesService } from '../services/api';

const PacientesPage = () => {
  // Estados para la gestión de pacientes
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    dni: '',
    telefono: '',
    email: '',
    direccion: ''
  });
  
  // Estado para el paciente en edición
  const [currentPacienteId, setCurrentPacienteId] = useState(null);
  
  // Estado para el envío de formulario
  const [submitting, setSubmitting] = useState(false);

  // Cargar la lista de pacientes al montar el componente
  useEffect(() => {
    fetchPacientes();
  }, []);
  
  // Función para cargar la lista de pacientes
  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await pacientesService.getAll();
      setPacientes(data);
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
      setError('Error al cargar la lista de pacientes. Por favor, intenta nuevamente.');
    } finally {
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
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      dni: '',
      telefono: '',
      email: '',
      direccion: ''
    });
    setCurrentPacienteId(null);
    setFormMode('create');
  };
  
  // Abrir formulario para crear un nuevo paciente
  const handleNewPaciente = () => {
    resetForm();
    setShowForm(true);
    setFormMode('create');
  };
  
  // Abrir formulario para editar un paciente existente
  const handleEditPaciente = (paciente) => {
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const fechaNacimiento = paciente.fechaNacimiento 
      ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0]
      : '';
      
    setFormData({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      fechaNacimiento: fechaNacimiento,
      dni: paciente.dni,
      telefono: paciente.telefono,
      email: paciente.email,
      direccion: paciente.direccion
    });
    setCurrentPacienteId(paciente.id);
    setShowForm(true);
    setFormMode('edit');
  };
  
  // Validar el formulario antes de enviar
  const validateForm = () => {
    if (!formData.nombre.trim()) return 'El nombre es obligatorio';
    if (!formData.apellido.trim()) return 'El apellido es obligatorio';
    if (!formData.dni.trim()) return 'El DNI es obligatorio';
    
    // Validación básica de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) 
      return 'El formato del email es incorrecto';
    
    return null; // No hay errores
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (formMode === 'create') {
        // Crear nuevo paciente
        await pacientesService.create(formData);
        setSuccessMessage('Paciente creado exitosamente');
      } else {
        // Actualizar paciente existente
        await pacientesService.update(currentPacienteId, formData);
        setSuccessMessage('Paciente actualizado exitosamente');
      }
      
      // Recargar la lista y resetear el formulario
      fetchPacientes();
      setShowForm(false);
      resetForm();
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error al guardar paciente:', err);
      setError(`Error al ${formMode === 'create' ? 'crear' : 'actualizar'} el paciente. Por favor, intenta nuevamente.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Manejar la eliminación de un paciente
  const handleDeletePaciente = async (id) => {
    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await pacientesService.delete(id);
      
      // Actualizar la lista local sin necesidad de recargar
      setPacientes(pacientes.filter(paciente => paciente.id !== id));
      
      setSuccessMessage('Paciente eliminado exitosamente');
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error al eliminar paciente:', err);
      setError('Error al eliminar el paciente. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Cancelar el formulario
  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
    setError(null);
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
        <h1 className="page-title">Gestión de Pacientes</h1>
        <button className="btn btn-primary" onClick={handleNewPaciente}>
          Nuevo Paciente
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
      
      {/* Formulario para crear/editar pacientes */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {formMode === 'create' ? 'Nuevo Paciente' : 'Editar Paciente'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="dni">DNI</label>
                    <input
                      type="text"
                      className="form-control"
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="direccion">Dirección</label>
                <textarea
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
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
      
      {/* Tabla de pacientes */}
      {loading && pacientes.length === 0 ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="mt-3">Cargando pacientes...</p>
        </div>
      ) : pacientes.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha Nacimiento</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.apellido}</td>
                  <td>{formatDate(paciente.fechaNacimiento)}</td>
                  <td>{paciente.dni}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.email}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEditPaciente(paciente)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDeletePaciente(paciente.id)}
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
          No hay pacientes registrados. ¡Agrega uno nuevo!
        </div>
      )}
    </div>
  );
};

export default PacientesPage;
