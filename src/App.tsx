import { useState } from 'react';
import { PatientView } from './views/PatientView';
import { CaretakerDashboard } from './views/CaretakerDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'patient' | 'caretaker'>('patient');

  return (
    <>
      {currentView === 'patient' ? <PatientView /> : <CaretakerDashboard />}
      
      {/* Demo Switcher - Fixed at bottom left */}
      <button 
        onClick={() => setCurrentView(v => v === 'patient' ? 'caretaker' : 'patient')}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '100px',
          fontSize: '12px',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
      >
        Switch to {currentView === 'patient' ? 'Caretaker' : 'Patient'} View
      </button>
    </>
  );
}

export default App;
