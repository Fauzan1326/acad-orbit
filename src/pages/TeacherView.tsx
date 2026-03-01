import { useAcademic } from '@/context/AcademicContext';
import { TimetableGrid } from '@/components/TimetableGrid';
import { TEACHERS } from '@/data/lookups';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SUBJECTS, TYPE_NAMES, SEMESTERS } from '@/data/lookups';
import { motion } from 'framer-motion';

export default function TeacherView() {
  const { activeRecords } = useAcademic();
  const activeTeachers = TEACHERS.filter(t => activeRecords.some(r => r.teacherCode === t.code));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Faculty Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">{activeTeachers.length} active faculty members</p>
      </div>

      {/* Workload summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {activeTeachers.map(teacher => {
          const count = activeRecords.filter(r => r.teacherCode === teacher.code).length;
          return (
            <motion.div key={teacher.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card p-3 text-center">
              <p className="font-semibold text-sm">{teacher.shortName}</p>
              <p className="text-xs text-muted-foreground truncate">{teacher.name}</p>
              <p className="text-lg font-bold text-primary mt-1">{count}</p>
              <p className="text-[9px] text-muted-foreground">slots/week</p>
            </motion.div>
          );
        })}
      </div>

      {/* Subject-Staff Assignment */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3">Subject–Staff Assignment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                {['Semester', 'Subject', 'Type', 'Teacher', 'Slots'].map(h => (
                  <th key={h} className="timetable-header text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const assignments = new Map<string, { sem: number; sub: number; type: number; teacher: number; count: number }>();
                activeRecords.forEach(r => {
                  const key = `${r.semesterCode}-${r.subjectCode}-${r.typeCode}-${r.teacherCode}`;
                  if (!assignments.has(key)) {
                    assignments.set(key, { sem: r.semesterCode, sub: r.subjectCode, type: r.typeCode, teacher: r.teacherCode, count: 0 });
                  }
                  assignments.get(key)!.count++;
                });
                return Array.from(assignments.values()).sort((a, b) => a.sem - b.sem || a.sub - b.sub).map((a, i) => (
                  <tr key={i} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="p-2">SEM {a.sem}</td>
                    <td className="p-2">{SUBJECTS.find(s => s.code === a.sub)?.name}</td>
                    <td className="p-2">{TYPE_NAMES[a.type]}</td>
                    <td className="p-2">{TEACHERS.find(t => t.code === a.teacher)?.name}</td>
                    <td className="p-2 font-medium">{a.count}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-teacher timetables */}
      <Tabs defaultValue={String(activeTeachers[0]?.code)} className="space-y-4">
        <TabsList className="bg-secondary/50 flex-wrap h-auto">
          {activeTeachers.map(t => (
            <TabsTrigger key={t.code} value={String(t.code)}>{t.shortName}</TabsTrigger>
          ))}
        </TabsList>
        {activeTeachers.map(teacher => {
          const tRecords = activeRecords.filter(r => r.teacherCode === teacher.code);
          return (
            <TabsContent key={teacher.code} value={String(teacher.code)}>
              <TimetableGrid
                records={tRecords}
                title={teacher.name}
                subtitle={`${tRecords.length} slots/week`}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
