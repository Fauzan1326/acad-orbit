import { useAcademic } from '@/context/AcademicContext';
import { motion } from 'framer-motion';
import { Database, Plus, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { DAYS, SLOTS } from '@/types/academic';
import type { TimetableRecord, DayCode, SlotCode, TypeCode } from '@/types/academic';

function AddRecordDialog() {
  const { subjects, teachers, rooms, semesters, addRecord } = useAcademic();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    day: 'Mon', slot: 'P1', semesterCode: '', typeCode: '0',
    roomCode: '', subjectCode: '', teacherCode: '', batch: 'A', duration: '1', notes: '',
  });

  const handleSave = () => {
    if (!form.semesterCode || !form.roomCode || !form.subjectCode || !form.teacherCode) return;
    addRecord({
      id: '', day: form.day as DayCode, slot: form.slot as SlotCode,
      semesterCode: parseInt(form.semesterCode), typeCode: parseInt(form.typeCode) as TypeCode,
      roomCode: parseInt(form.roomCode), subjectCode: parseInt(form.subjectCode),
      teacherCode: parseInt(form.teacherCode), batch: form.batch, duration: parseInt(form.duration),
      termParity: 'Odd', isActive: false, encodedId: '', humanReadable: '', notes: form.notes,
    });
    setOpen(false);
    setForm({ day: 'Mon', slot: 'P1', semesterCode: '', typeCode: '0', roomCode: '', subjectCode: '', teacherCode: '', batch: 'A', duration: '1', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1 text-xs"><Plus className="h-3 w-3" /> Add Record</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Add Timetable Record</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Day</Label>
            <Select value={form.day} onValueChange={v => setForm({ ...form, day: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Slot</Label>
            <Select value={form.slot} onValueChange={v => setForm({ ...form, slot: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>{SLOTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Semester</Label>
            <Select value={form.semesterCode} onValueChange={v => setForm({ ...form, semesterCode: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{semesters.map(s => <SelectItem key={s.code} value={String(s.code)}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Type</Label>
            <Select value={form.typeCode} onValueChange={v => setForm({ ...form, typeCode: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Theory</SelectItem>
                <SelectItem value="1">Practical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Room</Label>
            <Select value={form.roomCode} onValueChange={v => setForm({ ...form, roomCode: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{rooms.map(r => <SelectItem key={r.code} value={String(r.code)}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Select value={form.subjectCode} onValueChange={v => setForm({ ...form, subjectCode: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{subjects.map(s => <SelectItem key={s.code} value={String(s.code)}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Teacher</Label>
            <Select value={form.teacherCode} onValueChange={v => setForm({ ...form, teacherCode: v })}>
              <SelectTrigger className="mt-1 text-xs bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{teachers.map(t => <SelectItem key={t.code} value={String(t.code)}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Batch</Label>
            <Input value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })}
              className="mt-1 text-xs bg-secondary/50" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Notes</Label>
            <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="mt-1 text-xs bg-secondary/50" placeholder="Optional" />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full mt-2">Save Record</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function MasterData() {
  const { masterRecords, clashes, subjects, teachers, rooms, deleteRecord } = useAcademic();
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Master Timetable Database</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {masterRecords.length} total records · Single source of truth
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search records..." className="w-64 bg-secondary/50" value={search} onChange={e => setSearch(e.target.value)} />
          <AddRecordDialog />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                {['Status', 'Encoded ID', 'Day', 'Slot', 'Sem', 'Type', 'Room', 'Subject', 'Teacher', 'Batch', 'Parity', 'Notes', ''].map(h => (
                  <th key={h} className="timetable-header text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => {
                const clash = getClashForRecord(record.id);
                const subject = subjects.find(s => s.code === record.subjectCode);
                const teacher = teachers.find(t => t.code === record.teacherCode);
                const room = rooms.find(r => r.code === record.roomCode);

                return (
                  <tr key={record.id} className={`border-b border-border/20 hover:bg-muted/20 transition-colors ${clash ? 'bg-destructive/5' : ''}`}>
                    <td className="p-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${clash ? 'status-conflict' : record.isActive ? 'status-active' : 'status-stored'}`}>
                        {clash ? 'CONFLICT' : record.isActive ? 'ACTIVE' : 'STORED'}
                      </span>
                    </td>
                    <td className="p-2">
                      <Tooltip>
                        <TooltipTrigger><span className="encoding-mono text-[10px]">{record.encodedId}</span></TooltipTrigger>
                        <TooltipContent><p className="text-xs">{record.humanReadable}</p></TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="p-2">{record.day}</td>
                    <td className="p-2">{record.slot}</td>
                    <td className="p-2 font-medium">SEM {record.semesterCode}</td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${record.typeCode === 1 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {record.typeCode === 0 ? 'Theory' : 'Practical'}
                      </span>
                    </td>
                    <td className="p-2">{room?.name || `R${record.roomCode}`}</td>
                    <td className="p-2">{subject?.shortName || `S${record.subjectCode}`}</td>
                    <td className="p-2">{teacher?.shortName || `T${record.teacherCode}`}</td>
                    <td className="p-2">{record.batch}</td>
                    <td className="p-2 text-muted-foreground">{record.termParity}</td>
                    <td className="p-2 text-muted-foreground max-w-[150px] truncate">{record.notes}</td>
                    <td className="p-2">
                      <Button size="icon" variant="ghost" onClick={() => deleteRecord(record.id)} className="h-6 w-6">
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </td>
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
