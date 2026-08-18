import { useEffect, useState } from 'react';
import { api, type AIReport, type MedicationHistory, type Patient } from '../api';
import { PulseRing } from '../components/PulseRing';

interface CaretakerDashboardProps {
  patient?: Patient;
}

export const CaretakerDashboard: React.FC<CaretakerDashboardProps> = ({ patient }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [history, setHistory] = useState<MedicationHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!patient) return;
    // Reset state on patient change
    setReport(null);
    api.getAdherenceHistory({ patient_id: patient.id }).then(setHistory);
  }, [patient]);

  const handleGenerate = async () => {
    if (!patient) return;
    setIsGenerating(true);
    try {
      const newReport = await api.generateAIInsight({ patient_id: patient.id });
      setReport(newReport);
    } finally {
      setIsGenerating(false);
    }
  };

  const getAdherencePercentage = () => {
    if (history.length === 0) return 0;
    let total = 0;
    let taken = 0;
    history.forEach(h => {
      h.by_date.forEach(d => {
        if (d.status !== 'pending') {
          total++;
          if (d.status === 'taken') taken++;
        }
      });
    });
    return total === 0 ? 0 : Math.round((taken / total) * 100);
  };

  const adherence = getAdherencePercentage();

  if (!patient) return null;

  return (
    <div className="theme-caretaker" style={styles.container}>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <h2 style={styles.logo}>MedLoop</h2>
        </div>
        <div style={styles.patientInfo}>
          <span style={styles.patientName}>{patient.name}</span>
          <span style={styles.onlineBadge}>&#9900; online</span>
        </div>
      </header>

      {/* Patient Profile Context */}
      <div style={styles.profileSection}>
        <div style={styles.profileMeta}>
          {patient.age}-year-old {patient.gender}
        </div>
        <div style={styles.profileConditions}>
          {patient.conditions.join(' • ')}
        </div>
      </div>

      {/* AI Insight Card */}
      <div style={styles.insightCard}>
        <div style={styles.insightHeader}>
          <div style={styles.adherenceBadge}>
            <PulseRing 
              percentage={adherence} 
              status={isGenerating ? 'pending' : (report ? report.risk_level : 'pending')} 
              size={48} 
              strokeWidth={4} 
              isLoading={isGenerating}
              trackColor="var(--line-dark)"
            />
            <span className="font-tabular" style={styles.adherenceText}>{adherence}%</span>
          </div>
          
          {report && !isGenerating && (
            <div style={{
              ...styles.riskPill,
              backgroundColor: report.risk_level === 'high' ? 'var(--alert-soft)' : report.risk_level === 'moderate' ? 'rgba(184, 134, 59, 0.15)' : 'var(--pulse-soft)',
              color: report.risk_level === 'high' ? 'var(--alert)' : report.risk_level === 'moderate' ? 'var(--amber)' : 'var(--pulse)',
            }}>
              {report.risk_level.toUpperCase()} RISK
            </div>
          )}
        </div>

        <div style={styles.insightBody}>
          {isGenerating ? (
            <p className="font-display" style={{...styles.insightSentence, color: 'var(--text-muted)'}}>
              Analyzing this week's adherence patterns...
            </p>
          ) : report ? (
            <>
              <p className="font-display" style={styles.insightSentence}>
                "{report.summary}"
              </p>
              <p style={styles.suggestedAction}>
                Suggested: {report.suggested_action}
              </p>
            </>
          ) : (
            <p className="font-display" style={{...styles.insightSentence, color: 'var(--text-muted)'}}>
              No insight yet — tap Generate to check in.
            </p>
          )}
        </div>

        <div style={styles.insightFooter}>
          <button 
            style={styles.regenerateBtn} 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {report ? 'Regenerate' : 'Generate AI Insight'}
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={styles.timelineSection}>
        <h3 style={styles.sectionTitle}>This week</h3>
        
        <div style={styles.daysRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const dateStr = `2026-08-${12 + i}`;
            let dayStatus = 'pending';
            history.forEach(h => {
               const dayData = h.by_date.find(d => d.date === dateStr);
               if (dayData && dayData.status === 'missed') dayStatus = 'missed';
               if (dayData && dayData.status === 'taken' && dayStatus !== 'missed') dayStatus = 'taken';
            });

            return (
              <div key={day} style={styles.dayChip}>
                <span style={styles.dayLabel}>{day}</span>
                {dayStatus === 'taken' && <span style={{color: 'var(--pulse)', fontSize: '16px'}}>&#10003;</span>}
                {dayStatus === 'missed' && <span style={{color: 'var(--alert)', fontSize: '14px'}}>&#10005;</span>}
                {dayStatus === 'pending' && <span style={{color: 'var(--line-dark)'}}>-</span>}
              </div>
            );
          })}
        </div>

        <div style={styles.medList}>
          {history.map(med => {
            const total = med.taken_count! + med.missed_count!;
            return (
              <div key={med.medication_id} style={styles.medListItem}>
                <span style={styles.medListTitle}>{med.name}</span>
                <span className="font-tabular" style={styles.medListStats}>
                  {total > 0 ? `taken ${med.taken_count}/${total}` : 'no doses this week'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 20px',
    maxWidth: '500px',
    margin: '0 auto',
    paddingBottom: '80px', // Extra space for demo switcher
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
  },
  patientInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  patientName: {
    color: '#E4E0D8',
    fontWeight: 500,
  },
  onlineBadge: {
    color: 'var(--pulse)',
    fontSize: '13px',
  },
  profileSection: {
    marginBottom: '32px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  profileMeta: {
    fontSize: '13px',
    color: '#A1AAB0',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  profileConditions: {
    fontSize: '15px',
    color: '#E4E0D8',
    lineHeight: '1.4',
  },
  insightCard: {
    backgroundColor: '#20282C',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid var(--line-dark)',
    marginBottom: '40px',
  },
  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  adherenceBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  adherenceText: {
    fontSize: '24px',
    fontWeight: 600,
  },
  riskPill: {
    padding: '6px 12px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  insightBody: {
    marginBottom: '24px',
  },
  insightSentence: {
    fontSize: '22px',
    fontStyle: 'italic',
    lineHeight: '1.4',
    margin: '0 0 12px 0',
    color: '#F8F9FA',
  },
  suggestedAction: {
    fontSize: '15px',
    color: '#A1AAB0',
    margin: 0,
  },
  insightFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  regenerateBtn: {
    backgroundColor: 'transparent',
    color: 'var(--pulse)',
    fontSize: '14px',
    fontWeight: 600,
    padding: '8px 16px',
    border: '1px solid var(--pulse-soft)',
    borderRadius: '100px',
    borderColor: 'rgba(220, 235, 230, 0.2)',
  },
  timelineSection: {
    padding: '0 8px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#E4E0D8',
  },
  daysRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
  dayChip: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  dayLabel: {
    fontSize: '13px',
    color: '#A1AAB0',
  },
  medList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  medListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--line-dark)',
  },
  medListTitle: {
    fontSize: '15px',
    fontWeight: 500,
  },
  medListStats: {
    fontSize: '14px',
    color: '#A1AAB0',
  }
};
