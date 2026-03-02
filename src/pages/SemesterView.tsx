import { useAcademic } from '@/context/AcademicContext';
import { TimetableGrid } from '@/components/TimetableGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SemesterView() {
  const { activeRecords, activeSemesters, semesters } = useAcademic();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Semester Timetables</h1>
        <p className="text-sm text-muted-foreground mt-1">Active semesters: {activeSemesters.join(', ')}</p>
      </div>

      {activeSemesters.length > 0 && (
        <Tabs defaultValue={String(activeSemesters[0])} className="space-y-4">
          <TabsList className="bg-secondary/50">
            {activeSemesters.map(sem => (
              <TabsTrigger key={sem} value={String(sem)}>SEM {sem}</TabsTrigger>
            ))}
          </TabsList>
          {activeSemesters.map(sem => {
            const semRecords = activeRecords.filter(r => r.semesterCode === sem);
            const semName = semesters.find(s => s.code === sem)?.name || `Semester ${sem}`;
            return (
              <TabsContent key={sem} value={String(sem)}>
                <TimetableGrid records={semRecords} title={semName} subtitle={`${semRecords.length} scheduled slots`} />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
