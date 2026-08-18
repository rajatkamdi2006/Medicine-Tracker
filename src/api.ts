// src/api.ts

export type DoseStatus = 'pending' | 'taken' | 'missed';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface MedicationDose {
  id: string;
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

let mockTodaysMeds: MedicationDose[] = [
  { id: 'm1', name: 'Amlodipine', dosage: '10mg', scheduled_time: '14:45', status: 'pending' },
];

const mockHistory: MedicationHistory[] = [
  {
    medication_id: 'm1',
    name: 'Amlodipine',
    by_date: [
      { date: '2026-08-12', status: 'taken' },
      { date: '2026-08-13', status: 'taken' },
      { date: '2026-08-14', status: 'taken' },
      { date: '2026-08-15', status: 'taken' },
      { date: '2026-08-16', status: 'taken' },
      { date: '2026-08-17', status: 'missed' },
      { date: '2026-08-18', status: 'pending' },
    ]
  },
  {
    medication_id: 'm2',
    name: 'Metformin',
    by_date: [
      { date: '2026-08-12', status: 'taken' },
      { date: '2026-08-13', status: 'taken' },
      { date: '2026-08-14', status: 'taken' },
      { date: '2026-08-15', status: 'taken' },
      { date: '2026-08-16', status: 'taken' },
      { date: '2026-08-17', status: 'taken' },
      { date: '2026-08-18', status: 'taken' },
    ]
  }
];

const mockAIReport: AIReport = {
  risk_level: 'moderate',
  summary: 'Evening Sunday doses have been missed 3 of the last 4 weeks.',
  suggested_action: 'a Sunday evening reminder call.',
  confidence: 'high'
};

// ------------------------------------------------------------------
// API CONTRACT (Client)
// ------------------------------------------------------------------

export const api = {
  markDose: async ({ dose_log_id, status }: { dose_log_id: string; status: DoseStatus }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockTodaysMeds.findIndex(m => m.id === dose_log_id);
    if (index !== -1) {
      mockTodaysMeds[index] = { ...mockTodaysMeds[index], status };
      return { success: true, updated_log: mockTodaysMeds[index] };
    }
    return { success: false, error: 'Dose not found' };
  },

  getTodaysMeds: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTodaysMeds];
  },

  getAdherenceHistory: async (_params: { patient_id: string; start_date?: string; end_date?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Enrich with counts
    return mockHistory.map(history => {
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

  generateAIInsight: async (_params: { patient_id: string; period?: string }) => {
    // Simulate LLM delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockAIReport;
  }
};
