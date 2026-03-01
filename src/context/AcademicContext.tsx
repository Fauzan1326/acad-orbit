import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { AcademicConfig, TimetableRecord, Clash, TermParity } from '@/types/academic';
import { DEMO_RECORDS } from '@/data/demo-data';
import { ROOMS } from '@/data/lookups';

interface AcademicContextType {
  config: AcademicConfig;
  setConfig: (config: AcademicConfig) => void;
  masterRecords: TimetableRecord[];
  activeRecords: TimetableRecord[];
  clashes: Clash[];
  activeSemesters: number[];
  addRecord: (record: TimetableRecord) => void;
  deleteRecord: (id: string) => void;
}

const AcademicContext = createContext<AcademicContextType | null>(null);

export function useAcademic() {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error('useAcademic must be used within AcademicProvider');
  return ctx;
}

function getActiveSemesters(parity: TermParity): number[] {
  return parity === 'Odd' ? [3, 5, 7] : [4, 6, 8];
}

function detectClashes(records: TimetableRecord[]): Clash[] {
  const clashes: Clash[] = [];
  const active = records.filter(r => r.isActive);

  // Group by day+slot
  const groups = new Map<string, TimetableRecord[]>();
  active.forEach(r => {
    const key = `${r.day}-${r.slot}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  });

  groups.forEach((recs) => {
    if (recs.length < 2) return;

    // Teacher clashes
    const teacherMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => {
      if (!teacherMap.has(r.teacherCode)) teacherMap.set(r.teacherCode, []);
      teacherMap.get(r.teacherCode)!.push(r);
    });
    teacherMap.forEach((trecs, tc) => {
      if (trecs.length > 1) {
        clashes.push({
          type: 'Teacher',
          message: `Teacher T${String(tc).padStart(2, '0')} has ${trecs.length} classes at ${trecs[0].day} ${trecs[0].slot}`,
          records: trecs,
          severity: 'error',
        });
      }
    });

    // Room clashes
    const roomMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => {
      if (!roomMap.has(r.roomCode)) roomMap.set(r.roomCode, []);
      roomMap.get(r.roomCode)!.push(r);
    });
    roomMap.forEach((rrecs, rc) => {
      if (rrecs.length > 1) {
        clashes.push({
          type: 'Room',
          message: `Room R${rc} has ${rrecs.length} classes at ${rrecs[0].day} ${rrecs[0].slot}`,
          records: rrecs,
          severity: 'error',
        });
      }
    });

    // Semester clashes
    const semMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => {
      if (!semMap.has(r.semesterCode)) semMap.set(r.semesterCode, []);
      semMap.get(r.semesterCode)!.push(r);
    });
    semMap.forEach((srecs) => {
      if (srecs.length > 1) {
        clashes.push({
          type: 'Semester',
          message: `Semester ${srecs[0].semesterCode} has ${srecs.length} classes at ${srecs[0].day} ${srecs[0].slot}`,
          records: srecs,
          severity: 'error',
        });
      }
    });
  });

  // Room rule validation
  active.forEach(r => {
    const room = ROOMS.find(rm => rm.code === r.roomCode);
    if (!room) return;
    if (r.typeCode === 0 && room.type === 'Lab') {
      clashes.push({
        type: 'RoomRule',
        message: `Theory class in Lab: ${r.humanReadable}`,
        records: [r],
        severity: 'warning',
      });
    }
    if (r.typeCode === 1 && room.type === 'Classroom') {
      clashes.push({
        type: 'RoomRule',
        message: `Practical in Classroom: ${r.humanReadable}`,
        records: [r],
        severity: 'warning',
      });
    }
  });

  return clashes;
}

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AcademicConfig>({
    activeTerm: 'Odd',
    academicYear: '2025-26',
    startDate: '2025-07-01',
    endDate: '2025-12-15',
  });

  const [records, setRecords] = useState<TimetableRecord[]>(DEMO_RECORDS);

  const activeSemesters = useMemo(() => getActiveSemesters(config.activeTerm), [config.activeTerm]);

  const masterRecords = useMemo(() => {
    return records.map(r => ({
      ...r,
      isActive: activeSemesters.includes(r.semesterCode),
    }));
  }, [records, activeSemesters]);

  const activeRecords = useMemo(() => masterRecords.filter(r => r.isActive), [masterRecords]);

  const clashes = useMemo(() => detectClashes(masterRecords), [masterRecords]);

  const addRecord = useCallback((record: TimetableRecord) => {
    setRecords(prev => [...prev, record]);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <AcademicContext.Provider value={{
      config, setConfig, masterRecords, activeRecords, clashes,
      activeSemesters, addRecord, deleteRecord,
    }}>
      {children}
    </AcademicContext.Provider>
  );
}
