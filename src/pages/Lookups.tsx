import { SEMESTERS, SUBJECTS, TEACHERS, ROOMS, TYPE_NAMES } from '@/data/lookups';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

function LookupTable({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/30">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50">
            {headers.map(h => <th key={h} className="timetable-header text-left">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/20 hover:bg-muted/20">
              {row.map((cell, j) => <td key={j} className="p-2.5">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default function Lookups() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Lookup Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Reference data tables for encoding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LookupTable
          title="Semesters"
          headers={['Code', 'Name', 'Parity']}
          rows={SEMESTERS.map(s => [s.code, s.name, s.parity])}
        />
        <LookupTable
          title="Subjects"
          headers={['Code', 'Name', 'Short']}
          rows={SUBJECTS.map(s => [s.code, s.name, s.shortName])}
        />
        <LookupTable
          title="Teachers"
          headers={['Code', 'Name', 'Short']}
          rows={TEACHERS.map(t => [t.code, t.name, t.shortName])}
        />
        <LookupTable
          title="Rooms"
          headers={['Code', 'Name', 'Type']}
          rows={ROOMS.map(r => [r.code, r.name, r.type])}
        />
      </div>
    </div>
  );
}
