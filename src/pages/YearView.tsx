import { useAcademic } from '@/context/AcademicContext';
import { TimetableGrid } from '@/components/TimetableGrid';

const YEAR_GROUPS = [
  { name: 'Second Year', semesters: [3, 4] },
  { name: 'Third Year', semesters: [5, 6] },
  { name: 'Fourth Year', semesters: [7, 8] },
];

export default function YearView() {
  const { activeRecords, activeSemesters } = useAcademic();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Year-wise Merged View</h1>
        <p className="text-sm text-muted-foreground mt-1">Combined semester timetables by year</p>
      </div>

      {YEAR_GROUPS.map(group => {
        const yearRecords = activeRecords.filter(r => group.semesters.includes(r.semesterCode));
        if (yearRecords.length === 0) return null;
        const activeSems = group.semesters.filter(s => activeSemesters.includes(s));
        return (
          <TimetableGrid
            key={group.name}
            records={yearRecords}
            title={group.name}
            subtitle={`Semesters ${activeSems.join(' + ')} · ${yearRecords.length} slots`}
          />
        );
      })}
    </div>
  );
}
