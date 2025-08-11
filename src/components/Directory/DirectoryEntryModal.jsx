import { useState, useEffect } from 'react';
import { DirectoryService } from '../../services/directory.service.js';

export default function DirectoryEntryModal({ isOpen, onClose, entry, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '', fechaRevision: '', nombreRevisor: '', codigoUPGD: '', nombreInstitution: '', nombreGerente: '', emailGerente: '', celularGerente: '', tieneSistemas: false, nombreSistemas: '', emailSistemas: '', celularSistemas: '', tieneComiteInfecciones: false, nombreComiteInfecciones: '', emailComiteInfecciones: '', celularComiteInfecciones: '', nombreSivigila: '', emailSivigila: '', celularSivigila: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    if (entry) {
      setFormData({
        email: entry.email,
        fechaRevision: new Date(entry.fechaRevision).toISOString().split('T')[0],
        nombreRevisor: entry.nombreRevisor,
        codigoUPGD: entry.codigoUPGD,
        nombreInstitution: entry.nombreInstitution,
        nombreGerente: entry.nombreGerente,
        emailGerente: entry.emailGerente,
        celularGerente: entry.celularGerente,
        tieneSistemas: entry.tieneSistemas,
        nombreSistemas: entry.nombreSistemas || '',
        emailSistemas: entry.emailSistemas || '',
        celularSistemas: entry.celularSistemas || '',
        tieneComiteInfecciones: entry.tieneComiteInfecciones,
        nombreComiteInfecciones: entry.nombreComiteInfecciones || '',
        emailComiteInfecciones: entry.emailComiteInfecciones || '',
        celularComiteInfecciones: entry.celularComiteInfecciones || '',
        nombreSivigila: entry.nombreSivigila,
        emailSivigila: entry.emailSivigila,
        celularSivigila: entry.celularSivigila
      });
    } else {
      setFormData({
        email: '', fechaRevision: new Date().toISOString().split('T')[0], nombreRevisor: '', codigoUPGD: '76001', nombreInstitution: '', nombreGerente: '', emailGerente: '', celularGerente: '', tieneSistemas: false, nombreSistemas: '', emailSistemas: '', celularSistemas: '', tieneComiteInfecciones: false, nombreComiteInfecciones: '', emailComiteInfecciones: '', celularComiteInfecciones: '', nombreSivigila: '', emailSivigila: '', celularSivigila: ''
      });
    }
    setCurrentSection(1); setError('');
  }, [entry, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (entry) { await DirectoryService.updateEntry(entry.id, { ...formData, id: entry.id }); onSuccess(`Institución "${formData.nombreInstitution}" actualizada exitosamente.`); }
      else { await DirectoryService.createEntry(formData); onSuccess(`Institución "${formData.nombreInstitution}" creada exitosamente.`); }
    } catch (err) { setError(err?.response?.data?.message || 'Error al procesar la solicitud'); }
    finally { setLoading(false); }
  };

  const nextSection = () => currentSection < 4 && setCurrentSection(currentSection + 1);
  const prevSection = () => currentSection > 1 && setCurrentSection(currentSection - 1);

  const section1 = (
    <div className="form-section">
      <h3>Sección 1: Datos Generales</h3>
      <div className="form-row">
        <div className="form-group"><label>Email de contacto *</label><input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required placeholder="correo@institucion.com" /></div>
        <div className="form-group"><label>Fecha de revisión *</label><input type="date" value={formData.fechaRevision} onChange={(e) => handleInputChange('fechaRevision', e.target.value)} required /></div>
      </div>
      <div className="form-group"><label>Nombre del revisor *</label><input type="text" value={formData.nombreRevisor} onChange={(e) => handleInputChange('nombreRevisor', e.target.value)} required placeholder="Nombre completo del revisor" /></div>
      <div className="form-row">
        <div className="form-group"><label>Código UPGD *</label><input type="text" value={formData.codigoUPGD} onChange={(e) => handleInputChange('codigoUPGD', e.target.value)} required placeholder="76001_________" pattern="76001.*" /></div>
        <div className="form-group"><label>Nombre de la institución *</label><input type="text" value={formData.nombreInstitution} onChange={(e) => handleInputChange('nombreInstitution', e.target.value)} required placeholder="Nombre oficial de la institución" /></div>
      </div>
      <h4>Información del Gerente</h4>
      <div className="form-group"><label>Nombre del gerente *</label><input type="text" value={formData.nombreGerente} onChange={(e) => handleInputChange('nombreGerente', e.target.value)} required placeholder="Nombre completo del gerente" /></div>
      <div className="form-row">
        <div className="form-group"><label>Email del gerente *</label><input type="email" value={formData.emailGerente} onChange={(e) => handleInputChange('emailGerente', e.target.value)} required placeholder="gerente@institucion.com" /></div>
        <div className="form-group"><label>Celular del gerente *</label><input type="tel" value={formData.celularGerente} onChange={(e) => handleInputChange('celularGerente', e.target.value)} required placeholder="3001234567" /></div>
      </div>
    </div>
  );

  const section2 = (
    <div className="form-section">
      <h3>Sección 2: Información del Personal de Sistemas</h3>
      <div className="form-group"><label className="checkbox-label"><input type="checkbox" checked={formData.tieneSistemas} onChange={(e) => handleInputChange('tieneSistemas', e.target.checked)} />¿Cuenta con personal de sistemas?</label></div>
      {formData.tieneSistemas && (<>
        <div className="form-group"><label>Nombre del responsable de sistemas</label><input type="text" value={formData.nombreSistemas} onChange={(e) => handleInputChange('nombreSistemas', e.target.value)} placeholder="Nombre completo" /></div>
        <div className="form-row">
          <div className="form-group"><label>Email del responsable de sistemas</label><input type="email" value={formData.emailSistemas} onChange={(e) => handleInputChange('emailSistemas', e.target.value)} placeholder="sistemas@institucion.com" /></div>
          <div className="form-group"><label>Celular del responsable de sistemas</label><input type="tel" value={formData.celularSistemas} onChange={(e) => handleInputChange('celularSistemas', e.target.value)} placeholder="3001234567" /></div>
        </div>
      </>)}
    </div>
  );

  const section3 = (
    <div className="form-section">
      <h3>Sección 3: Comité de Infecciones</h3>
      <div className="form-group"><label className="checkbox-label"><input type="checkbox" checked={formData.tieneComiteInfecciones} onChange={(e) => handleInputChange('tieneComiteInfecciones', e.target.checked)} />¿Cuenta con Comité de Infecciones conformado?</label></div>
      {formData.tieneComiteInfecciones && (<>
        <div className="form-group"><label>Nombre del responsable del Comité de Infecciones</label><input type="text" value={formData.nombreComiteInfecciones} onChange={(e) => handleInputChange('nombreComiteInfecciones', e.target.value)} placeholder="Nombre completo" /></div>
        <div className="form-row">
          <div className="form-group"><label>Email del responsable del Comité</label><input type="email" value={formData.emailComiteInfecciones} onChange={(e) => handleInputChange('emailComiteInfecciones', e.target.value)} placeholder="comite@institucion.com" /></div>
          <div className="form-group"><label>Celular del responsable del Comité</label><input type="tel" value={formData.celularComiteInfecciones} onChange={(e) => handleInputChange('celularComiteInfecciones', e.target.value)} placeholder="3001234567" /></div>
        </div>
      </>)}
    </div>
  );

  const section4 = (
    <div className="form-section">
      <h3>Sección 4: Información del Personal Responsable del Sivigila</h3>
      <div className="form-group"><label>Nombre del responsable de Sivigila *</label><input type="text" value={formData.nombreSivigila} onChange={(e) => handleInputChange('nombreSivigila', e.target.value)} required placeholder="Nombre completo del responsable" /></div>
      <div className="form-row">
        <div className="form-group"><label>Email del responsable de Sivigila *</label><input type="email" value={formData.emailSivigila} onChange={(e) => handleInputChange('emailSivigila', e.target.value)} required placeholder="sivigila@institucion.com" /></div>
        <div className="form-group"><label>Celular del responsable de Sivigila *</label><input type="tel" value={formData.celularSivigila} onChange={(e) => handleInputChange('celularSivigila', e.target.value)} required placeholder="3001234567" /></div>
      </div>
    </div>
  );

  const sections = { 1: section1, 2: section2, 3: section3, 4: section4 };

  return (
    <div className="modal-overlay">
      <div className="directory-modal">
        <div className="modal-header"><h2>{entry ? 'Editar Institución' : 'Nueva Institución'}</h2><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="modal-body">
          <div className="section-progress">{[1,2,3,4].map(s => (<div key={s} className={`progress-step ${currentSection === s ? 'active' : ''} ${currentSection > s ? 'completed' : ''}`} onClick={() => setCurrentSection(s)}>{s}</div>))}</div>
          <form onSubmit={handleSubmit}>
            {sections[currentSection]}
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <div className="section-navigation">
                {currentSection > 1 && <button type="button" onClick={prevSection} className="btn-secondary">← Anterior</button>}
                {currentSection < 4 && <button type="button" onClick={nextSection} className="btn-secondary">Siguiente →</button>}
              </div>
              <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Guardando...' : (entry ? 'Actualizar' : 'Crear')}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
