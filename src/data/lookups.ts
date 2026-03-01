import type { LookupSemester, LookupSubject, LookupTeacher, LookupRoom } from '@/types/academic';

export const SEMESTERS: LookupSemester[] = [
  { code: 3, name: 'Semester III', parity: 'Odd' },
  { code: 4, name: 'Semester IV', parity: 'Even' },
  { code: 5, name: 'Semester V', parity: 'Odd' },
  { code: 6, name: 'Semester VI', parity: 'Even' },
  { code: 7, name: 'Semester VII', parity: 'Odd' },
  { code: 8, name: 'Semester VIII', parity: 'Even' },
];

export const SUBJECTS: LookupSubject[] = [
  { code: 1, name: 'Data Structures', shortName: 'DS' },
  { code: 2, name: 'Operating Systems', shortName: 'OS' },
  { code: 3, name: 'Computer Networks', shortName: 'CN' },
  { code: 4, name: 'Software Engineering', shortName: 'SE' },
  { code: 5, name: 'Database Management', shortName: 'DBMS' },
  { code: 6, name: 'Machine Learning', shortName: 'ML' },
  { code: 7, name: 'Web Technologies', shortName: 'WT' },
  { code: 8, name: 'Artificial Intelligence', shortName: 'AI' },
];

export const TEACHERS: LookupTeacher[] = [
  { code: 1, name: 'Dr. Anita Sharma', shortName: 'AS' },
  { code: 2, name: 'Prof. Rajesh Kumar', shortName: 'RK' },
  { code: 3, name: 'Dr. Priya Nair', shortName: 'PN' },
  { code: 4, name: 'Prof. Vikram Singh', shortName: 'VS' },
  { code: 5, name: 'Dr. Meena Iyer', shortName: 'MI' },
  { code: 6, name: 'Prof. Suresh Patel', shortName: 'SP' },
  { code: 7, name: 'Dr. Kavita Joshi', shortName: 'KJ' },
  { code: 8, name: 'Prof. Arun Desai', shortName: 'AD' },
  { code: 9, name: 'Dr. Neha Gupta', shortName: 'NG' },
  { code: 10, name: 'Prof. Deepak Rao', shortName: 'DR' },
];

export const ROOMS: LookupRoom[] = [
  { code: 1, name: 'CR-202', type: 'Classroom' },
  { code: 2, name: 'CR-203', type: 'Classroom' },
  { code: 3, name: 'LAB-1', type: 'Lab' },
  { code: 4, name: 'LAB-2', type: 'Lab' },
  { code: 5, name: 'LAB-3', type: 'Lab' },
  { code: 6, name: 'LAB-4', type: 'Lab' },
];

export const TYPE_NAMES: Record<number, string> = {
  0: 'Theory',
  1: 'Practical',
};
