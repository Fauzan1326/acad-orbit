import React, { createContext, useContext, useMemo, useCallback } from 'react';
import type { TimetableRecord, Clash, TermParity, AcademicConfig } from '@/types/academic';
import {
  useSubjects, useTeachers, useRooms, useSemesters,
  useTimetableRecords, useAcademicConfig, useUpsertAcademicConfig,
  useUpsertTimetableRecord, useDeleteTimetableRecord,
} from '@/hooks/useDbData';
import { DEMO_RECORDS } from '@/data/demo-data';
import {
  SUBJECTS as STATIC_SUBJECTS,
  TEACHERS as STATIC_TEACHERS,
  ROOMS as STATIC_ROOMS,
  SEMESTERS as STATIC_SEMESTERS
} from '@/data/lookups';

interface AcademicContextType {
  config: AcademicConfig;
  setConfig: (config: AcademicConfig) => void;
  masterRecords: TimetableRecord[];
  activeRecords: TimetableRecord[];
  clashes: Clash[];
  activeSemesters: number[];
  addRecord: (record: TimetableRecord) => void;
  deleteRecord: (id: string) => void;
  subjects: { code: number; name: string; shortName: string }[];
  teachers: { code: number; name: string; shortName: string }[];
  rooms: { code: number; name: string; type: string }[];
  semesters: { code: number; name: string; parity: string }[];
  loading: boolean;
}

const AcademicContext = createContext<AcademicContextType | null>(null);

export function useAcademic() {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error('useAcademic must be used within AcademicProvider');
  return ctx;
}

function getActiveSemesters(
  parity: TermParity,
  semesters: { code: number; parity: string }[]
): number[] {
  return semesters.filter(s => s.parity === parity).map(s => s.code);
}

function detectClashes(records: TimetableRecord[], rooms: { code: number; type: string }[]): Clash[] {
  const clashes: Clash[] = [];
  const active = records.filter(r => r.isActive);
  const groups = new Map<string, TimetableRecord[]>();

  active.forEach(r => {
    const key = `${r.day}-${r.slot}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  });

  groups.forEach(recs => {
    if (recs.length < 2) return;

    const teacherMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => {
      if (!teacherMap.has(r.teacherCode)) teacherMap.set(r.teacherCode, []);
      teacherMap.get(r.teacherCode)!.push(r);
    });
    teacherMap.forEach((t, tc) => {
      if (t.length > 1)
        clashes.push({
          type: 'Teacher',
          message: `Teacher T${String(tc).padStart(2, '0')} has ${t.length} classes at ${t[0].day} ${t[0].slot}`,
          records: t,
          severity: 'error'
        });
    });

    const roomMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => {
      if (!roomMap.has(r.roomCode)) roomMap.set(r.roomCode, []);
      roomMap.get(r.roomCode)!.push(r);
    });
    roomMap.forEach((r, rc) => {
      if (r.length > 1)
        clashes.push({
          type: 'Room',
          message: `Room R${rc} has ${r.length} classes at ${r[0].day} ${r[0].slot}`,
          records: r,
          severity: 'error'
        });
    });

    const semMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => {
      if (!semMap.has(r.semesterCode)) semMap.set(r.semesterCode, []);
      semMap.get(r.semesterCode)!.push(r);
    });
    semMap.forEach(s => {
      if (s.length > 1)
        clashes.push({
          type: 'Semester',
          message: `Semester ${s[0].semesterCode} has ${s.length} classes at ${s[0].day} ${s[0].slot}`,
          records: s,
          severity: 'error'
        });
    });
  });

  return clashes;
}

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { data: dbSubjects, isLoading: loadingSub } = useSubjects();
  const { data: dbTeachers, isLoading: loadingTeach } = useTeachers();
  const { data: dbRooms, isLoading: loadingRoom } = useRooms();
  const { data: dbSemesters, isLoading: loadingSem } = useSemesters();
  const { data: dbRecords, isLoading: loadingRec } = useTimetableRecords();
  const { data: dbConfig, isLoading: loadingConf } = useAcademicConfig();

  const upsertConfig = useUpsertAcademicConfig();
  const upsertRecord = useUpsertTimetableRecord();
  const deleteRecordMut = useDeleteTimetableRecord();

  const loading = loadingSub || loadingTeach || loadingRoom || loadingSem || loadingRec || loadingConf;

  // 🇮🇳 GLOBAL INDIA TIME
  const indiaTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const currentMonth = indiaTime.getMonth() + 1;
  const currentDate = indiaTime.toISOString();

  const isCurrentMonth = (recordMonth: number) =>
    recordMonth === currentMonth;

  const subjects = useMemo(() =>
    dbSubjects?.length ? dbSubjects.map(s => ({ code: s.code, name: s.name, shortName: s.short_name })) : STATIC_SUBJECTS,
    [dbSubjects]
  );

  const teachers = useMemo(() =>
    dbTeachers?.length ? dbTeachers.map(t => ({ code: t.code, name: t.name, shortName: t.short_name })) : STATIC_TEACHERS,
    [dbTeachers]
  );

  const rooms = useMemo(() =>
    dbRooms?.length
      ? dbRooms.map(r => ({ code: r.code, name: r.name, type: r.room_type }))
      : STATIC_ROOMS.map(r => ({ code: r.code, name: r.name, type: r.type })),
    [dbRooms]
  );

  const semesters = useMemo(() =>
    dbSemesters?.length
      ? dbSemesters.map(s => ({ code: s.code, name: s.name, parity: s.parity }))
      : STATIC_SEMESTERS.map(s => ({ code: s.code, name: s.name, parity: s.parity })),
    [dbSemesters]
  );

  // ✅ TERM BASED ON MONTH
  const config: AcademicConfig = useMemo(() => {
    const activeTerm: TermParity = currentMonth >= 6 ? 'Odd' : 'Even';

    const year = indiaTime.getFullYear();
    const academicYear =
      currentMonth >= 6
        ? `${year}-${(year + 1).toString().slice(-2)}`
        : `${year - 1}-${year.toString().slice(-2)}`;

    if (dbConfig) {
      return {
        activeTerm,
        academicYear,
        startDate: dbConfig.start_date || '',
        endDate: dbConfig.end_date || '',
      };
    }

    return {
      activeTerm,
      academicYear,
      startDate: '',
      endDate: '',
    };
  }, [dbConfig, currentMonth]);

  const setConfig = useCallback((newConfig: AcademicConfig) => {
    upsertConfig.mutate({
      id: dbConfig?.id,
      active_term: newConfig.activeTerm,
      academic_year: newConfig.academicYear,
      start_date: newConfig.startDate || undefined,
      end_date: newConfig.endDate || undefined,
    });
  }, [dbConfig, upsertConfig]);

  const activeSemesters = useMemo(
    () => getActiveSemesters(config.activeTerm, semesters),
    [config.activeTerm, semesters]
  );

  const masterRecords = useMemo(() => {
    const source = dbRecords?.length ? dbRecords : DEMO_RECORDS;

    return source.map((r: any) => ({
      ...r,
      semesterCode: r.semester_code || r.semesterCode,
      isActive: activeSemesters.includes(r.semester_code || r.semesterCode),
    }));
  }, [dbRecords, activeSemesters]);

  const activeRecords = useMemo(() => masterRecords.filter(r => r.isActive), [masterRecords]);
  const clashes = useMemo(() => detectClashes(masterRecords as any, rooms), [masterRecords, rooms]);

  return (
    <AcademicContext.Provider value={{
      config,
      setConfig,
      masterRecords,
      activeRecords,
      clashes,
      activeSemesters,
      addRecord: () => {},
      deleteRecord: () => {},
      subjects,
      teachers,
      rooms,
      semesters,
      loading,
    }}>
      {children}
    </AcademicContext.Provider>
  );
}