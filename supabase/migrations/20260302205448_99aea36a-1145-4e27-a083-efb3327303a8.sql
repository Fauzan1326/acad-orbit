
-- Academic config table
CREATE TABLE public.academic_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  active_term TEXT NOT NULL DEFAULT 'Odd' CHECK (active_term IN ('Odd', 'Even')),
  academic_year TEXT NOT NULL DEFAULT '2025-26',
  start_date DATE,
  end_date DATE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.academic_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own config" ON public.academic_config FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code INTEGER NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code, user_id)
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subjects" ON public.subjects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code INTEGER NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code, user_id)
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own teachers" ON public.teachers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code INTEGER NOT NULL,
  name TEXT NOT NULL,
  room_type TEXT NOT NULL DEFAULT 'Classroom' CHECK (room_type IN ('Classroom', 'Lab')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code, user_id)
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own rooms" ON public.rooms FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Semesters table
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code INTEGER NOT NULL,
  name TEXT NOT NULL,
  parity TEXT NOT NULL CHECK (parity IN ('Odd', 'Even')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code, user_id)
);
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own semesters" ON public.semesters FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Timetable records table
CREATE TABLE public.timetable_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day TEXT NOT NULL CHECK (day IN ('Mon','Tue','Wed','Thu','Fri','Sat')),
  slot TEXT NOT NULL CHECK (slot IN ('P1','P2','P3','P4','P5','P6')),
  semester_code INTEGER NOT NULL,
  type_code INTEGER NOT NULL DEFAULT 0 CHECK (type_code IN (0, 1)),
  room_code INTEGER NOT NULL,
  subject_code INTEGER NOT NULL,
  teacher_code INTEGER NOT NULL,
  batch TEXT NOT NULL DEFAULT 'A',
  duration INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.timetable_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own records" ON public.timetable_records FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER update_academic_config_updated_at BEFORE UPDATE ON public.academic_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timetable_records_updated_at BEFORE UPDATE ON public.timetable_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
