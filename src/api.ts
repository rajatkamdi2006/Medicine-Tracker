// src/api.ts

export type DoseStatus = 'pending' | 'taken' | 'missed';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Patient {
  id: string;
  name: string;
  full_name?: string;
  role?: string;
  age: number;
  gender: 'male' | 'female';
  conditions: string[];
}

export interface MedicationDose {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  scheduled_time: string;
  status: DoseStatus;
}

export interface AdherenceDay {
  date: string;
  status: DoseStatus;
}

export interface MedicationHistory {
  medication_id: string;
  patient_id: string;
  name: string;
  by_date: AdherenceDay[];
  taken_count?: number;
  missed_count?: number;
}

export interface AIReport {
  risk_level: RiskLevel;
  summary: string;
  suggested_action: string;
  confidence: ConfidenceLevel;
}

// ------------------------------------------------------------------
// MOCK DATA
// ------------------------------------------------------------------

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'Aarav Sharma', age: 74, gender: 'male', conditions: ['Type 2 Diabetes Mellitus', 'Hypertension'] },
  { id: 'p2', name: 'Meera Joshi', age: 81, gender: 'female', conditions: ['Osteoarthritis', 'Primary Hypertension'] },
  { id: 'p3', name: 'Ramesh Patil', age: 68, gender: 'male', conditions: ['Hyperlipidemia', 'Coronary Artery Disease'] },
  { id: 'p4', name: 'Kanta Deshmukh', age: 79, gender: 'female', conditions: ['Hypothyroidism', 'Age-Related Osteoporosis'] },
];

let mockTodaysMeds: MedicationDose[] = [
  // Aarav
  { id: 'a1', patient_id: 'p1', name: 'Metformin', dosage: '500 mg', scheduled_time: '08:00', status: 'taken' },
  { id: 'a2', patient_id: 'p1', name: 'Metformin', dosage: '500 mg', scheduled_time: '20:00', status: 'pending' },
  { id: 'a3', patient_id: 'p1', name: 'Glimepiride', dosage: '1 mg', scheduled_time: '08:00', status: 'taken' },
  { id: 'a4', patient_id: 'p1', name: 'Telmisartan', dosage: '40 mg', scheduled_time: '08:00', status: 'taken' },
  { id: 'a5', patient_id: 'p1', name: 'Aspirin', dosage: '75 mg', scheduled_time: '12:00', status: 'pending' },
  
  // Meera
  { id: 'm1', patient_id: 'p2', name: 'Omeprazole', dosage: '20 mg', scheduled_time: '07:00', status: 'taken' },
  { id: 'm2', patient_id: 'p2', name: 'Amlodipine', dosage: '5 mg', scheduled_time: '08:00', status: 'taken' },
  { id: 'm3', patient_id: 'p2', name: 'Calcium + Vitamin D3', dosage: 'Supplement', scheduled_time: '08:00', status: 'pending' },
  { id: 'm4', patient_id: 'p2', name: 'Paracetamol', dosage: '650 mg', scheduled_time: 'As needed', status: 'pending' },
  
  // Ramesh
  { id: 'r1', patient_id: 'p3', name: 'Pantoprazole', dosage: '40 mg', scheduled_time: '07:00', status: 'taken' },
  { id: 'r2', patient_id: 'p3', name: 'Clopidogrel', dosage: '75 mg', scheduled_time: '08:00', status: 'missed' },
  { id: 'r3', patient_id: 'p3', name: 'Metoprolol succinate', dosage: '50 mg', scheduled_time: '08:00', status: 'taken' },
  { id: 'r4', patient_id: 'p3', name: 'Atorvastatin', dosage: '40 mg', scheduled_time: '21:00', status: 'pending' },
  
  // Kanta
  { id: 'k1', patient_id: 'p4', name: 'Levothyroxine', dosage: '50 mcg', scheduled_time: '06:00', status: 'taken' },
  { id: 'k2', patient_id: 'p4', name: 'Alendronate', dosage: '70 mg', scheduled_time: '07:00', status: 'missed' },
  { id: 'k3', patient_id: 'p4', name: 'Cholecalciferol', dosage: '60,000 IU', scheduled_time: '08:00', status: 'missed' },
];

// Helper to generate week data
const generateWeek = (statuses: DoseStatus[]): AdherenceDay[] => {
  return statuses.map((status, i) => ({
    date: `2026-08-${12 + i}`,
    status
  }));
};

const mockHistory: MedicationHistory[] = [
  // Aarav (Good adherence)
  { medication_id: 'a1', patient_id: 'p1', name: 'Metformin', by_date: generateWeek(['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'a3', patient_id: 'p1', name: 'Glimepiride', by_date: generateWeek(['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'a4', patient_id: 'p1', name: 'Telmisartan', by_date: generateWeek(['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'a5', patient_id: 'p1', name: 'Aspirin', by_date: generateWeek(['taken', 'missed', 'taken', 'taken', 'taken', 'taken', 'pending']) },
  
  // Meera (Moderate adherence, missed some evening/supplement doses)
  { medication_id: 'm1', patient_id: 'p2', name: 'Omeprazole', by_date: generateWeek(['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'm2', patient_id: 'p2', name: 'Amlodipine', by_date: generateWeek(['taken', 'taken', 'taken', 'missed', 'taken', 'taken', 'taken']) },
  { medication_id: 'm3', patient_id: 'p2', name: 'Calcium + Vit D3', by_date: generateWeek(['taken', 'missed', 'missed', 'taken', 'missed', 'taken', 'pending']) },
  
  // Ramesh (High risk - missed critical CAD meds)
  { medication_id: 'r1', patient_id: 'p3', name: 'Pantoprazole', by_date: generateWeek(['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'r2', patient_id: 'p3', name: 'Clopidogrel', by_date: generateWeek(['taken', 'missed', 'missed', 'taken', 'missed', 'missed', 'missed']) },
  { medication_id: 'r3', patient_id: 'p3', name: 'Metoprolol', by_date: generateWeek(['taken', 'taken', 'missed', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'r4', patient_id: 'p3', name: 'Atorvastatin', by_date: generateWeek(['missed', 'taken', 'missed', 'missed', 'taken', 'missed', 'pending']) },
  
  // Kanta (High risk - missing weekly osteo doses)
  { medication_id: 'k1', patient_id: 'p4', name: 'Levothyroxine', by_date: generateWeek(['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken']) },
  { medication_id: 'k2', patient_id: 'p4', name: 'Alendronate (Weekly)', by_date: generateWeek(['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'missed']) },
  { medication_id: 'k3', patient_id: 'p4', name: 'Cholecalciferol (Weekly)', by_date: generateWeek(['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'missed']) },
];

const mockAIReports: Record<string, AIReport> = {
  'p1': {
    risk_level: 'low',
    summary: 'Aarav is consistently taking his diabetes and blood pressure medications.',
    suggested_action: 'None required. Keep up the good routine.',
    confidence: 'high'
  },
  'p2': {
    risk_level: 'moderate',
    summary: 'Meera is missing her Calcium + Vitamin D3 supplements intermittently.',
    suggested_action: 'A gentle reminder to take supplements with lunch.',
    confidence: 'high'
  },
  'p3': {
    risk_level: 'high',
    summary: 'Ramesh has missed multiple critical doses of Clopidogrel and Atorvastatin this week.',
    suggested_action: 'Immediate phone call to verify medication stock and routine.',
    confidence: 'high'
  },
  'p4': {
    risk_level: 'high',
    summary: 'Kanta appears to have missed her critical weekly Sunday osteoporosis medications.',
    suggested_action: 'Call Kanta today to ensure she takes her weekly doses.',
    confidence: 'high'
  }
};

// ------------------------------------------------------------------
// API CONTRACT (Client)
// ------------------------------------------------------------------

export const api = {
  getPatients: async () => {
    return [...mockPatients];
  },

  markDose: async ({ dose_log_id, status }: { dose_log_id: string; status: DoseStatus }) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockTodaysMeds.findIndex(m => m.id === dose_log_id);
    if (index !== -1) {
      mockTodaysMeds[index] = { ...mockTodaysMeds[index], status };
      return { success: true, updated_log: mockTodaysMeds[index] };
    }
    return { success: false, error: 'Dose not found' };
  },

  getTodaysMeds: async (patient_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTodaysMeds.filter(m => m.patient_id === patient_id);
  },

  getAdherenceHistory: async ({ patient_id }: { patient_id: string; _start_date?: string; _end_date?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const patientHistory = mockHistory.filter(h => h.patient_id === patient_id);
    
    return patientHistory.map(history => {
      let taken_count = 0;
      let missed_count = 0;
      history.by_date.forEach(d => {
        if (d.status === 'taken') taken_count++;
        if (d.status === 'missed') missed_count++;
      });
      return {
        ...history,
        taken_count,
        missed_count
      };
    });
  },

  generateAIInsight: async ({ patient_id }: { patient_id: string; _period?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockAIReports[patient_id] || mockAIReports['p1'];
  }
};
