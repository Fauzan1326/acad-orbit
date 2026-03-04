import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Generic types for our lookup tables
export interface DbSubject { id: string; code: number; name: string; short_name: string; user_id: string; }
export interface DbTeacher { id: string; code: number; name: string; short_name: string; user_id: string; }
export interface DbRoom { id: string; code: number; name: string; room_type: string; user_id: string; }
export interface DbSemester { id: string; code: number; name: string; parity: string; user_id: string; }
export interface DbSlot { id: string; code: string; label: string; start_time: string; end_time: string; sort_order: number; user_id: string; }
export interface DbTimetableRecord {
  id: string; day: string; slot: string; semester_code: number; type_code: number;
  room_code: number; subject_code: number; teacher_code: number;
  batch: string; duration: number; notes: string; user_id: string;
}
export interface DbAcademicConfig {
  id: string; active_term: string; academic_year: string;
  start_date: string | null; end_date: string | null; user_id: string;
}

function useUserId() {
  const { user } = useAuth();
  return user?.id;
}

// ========== SUBJECTS ==========
export function useSubjects() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['subjects', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('subjects').select('*').order('code');
      if (error) throw error;
      return data as DbSubject[];
    },
    enabled: !!userId,
  });
}

export function useUpsertSubject() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (sub: { id?: string; code: number; name: string; short_name: string }) => {
      if (sub.id) {
        const { error } = await supabase.from('subjects').update({ code: sub.code, name: sub.name, short_name: sub.short_name }).eq('id', sub.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('subjects').insert({ code: sub.code, name: sub.name, short_name: sub.short_name, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Subject saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Subject deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ========== TEACHERS ==========
export function useTeachers() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['teachers', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('teachers').select('*').order('code');
      if (error) throw error;
      return data as DbTeacher[];
    },
    enabled: !!userId,
  });
}

export function useUpsertTeacher() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (t: { id?: string; code: number; name: string; short_name: string }) => {
      if (t.id) {
        const { error } = await supabase.from('teachers').update({ code: t.code, name: t.name, short_name: t.short_name }).eq('id', t.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('teachers').insert({ code: t.code, name: t.name, short_name: t.short_name, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teachers'] }); toast.success('Teacher saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teachers'] }); toast.success('Teacher deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ========== ROOMS ==========
export function useRooms() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['rooms', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('rooms').select('*').order('code');
      if (error) throw error;
      return data as DbRoom[];
    },
    enabled: !!userId,
  });
}

export function useUpsertRoom() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (r: { id?: string; code: number; name: string; room_type: string }) => {
      if (r.id) {
        const { error } = await supabase.from('rooms').update({ code: r.code, name: r.name, room_type: r.room_type }).eq('id', r.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('rooms').insert({ code: r.code, name: r.name, room_type: r.room_type, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms'] }); toast.success('Room saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rooms'] }); toast.success('Room deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ========== SEMESTERS ==========
export function useSemesters() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['semesters', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('semesters').select('*').order('code');
      if (error) throw error;
      return data as DbSemester[];
    },
    enabled: !!userId,
  });
}

export function useUpsertSemester() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (s: { id?: string; code: number; name: string; parity: string }) => {
      if (s.id) {
        const { error } = await supabase.from('semesters').update({ code: s.code, name: s.name, parity: s.parity }).eq('id', s.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('semesters').insert({ code: s.code, name: s.name, parity: s.parity, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['semesters'] }); toast.success('Semester saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteSemester() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('semesters').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['semesters'] }); toast.success('Semester deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ========== SLOTS ==========
export function useSlots() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['slots', userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('slots').select('*').order('sort_order');
      if (error) throw error;
      return data as DbSlot[];
    },
    enabled: !!userId,
  });
}

export function useUpsertSlot() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (s: { id?: string; code: string; label: string; start_time: string; end_time: string; sort_order: number }) => {
      if (s.id) {
        const { id, ...rest } = s;
        const { error } = await (supabase as any).from('slots').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('slots').insert({ ...s, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['slots'] }); toast.success('Slot saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('slots').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['slots'] }); toast.success('Slot deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ========== TIMETABLE RECORDS ==========
export function useTimetableRecords() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['timetable_records', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('timetable_records').select('*').order('created_at');
      if (error) throw error;
      return data as DbTimetableRecord[];
    },
    enabled: !!userId,
  });
}

export function useUpsertTimetableRecord() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (r: Omit<DbTimetableRecord, 'user_id'> & { id?: string }) => {
      if (r.id) {
        const { id, ...rest } = r;
        const { error } = await supabase.from('timetable_records').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { id, ...rest } = r;
        const { error } = await supabase.from('timetable_records').insert({ ...rest, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['timetable_records'] }); toast.success('Record saved'); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteTimetableRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('timetable_records').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['timetable_records'] }); toast.success('Record deleted'); },
    onError: (e: any) => toast.error(e.message),
  });
}

// ========== ACADEMIC CONFIG ==========
export function useAcademicConfig() {
  const userId = useUserId();
  return useQuery({
    queryKey: ['academic_config', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('academic_config').select('*').maybeSingle();
      if (error) throw error;
      return data as DbAcademicConfig | null;
    },
    enabled: !!userId,
  });
}

export function useUpsertAcademicConfig() {
  const qc = useQueryClient();
  const userId = useUserId();
  return useMutation({
    mutationFn: async (config: { id?: string; active_term: string; academic_year: string; start_date?: string; end_date?: string }) => {
      if (config.id) {
        const { id, ...rest } = config;
        const { error } = await supabase.from('academic_config').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('academic_config').insert({ ...config, user_id: userId! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['academic_config'] }); },
    onError: (e: any) => toast.error(e.message),
  });
}
