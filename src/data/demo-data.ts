import type { TimetableRecord, TypeCode, DayCode, SlotCode, TermParity } from '@/types/academic';
import { SUBJECTS, TEACHERS, ROOMS } from './lookups';

function generateEncodedId(sem: number, type: TypeCode, room: number, subject: number, teacher: number): string {
  return `${String(sem).padStart(2, '0')}-${type}-${room}-${subject}-${String(teacher).padStart(2, '0')}`;
}

function generateHumanReadable(sem: number, type: TypeCode, room: number, subject: number, teacher: number): string {
  const s = SUBJECTS.find(x => x.code === subject)?.shortName || `S${subject}`;
  const t = TEACHERS.find(x => x.code === teacher)?.shortName || `T${teacher}`;
  const r = ROOMS.find(x => x.code === room)?.name || `R${room}`;
  const tp = type === 0 ? 'Theory' : 'Practical';
  return `Sem${sem} | ${tp} | ${r} | ${s} | ${t}`;
}

function getParity(sem: number): TermParity {
  return sem % 2 === 1 ? 'Odd' : 'Even';
}

let idCounter = 0;
function makeRecord(
  day: DayCode, slot: SlotCode, sem: number, type: TypeCode,
  room: number, subject: number, teacher: number, batch: string,
  duration: number = 1, notes: string = ''
): TimetableRecord {
  idCounter++;
  return {
    id: `REC-${String(idCounter).padStart(4, '0')}`,
    day, slot, semesterCode: sem, typeCode: type,
    roomCode: room, subjectCode: subject, teacherCode: teacher,
    batch, duration, termParity: getParity(sem),
    isActive: false, // will be set by context
    encodedId: generateEncodedId(sem, type, room, subject, teacher),
    humanReadable: generateHumanReadable(sem, type, room, subject, teacher),
    notes,
  };
}

export const DEMO_RECORDS: TimetableRecord[] = [
  // === ODD SEMESTERS (3, 5, 7) ===
  // Sem 3
  makeRecord('Mon', 'P1', 3, 0, 1, 1, 1, 'A', 1),
  makeRecord('Mon', 'P2', 3, 0, 1, 2, 2, 'A', 1),
  makeRecord('Mon', 'P3', 3, 1, 3, 1, 1, 'A1', 2),
  makeRecord('Mon', 'P4', 3, 1, 3, 1, 1, 'A1', 2),
  makeRecord('Tue', 'P1', 3, 0, 1, 3, 3, 'A', 1),
  makeRecord('Tue', 'P2', 3, 0, 1, 4, 4, 'A', 1),
  makeRecord('Wed', 'P1', 3, 0, 2, 1, 1, 'A', 1),
  makeRecord('Wed', 'P2', 3, 0, 2, 2, 2, 'A', 1),
  makeRecord('Thu', 'P1', 3, 0, 1, 3, 3, 'A', 1),
  makeRecord('Thu', 'P3', 3, 1, 4, 2, 2, 'B1', 2),
  makeRecord('Thu', 'P4', 3, 1, 4, 2, 2, 'B1', 2),
  makeRecord('Fri', 'P1', 3, 0, 1, 4, 4, 'A', 1),
  makeRecord('Fri', 'P2', 3, 0, 2, 1, 1, 'A', 1),

  // Sem 5
  makeRecord('Mon', 'P1', 5, 0, 2, 5, 5, 'A', 1),
  makeRecord('Mon', 'P2', 5, 0, 2, 6, 6, 'A', 1),
  makeRecord('Mon', 'P5', 5, 1, 5, 5, 5, 'A1', 2),
  makeRecord('Mon', 'P6', 5, 1, 5, 5, 5, 'A1', 2),
  makeRecord('Tue', 'P1', 5, 0, 2, 7, 7, 'A', 1),
  makeRecord('Tue', 'P2', 5, 0, 2, 8, 8, 'A', 1),
  makeRecord('Tue', 'P3', 5, 1, 6, 6, 6, 'B1', 2),
  makeRecord('Tue', 'P4', 5, 1, 6, 6, 6, 'B1', 2),
  makeRecord('Wed', 'P1', 5, 0, 1, 5, 5, 'A', 1),
  makeRecord('Wed', 'P2', 5, 0, 1, 6, 6, 'A', 1),
  makeRecord('Thu', 'P1', 5, 0, 2, 7, 7, 'A', 1),
  makeRecord('Thu', 'P2', 5, 0, 2, 8, 8, 'A', 1),
  makeRecord('Fri', 'P1', 5, 0, 1, 5, 5, 'A', 1),
  makeRecord('Fri', 'P2', 5, 0, 1, 7, 7, 'A', 1),

  // Sem 7
  makeRecord('Mon', 'P3', 7, 0, 1, 8, 9, 'A', 1),
  makeRecord('Mon', 'P4', 7, 0, 1, 6, 10, 'A', 1),
  makeRecord('Tue', 'P5', 7, 0, 2, 8, 9, 'A', 1),
  makeRecord('Tue', 'P6', 7, 0, 2, 6, 10, 'A', 1),
  makeRecord('Wed', 'P3', 7, 1, 3, 8, 9, 'A1', 2),
  makeRecord('Wed', 'P4', 7, 1, 3, 8, 9, 'A1', 2),
  makeRecord('Thu', 'P5', 7, 0, 1, 6, 10, 'A', 1),
  makeRecord('Fri', 'P3', 7, 0, 2, 8, 9, 'A', 1),

  // === EVEN SEMESTERS (4, 6, 8) ===
  // Sem 4
  makeRecord('Mon', 'P1', 4, 0, 1, 3, 3, 'A', 1),
  makeRecord('Mon', 'P2', 4, 0, 1, 4, 4, 'A', 1),
  makeRecord('Mon', 'P3', 4, 1, 4, 3, 3, 'A1', 2),
  makeRecord('Mon', 'P4', 4, 1, 4, 3, 3, 'A1', 2),
  makeRecord('Tue', 'P1', 4, 0, 2, 1, 1, 'A', 1),
  makeRecord('Tue', 'P2', 4, 0, 2, 2, 2, 'A', 1),
  makeRecord('Wed', 'P1', 4, 0, 1, 3, 3, 'A', 1),
  makeRecord('Thu', 'P1', 4, 0, 1, 4, 4, 'A', 1),
  makeRecord('Fri', 'P1', 4, 0, 2, 1, 1, 'A', 1),

  // Sem 6
  makeRecord('Mon', 'P5', 6, 0, 2, 7, 7, 'A', 1),
  makeRecord('Mon', 'P6', 6, 0, 2, 8, 8, 'A', 1),
  makeRecord('Tue', 'P3', 6, 0, 1, 5, 5, 'A', 1),
  makeRecord('Tue', 'P4', 6, 0, 1, 7, 7, 'A', 1),
  makeRecord('Wed', 'P3', 6, 1, 5, 7, 7, 'A1', 2),
  makeRecord('Wed', 'P4', 6, 1, 5, 7, 7, 'A1', 2),
  makeRecord('Thu', 'P3', 6, 0, 2, 5, 5, 'A', 1),
  makeRecord('Fri', 'P3', 6, 0, 1, 8, 8, 'A', 1),

  // Sem 8
  makeRecord('Tue', 'P5', 8, 0, 1, 6, 6, 'A', 1),
  makeRecord('Tue', 'P6', 8, 0, 1, 8, 9, 'A', 1),
  makeRecord('Wed', 'P5', 8, 1, 6, 6, 6, 'A1', 2),
  makeRecord('Wed', 'P6', 8, 1, 6, 6, 6, 'A1', 2),
  makeRecord('Thu', 'P5', 8, 0, 2, 8, 9, 'A', 1),

  // === INTENTIONAL CLASHES ===
  // Teacher clash: Teacher 1 in Sem3 Mon P1 AND another record
  makeRecord('Mon', 'P1', 5, 0, 2, 3, 1, 'B', 1, 'INTENTIONAL CLASH: Teacher Dr. Anita Sharma double-booked'),
  // Room clash: Room 1 used by Sem3 AND Sem5 on Wed P1
  // Already exists: Sem3 Wed P1 Room 2, Sem5 Wed P1 Room 1 - let's add a direct clash
  makeRecord('Wed', 'P1', 7, 0, 1, 7, 10, 'A', 1, 'INTENTIONAL CLASH: CR-202 double-booked'),
  // Room rule violation: Theory in Lab
  makeRecord('Fri', 'P5', 5, 0, 3, 6, 6, 'A', 1, 'INTENTIONAL CLASH: Theory scheduled in Lab'),
];
