import type { TimetableRecord } from '@/types/academic';
import { DAYS } from '@/types/academic';
import { useAcademic } from '@/context/AcademicContext';
import {
  Tooltip, TooltipContent, TooltipTrigger
} from '@/components/ui/tooltip';

interface TimetableGridProps {
  records: TimetableRecord[];
  title: string;
  subtitle?: string;
}

function getCellRecords(records: TimetableRecord[], day: string, slot: string) {
  return records.filter(r => r.day === day && r.slot === slot);
}

function RecordCell({ record }: { record: TimetableRecord }) {
  const { subjects, teachers, rooms, clashes } = useAcademic();
  const subject = subjects.find(s => s.code === record.subjectCode);
  const teacher = teachers.find(t => t.code === record.teacherCode);
  const room = rooms.find(r => r.code === record.roomCode);

  const hasClash = clashes.some(c => c.records.some(r => r.id === record.id));
  const isPractical = record.typeCode === 1;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`
          rounded-md p-1.5 text-[10px] leading-tight cursor-pointer transition-all
          ${hasClash ? 'bg-destructive/15 border border-destructive/40 ring-1 ring-destructive/20' : ''}
          ${isPractical ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/80 border border-border/30'}
        `}>
          <div className="font-semibold truncate">{subject?.shortName || `S${record.subjectCode}`}</div>
          <div className="text-muted-foreground truncate">{teacher?.shortName || `T${record.teacherCode}`} · {room?.name || `R${record.roomCode}`}</div>
          {record.batch !== 'A' && (
            <div className="text-muted-foreground">{record.batch}</div>
          )}
          <div className={`mt-0.5 inline-block px-1 py-px rounded text-[8px] font-medium ${
            isPractical ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            {record.typeCode === 0 ? 'Theory' : 'Practical'}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <div className="space-y-1">
          <p className="encoding-mono text-xs">{record.encodedId}</p>
          <p className="text-xs">{record.humanReadable}</p>
          {record.notes && <p className="text-xs text-destructive">{record.notes}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function TimetableGrid({ records, title, subtitle }: TimetableGridProps) {
  const { slots } = useAcademic();

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/30">
        <h3 className="font-semibold text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="timetable-header w-16">Day</th>
              {slots.map(slot => (
                <th key={slot.code} className="timetable-header">
                  <div>{slot.code}</div>
                  <div className="text-[9px] font-normal opacity-70">{slot.startTime} - {slot.endTime}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="timetable-header font-medium text-center">{day}</td>
                {slots.map(slot => {
                  const cellRecs = getCellRecords(records, day, slot.code);
                  return (
                    <td key={slot.code} className="timetable-cell align-top min-w-[100px]">
                      <div className="space-y-1">
                        {cellRecs.map(rec => (
                          <RecordCell key={rec.id} record={rec} />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
