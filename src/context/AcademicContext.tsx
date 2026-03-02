import React, { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import type { TimetableRecord, Clash, TermParity, AcademicConfig } from '@/types/academic';
import {
  useSubjects, useTeachers, useRooms, useSemesters,
  useTimetableRecords, useAcademicConfig, useUpsertAcademicConfig,
  useUpsertTimetableRecord, useDeleteTimetableRecord,
  type DbSubject, type DbTeacher, type DbRoom, type DbSemester, type DbTimetableRecord,
} from '@/hooks/useDbData';
import { DEMO_RECORDS } from '@/data/demo-data';
import { SUBJECTS as STATIC_SUBJECTS, TEACHERS as STATIC_TEACHERS, ROOMS as STATIC_ROOMS, SEMESTERS as STATIC_SEMESTERS } from '@/data/lookups';

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

function getActiveSemesters(parity: TermParity, semesters: { code: number; parity: string }[]): number[] {
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

  groups.forEach((recs) => {
    if (recs.length < 2) return;
    // Teacher clashes
    const teacherMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => { if (!teacherMap.has(r.teacherCode)) teacherMap.set(r.teacherCode, []); teacherMap.get(r.teacherCode)!.push(r); });
    teacherMap.forEach((trecs, tc) => { if (trecs.length > 1) clashes.push({ type: 'Teacher', message: `Teacher T${String(tc).padStart(2, '0')} has ${trecs.length} classes at ${trecs[0].day} ${trecs[0].slot}`, records: trecs, severity: 'error' }); });
    // Room clashes
    const roomMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => { if (!roomMap.has(r.roomCode)) roomMap.set(r.roomCode, []); roomMap.get(r.roomCode)!.push(r); });
    roomMap.forEach((rrecs, rc) => { if (rrecs.length > 1) clashes.push({ type: 'Room', message: `Room R${rc} has ${rrecs.length} classes at ${rrecs[0].day} ${rrecs[0].slot}`, records: rrecs, severity: 'error' }); });
    // Semester clashes
    const semMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => { if (!semMap.has(r.semesterCode)) semMap.set(r.semesterCode, []); semMap.get(r.semesterCode)!.push(r); });
    semMap.forEach((srecs) => { if (srecs.length > 1) clashes.push({ type: 'Semester', message: `Semester ${srecs[0].semesterCode} has ${srecs.length} classes at ${srecs[0].day} ${srecs[0].slot}`, records: srecs, severity: 'error' }); });
  });

  // Room rule
  active.forEach(r => {
    const room = rooms.find(rm => rm.code === r.roomCode);
    if (!room) return;
    if (r.typeCode === 0 && room.type === 'Lab') clashes.push({ type: 'RoomRule', message: `Theory class in Lab: ${r.humanReadable}`, records: [r], severity: 'warning' });
    if (r.typeCode === 1 && room.type === 'Classroom') clashes.push({ type: 'RoomRule', message: `Practical in Classroom: ${r.humanReadable}`, records: [r], severity: 'warning' });
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

  // Use DB data if available, otherwise fallback to static
  const subjects = useMemo(() =>
    (dbSubjects && dbSubjects.length > 0) ? dbSubjects.map(s => ({ code: s.code, name: s.name, shortName: s.short_name }))
    : STATIC_SUBJECTS, [dbSubjects]);

  const teachers = useMemo(() =>
    (dbTeachers && dbTeachers.length > 0) ? dbTeachers.map(t => ({ code: t.code, name: t.name, shortName: t.short_name }))
    : STATIC_TEACHERS, [dbTeachers]);

  const rooms = useMemo(() =>
    (dbRooms && dbRooms.length > 0) ? dbRooms.map(r => ({ code: r.code, name: r.name, type: r.room_type }))
    : STATIC_ROOMS.map(r => ({ code: r.code, name: r.name, type: r.type })), [dbRooms]);

  const semesters = useMemo(() =>
    (dbSemesters && dbSemesters.length > 0) ? dbSemesters.map(s => ({ code: s.code, name: s.name, parity: s.parity }))
    : STATIC_SEMESTERS.map(s => ({ code: s.code, name: s.name, parity: s.parity })), [dbSemesters]);

  const config: AcademicConfig = useMemo(() => {
    if (dbConfig) return {
      activeTerm: dbConfig.active_term as TermParity,
      academicYear: dbConfig.academic_year,
      startDate: dbConfig.start_date || '',
      endDate: dbConfig.end_date || '',
    };
    return { activeTerm: 'Odd', academicYear: '2025-26', startDate: '2025-07-01', endDate: '2025-12-15' };
  }, [dbConfig]);

  const setConfig = useCallback((newConfig: AcademicConfig) => {
    upsertConfig.mutate({
      id: dbConfig?.id,
      active_term: newConfig.activeTerm,
      academic_year: newConfig.academicYear,
      start_date: newConfig.startDate || undefined,
      end_date: newConfig.endDate || undefined,
    });
  }, [dbConfig, upsertConfig]);

  const activeSemesters = useMemo(() => getActiveSemesters(config.activeTerm, semesters), [config.activeTerm, semesters]);

  // Build TimetableRecord objects from DB or static
  const masterRecords = useMemo(() => {
    const source: TimetableRecord[] = (dbRecords && dbRecords.length > 0) ? dbRecords.map(r => {
      const sub = subjects.find(s => s.code === r.subject_code);
      const teach = teachers.find(t => t.code === r.teacher_code);
      const room = rooms.find(rm => rm.code === r.room_code);
      const semParity = semesters.find(s => s.code === r.semester_code)?.parity || (r.semester_code % 2 === 1 ? 'Odd' : 'Even');
      const encodedId = `${String(r.semester_code).padStart(2, '0')}-${r.type_code}-${r.room_code}-${r.subject_code}-${String(r.teacher_code).padStart(2, '0')}`;
      const humanReadable = `Sem${r.semester_code} | ${r.type_code === 0 ? 'Theory' : 'Practical'} | ${room?.name || `R${r.room_code}`} | ${sub?.shortName || `S${r.subject_code}`} | ${teach?.shortName || `T${r.teacher_code}`}`;
      return {
        id: r.id, day: r.day as any, slot: r.slot as any,
        semesterCode: r.semester_code, typeCode: r.type_code as any,
        roomCode: r.room_code, subjectCode: r.subject_code,
        teacherCode: r.teacher_code, batch: r.batch, duration: r.duration,
        termParity: semParity as TermParity, isActive: false,
        encodedId, humanReadable, notes: r.notes || '',
      };
    }) : DEMO_RECORDS;

    return source.map(r => ({
      ...r,
      isActive: activeSemesters.includes(r.semesterCode),
    }));
  }, [dbRecords, subjects, teachers, rooms, semesters, activeSemesters]);

  const activeRecords = useMemo(() => masterRecords.filter(r => r.isActive), [masterRecords]);
  const clashes = useMemo(() => detectClashes(masterRecords, rooms), [masterRecords, rooms]);

  const addRecord = useCallback((record: TimetableRecord) => {
    upsertRecord.mutate({
      day: record.day, slot: record.slot, semester_code: record.semesterCode,
      type_code: record.typeCode, room_code: record.roomCode,
      subject_code: record.subjectCode, teacher_code: record.teacherCode,
      batch: record.batch, duration: record.duration, notes: record.notes,
    } as any);
  }, [upsertRecord]);

  const deleteRecord = useCallback((id: string) => {
    deleteRecordMut.mutate(id);
  }, [deleteRecordMut]);

  return (
    <AcademicContext.Provider value={{
      config, setConfig, masterRecords, activeRecords, clashes,
      activeSemesters, addRecord, deleteRecord,
      subjects, teachers, rooms, semesters, loading,
    }}>
      {children}
    </AcademicContext.Provider>
  );
}
