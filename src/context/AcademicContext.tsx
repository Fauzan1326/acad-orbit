import React, { createContext, useContext, useMemo, useCallback } from 'react';
import type { TimetableRecord, Clash, TermParity, AcademicConfig } from '@/types/academic';
import {
  useSubjects, useTeachers, useRooms, useSemesters, useSlots,
  useTimetableRecords, useAcademicConfig, useUpsertAcademicConfig,
  useUpsertTimetableRecord, useDeleteTimetableRecord,
<<<<<<< HEAD
} from '@/hooks/useDbData';
import { DEMO_RECORDS } from '@/data/demo-data';
import {
  SUBJECTS as STATIC_SUBJECTS,
  TEACHERS as STATIC_TEACHERS,
  ROOMS as STATIC_ROOMS,
  SEMESTERS as STATIC_SEMESTERS
} from '@/data/lookups';
=======
  type DbSubject, type DbTeacher, type DbRoom, type DbSemester, type DbTimetableRecord, type DbSlot,
} from '@/hooks/useDbData';

interface SlotInfo {
  code: string;
  label: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
}
>>>>>>> 442a293e6b2e49e25fb342c4c5c7b2664d924c1b

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
  slots: SlotInfo[];
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
<<<<<<< HEAD

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
=======
    const teacherMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => { if (!teacherMap.has(r.teacherCode)) teacherMap.set(r.teacherCode, []); teacherMap.get(r.teacherCode)!.push(r); });
    teacherMap.forEach((trecs, tc) => { if (trecs.length > 1) clashes.push({ type: 'Teacher', message: `Teacher T${String(tc).padStart(2, '0')} has ${trecs.length} classes at ${trecs[0].day} ${trecs[0].slot}`, records: trecs, severity: 'error' }); });
    const roomMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => { if (!roomMap.has(r.roomCode)) roomMap.set(r.roomCode, []); roomMap.get(r.roomCode)!.push(r); });
    roomMap.forEach((rrecs, rc) => { if (rrecs.length > 1) clashes.push({ type: 'Room', message: `Room R${rc} has ${rrecs.length} classes at ${rrecs[0].day} ${rrecs[0].slot}`, records: rrecs, severity: 'error' }); });
    const semMap = new Map<number, TimetableRecord[]>();
    recs.forEach(r => { if (!semMap.has(r.semesterCode)) semMap.set(r.semesterCode, []); semMap.get(r.semesterCode)!.push(r); });
    semMap.forEach((srecs) => { if (srecs.length > 1) clashes.push({ type: 'Semester', message: `Semester ${srecs[0].semesterCode} has ${srecs.length} classes at ${srecs[0].day} ${srecs[0].slot}`, records: srecs, severity: 'error' }); });
  });

  active.forEach(r => {
    const room = rooms.find(rm => rm.code === r.roomCode);
    if (!room) return;
    if (r.typeCode === 0 && room.type === 'Lab') clashes.push({ type: 'RoomRule', message: `Theory class in Lab: ${r.humanReadable}`, records: [r], severity: 'warning' });
    if (r.typeCode === 1 && room.type === 'Classroom') clashes.push({ type: 'RoomRule', message: `Practical in Classroom: ${r.humanReadable}`, records: [r], severity: 'warning' });
>>>>>>> 442a293e6b2e49e25fb342c4c5c7b2664d924c1b
  });

  return clashes;
}

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { data: dbSubjects, isLoading: loadingSub } = useSubjects();
  const { data: dbTeachers, isLoading: loadingTeach } = useTeachers();
  const { data: dbRooms, isLoading: loadingRoom } = useRooms();
  const { data: dbSemesters, isLoading: loadingSem } = useSemesters();
  const { data: dbSlots, isLoading: loadingSlots } = useSlots();
  const { data: dbRecords, isLoading: loadingRec } = useTimetableRecords();
  const { data: dbConfig, isLoading: loadingConf } = useAcademicConfig();

  const upsertConfig = useUpsertAcademicConfig();
  const upsertRecord = useUpsertTimetableRecord();
  const deleteRecordMut = useDeleteTimetableRecord();

  const loading = loadingSub || loadingTeach || loadingRoom || loadingSem || loadingSlots || loadingRec || loadingConf;

<<<<<<< HEAD
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
=======
  const subjects = useMemo(() =>
    (dbSubjects || []).map(s => ({ code: s.code, name: s.name, shortName: s.short_name })), [dbSubjects]);

  const teachers = useMemo(() =>
    (dbTeachers || []).map(t => ({ code: t.code, name: t.name, shortName: t.short_name })), [dbTeachers]);

  const rooms = useMemo(() =>
    (dbRooms || []).map(r => ({ code: r.code, name: r.name, type: r.room_type })), [dbRooms]);

  const semesters = useMemo(() =>
    (dbSemesters || []).map(s => ({ code: s.code, name: s.name, parity: s.parity })), [dbSemesters]);

  const slots: SlotInfo[] = useMemo(() =>
    (dbSlots || []).map(s => ({ code: s.code, label: s.label, startTime: s.start_time, endTime: s.end_time, sortOrder: s.sort_order })), [dbSlots]);
>>>>>>> 442a293e6b2e49e25fb342c4c5c7b2664d924c1b

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
<<<<<<< HEAD
    const source = dbRecords?.length ? dbRecords : DEMO_RECORDS;
=======
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
    }) : [];
>>>>>>> 442a293e6b2e49e25fb342c4c5c7b2664d924c1b

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
<<<<<<< HEAD
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
=======
      config, setConfig, masterRecords, activeRecords, clashes,
      activeSemesters, addRecord, deleteRecord,
      subjects, teachers, rooms, semesters, slots, loading,
>>>>>>> 442a293e6b2e49e25fb342c4c5c7b2664d924c1b
    }}>
      {children}
    </AcademicContext.Provider>
  );
}