import { useState, useEffect } from 'react';
import { PatientView } from './views/PatientView';
import { CaretakerDashboard } from './views/CaretakerDashboard';
import { api, type Patient } from './api';

function App() {
  const [currentView, setCurrentView] = useState<'patient' | 'caretaker'>('caretaker');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p1');

  useEffect(() => {
    api.getPatients().then(data => {
      setPatients(data);
    });
  }, []);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatientId(e.target.value);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <>
      {currentView === 'patient' ? (
        <PatientView patientId={selectedPatientId} />
      ) : (
        <CaretakerDashboard patient={selectedPatient} />
      )}
      
      {/* Demo Controls - Fixed at bottom */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '12px',
        borderRadius: '16px',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }}>
        <button 
          onClick={() => setCurrentView(v => v === 'patient' ? 'caretaker' : 'patient')}
          style={{
            backgroundColor: 'var(--pulse)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          View: {currentView === 'patient' ? 'Patient' : 'Caretaker'}
        </button>

        {patients.length > 0 && (
          <select 
            value={selectedPatientId}
            onChange={handlePatientChange}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(0,0,0,0.4)',
              color: 'white',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {patients.map(p => (
              <option key={p.id} value={p.id} style={{ color: 'black' }}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </>
  );
}

export default App;
