import { useEffect, useState } from 'react';
import { api, type MedicationDose } from '../api';
import { PulseRing } from '../components/PulseRing';

export const PatientView: React.FC = () => {
  const [meds, setMeds] = useState<MedicationDose[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatingMeds, setAnimatingMeds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Clock
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch initial meds
    api.getTodaysMeds().then(data => setMeds(data));
  }, []);

  const handleTakeMed = async (medId: string) => {
    // 1. Trigger animation state
    setAnimatingMeds(prev => ({ ...prev, [medId]: true }));
    
    // 2. Optimistic update
    setMeds(prev => 
      prev.map(m => m.id === medId ? { ...m, status: 'taken' } : m)
    );

    // 3. Call API
    await api.markDose({ dose_log_id: medId, status: 'taken' });
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="theme-patient" style={styles.container}>
      
      {/* Huge Current Time */}
      <div style={styles.timeDisplay}>
        {formattedTime}
      </div>

      {/* Medication Cards */}
      <div style={styles.cardList}>
        {meds.filter(m => m.status === 'pending' || animatingMeds[m.id]).map(med => {
          
          const isTaken = med.status === 'taken';

          return (
            <div key={med.id} style={styles.card}>
              
              <div style={styles.cardHeader}>
                <PulseRing 
                  percentage={isTaken ? 100 : 85} 
                  status={isTaken ? 'low' : 'pending'} 
                  size={32} 
                  strokeWidth={3} 
                  trackColor="var(--line-light)"
                />
              </div>
              
              <h1 className="font-display" style={styles.medName}>
                {med.name}
              </h1>
              <p style={styles.medDetails}>
                {med.dosage} &middot; Due now
              </p>

              <button 
                onClick={() => handleTakeMed(med.id)}
                disabled={isTaken}
                style={{
                  ...styles.button,
                  ...(isTaken ? styles.buttonTaken : {})
                }}
              >
                {isTaken ? (
                  <span style={styles.checkIcon}>&#10003;</span>
                ) : (
                  'I TOOK IT'
                )}
              </button>

            </div>
          );
        })}

        {meds.filter(m => m.status === 'pending').length === 0 && Object.keys(animatingMeds).length === 0 && (
           <div style={{...styles.card, textAlign: 'center'}}>
             <p style={{...styles.medDetails, marginTop: 0}}>You're all caught up for now.</p>
           </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '40px 24px',
    minHeight: '100vh',
  },
  timeDisplay: {
    fontSize: '48px',
    fontWeight: 600,
    marginTop: '6vh',
    marginBottom: '8vh',
  },
  cardList: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--surface)',
    borderRadius: '24px',
    padding: '32px 24px',
    boxShadow: '0 8px 24px rgba(18, 24, 27, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    transition: 'all 0.3s ease-in-out',
  },
  cardHeader: {
    marginBottom: '16px',
  },
  medName: {
    fontSize: '36px',
    color: 'var(--ink)',
    marginBottom: '8px',
    fontWeight: 400,
  },
  medDetails: {
    fontSize: '20px',
    color: '#6B7280', // Slightly muted ink
    marginBottom: '32px',
  },
  button: {
    width: '100%',
    backgroundColor: 'var(--pulse)',
    color: 'var(--surface)',
    fontSize: '24px',
    fontWeight: 600,
    padding: '20px',
    borderRadius: '24px',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '68px', // large touch target
  },
  buttonTaken: {
    backgroundColor: 'var(--pulse-soft)',
    color: 'var(--pulse)',
  },
  checkIcon: {
    fontSize: '32px',
    animation: 'fill-checkmark 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
  }
};
