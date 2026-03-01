import { useAcademic } from '@/context/AcademicContext';
import { SUBJECTS, TEACHERS, ROOMS, TYPE_NAMES, SEMESTERS } from '@/data/lookups';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipTrigger
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function MasterData() {
  const { masterRecords, clashes } = useAcademic();
  const [search, setSearch] = useState('');

  const filtered = masterRecords.filter(r =>
    r.humanReadable.toLowerCase().includes(search.toLowerCase()) ||
    r.encodedId.includes(search) ||
    r.notes.toLowerCase().includes(search.toLowerCase())
  );

  const getClashForRecord = (id: string) =>
    clashes.find(c => c.records.some(r => r.id === id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Master Timetable Database</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {masterRecords.length} total records · Single source of truth
          </p>
        </div>
        <Input
          placeholder="Search records..."
          className="w-64 bg-secondary/50"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                {['Status', 'Encoded ID', 'Day', 'Slot', 'Sem', 'Type', 'Room', 'Subject', 'Teacher', 'Batch', 'Parity', 'Notes'].map(h => (
                  <th key={h} className="timetable-header text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => {
                const clash = getClashForRecord(record.id);
                const subject = SUBJECTS.find(s => s.code === record.subjectCode);
                const teacher = TEACHERS.find(t => t.code === record.teacherCode);
                const room = ROOMS.find(r => r.code === record.roomCode);

                return (
                  <tr key={record.id} className={`border-b border-border/20 hover:bg-muted/20 transition-colors ${
                    clash ? 'bg-destructive/5' : ''
                  }`}>
                    <td className="p-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        clash ? 'status-conflict' : record.isActive ? 'status-active' : 'status-stored'
                      }`}>
                        {clash ? 'CONFLICT' : record.isActive ? 'ACTIVE' : 'STORED'}
                      </span>
                    </td>
                    <td className="p-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="encoding-mono text-[10px]">{record.encodedId}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{record.humanReadable}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="p-2">{record.day}</td>
                    <td className="p-2">{record.slot}</td>
                    <td className="p-2 font-medium">SEM {record.semesterCode}</td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                        record.typeCode === 1 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {TYPE_NAMES[record.typeCode]}
                      </span>
                    </td>
                    <td className="p-2">{room?.name}</td>
                    <td className="p-2">{subject?.shortName}</td>
                    <td className="p-2">{teacher?.shortName}</td>
                    <td className="p-2">{record.batch}</td>
                    <td className="p-2 text-muted-foreground">{record.termParity}</td>
                    <td className="p-2 text-muted-foreground max-w-[150px] truncate">{record.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
