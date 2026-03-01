export type TermParity = 'Odd' | 'Even';
export type DayCode = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
export type SlotCode = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export type TypeCode = 0 | 1; // 0=Theory, 1=Practical

export interface AcademicConfig {
  activeTerm: TermParity;
  academicYear: string;
  startDate: string;
  endDate: string;
}

export interface TimetableRecord {
  id: string;
  day: DayCode;
  slot: SlotCode;
  semesterCode: number; // 3-8
  typeCode: TypeCode;
  roomCode: number; // 1-6
  subjectCode: number; // 1-8
  teacherCode: number; // 1-10
  batch: string;
  duration: number;
  termParity: TermParity;
  isActive: boolean;
  encodedId: string;
  humanReadable: string;
  notes: string;
}

export interface LookupSemester {
  code: number;
  name: string;
  parity: TermParity;
}

export interface LookupSubject {
  code: number;
  name: string;
  shortName: string;
}

export interface LookupTeacher {
  code: number;
  name: string;
  shortName: string;
}

export interface LookupRoom {
  code: number;
  name: string;
  type: 'Classroom' | 'Lab';
}

export interface Clash {
  type: 'Teacher' | 'Room' | 'Semester' | 'RoomRule' | 'ConsecutivePractical';
  message: string;
  records: TimetableRecord[];
  severity: 'error' | 'warning';
}

export const DAYS: DayCode[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const SLOTS: SlotCode[] = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
export const SLOT_TIMES: Record<SlotCode, string> = {
  P1: '9:00 - 10:00',
  P2: '10:00 - 11:00',
  P3: '11:15 - 12:15',
  P4: '12:15 - 1:15',
  P5: '2:00 - 3:00',
  P6: '3:00 - 4:00',
};
