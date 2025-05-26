import React, { useState, useEffect } from 'react';
import { medicosService } from '../services/api';

const MedicosPage = () => {
  // Estados para la gestión de médicos
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    numeroColegiado: '',
    telefono: '',
    email: ''
  });
  
  // Estado para el médico en edición
  const [currentMedicoId, setCurrentMedicoId] = useState(null);
  
  // Estado para el envío de formulario
  const [submitting, setSubmitting] = useState(false);

  // Cargar la lista de médicos al montar el componente
  useEffect(() => {
    fetchMedicos();
  }, []);
  
  // Función para cargar la lista de médicos
  const fetchMedicos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await medicosService.getAll();
      setMedicos(data);
    } catch (err) {
      console.error('Error al cargar médicos:', err);
      setError('Error al cargar la lista de médicos. Por favor, intenta nuevamente.');
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
      especialidad: '',
      numeroColegiado: '',
      telefono: '',
      email: ''
    });
    setCurrentMedicoId(null);
    setFormMode('create');
  };
  
  // Abrir formulario para crear un nuevo médico
  const handleNewMedico = () => {
    resetForm();
    setShowForm(true);
    setFormMode('create');
  };
  
  // Abrir formulario para editar un médico existente
  const handleEditMedico = (medico) => {
    setFormData({
      nombre: medico.nombre,
      apellido: medico.apellido,
      especialidad: medico.especialidad,
      numeroColegiado: medico.numeroColegiado,
      telefono: medico.telefono,
      email: medico.email
    });
    setCurrentMedicoId(medico.id);
    setShowForm(true);
    setFormMode('edit');
  };
  
  // Validar el formulario antes de enviar
  const validateForm = () => {
    if (!formData.nombre.trim()) return 'El nombre es obligatorio';
    if (!formData.apellido.trim()) return 'El apellido es obligatorio';
    if (!formData.especialidad.trim()) return 'La especialidad es obligatoria';
    if (!formData.numeroColegiado.trim()) return 'El número de colegiado es obligatorio';
    
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
        // Crear nuevo médico
        await medicosService.create(formData);
        setSuccessMessage('Médico creado exitosamente');
      } else {
        // Actualizar médico existente
        await medicosService.update(currentMedicoId, formData);
        setSuccessMessage('Médico actualizado exitosamente');
      }
      
      // Recargar la lista y resetear el formulario
      fetchMedicos();
      setShowForm(false);
      resetForm();
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error al guardar médico:', err);
      setError(`Error al ${formMode === 'create' ? 'crear' : 'actualizar'} el médico. Por favor, intenta nuevamente.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Manejar la eliminación de un médico
  const handleDeleteMedico = async (id) => {
    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de que deseas eliminar este médico?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await medicosService.delete(id);
      
      // Actualizar la lista local sin necesidad de recargar
      setMedicos(medicos.filter(medico => medico.id !== id));
      
      setSuccessMessage('Médico eliminado exitosamente');
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error al eliminar médico:', err);
      setError('Error al eliminar el médico. Por favor, intenta nuevamente.');
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Médicos</h1>
        <button className="btn btn-primary" onClick={handleNewMedico}>
          Nuevo Médico
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
      
      {/* Formulario para crear/editar médicos */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {formMode === 'create' ? 'Nuevo Médico' : 'Editar Médico'}
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
                    <label className="form-label" htmlFor="especialidad">Especialidad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="numeroColegiado">Número de Colegiado</label>
                    <input
                      type="text"
                      className="form-control"
                      id="numeroColegiado"
                      name="numeroColegiado"
                      value={formData.numeroColegiado}
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
      
      {/* Tabla de médicos */}
      {loading && medicos.length === 0 ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="mt-3">Cargando médicos...</p>
        </div>
      ) : medicos.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Especialidad</th>
                <th>Número Colegiado</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id}>
                  <td>{medico.nombre}</td>
                  <td>{medico.apellido}</td>
                  <td>{medico.especialidad}</td>
                  <td>{medico.numeroColegiado}</td>
                  <td>{medico.telefono}</td>
                  <td>{medico.email}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => handleEditMedico(medico)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDeleteMedico(medico.id)}
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
          No hay médicos registrados. ¡Agrega uno nuevo!
        </div>
      )}
    </div>
  );
};

export default MedicosPage;
