import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useSubjects, useUpsertSubject, useDeleteSubject,
  useTeachers, useUpsertTeacher, useDeleteTeacher,
  useRooms, useUpsertRoom, useDeleteRoom,
  useSemesters, useUpsertSemester, useDeleteSemester,
} from '@/hooks/useDbData';

interface EditingItem {
  id?: string;
  code: string;
  name: string;
  shortOrType: string;
  extra?: string;
}

function LookupSection({
  title, headers, items, onSave, onDelete, showTypeSelect, typeOptions,
}: {
  title: string;
  headers: string[];
  items: { id: string; code: number; name: string; extra: string }[];
  onSave: (item: { id?: string; code: number; name: string; extra: string }) => void;
  onDelete: (id: string) => void;
  showTypeSelect?: boolean;
  typeOptions?: { value: string; label: string }[];
}) {
  const [editing, setEditing] = useState<EditingItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const startAdd = () => {
    setIsAdding(true);
    setEditing({ code: '', name: '', shortOrType: '' });
  };

  const startEdit = (item: { id: string; code: number; name: string; extra: string }) => {
    setIsAdding(false);
    setEditing({ id: item.id, code: String(item.code), name: item.name, shortOrType: item.extra });
  };

  const save = () => {
    if (!editing || !editing.code || !editing.name || !editing.shortOrType) return;
    onSave({
      id: editing.id,
      code: parseInt(editing.code),
      name: editing.name.trim(),
      extra: editing.shortOrType.trim(),
    });
    setEditing(null);
    setIsAdding(false);
  };

  const cancel = () => { setEditing(null); setIsAdding(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Button size="sm" variant="outline" onClick={startAdd} className="text-xs h-7 gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/50">
            {headers.map(h => <th key={h} className="timetable-header text-left">{h}</th>)}
            <th className="timetable-header text-right w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && editing && (
            <tr className="border-b border-primary/20 bg-primary/5">
              <td className="p-2">
                <Input type="number" value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })}
                  className="h-7 text-xs w-16 bg-secondary/50" placeholder="Code" />
              </td>
              <td className="p-2">
                <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="h-7 text-xs bg-secondary/50" placeholder="Name" />
              </td>
              <td className="p-2">
                {showTypeSelect ? (
                  <Select value={editing.shortOrType} onValueChange={v => setEditing({ ...editing, shortOrType: v })}>
                    <SelectTrigger className="h-7 text-xs bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {typeOptions?.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={editing.shortOrType} onChange={e => setEditing({ ...editing, shortOrType: e.target.value })}
                    className="h-7 text-xs bg-secondary/50" placeholder={headers[2]} />
                )}
              </td>
              <td className="p-2 text-right">
                <div className="flex gap-1 justify-end">
                  <Button size="icon" variant="ghost" onClick={save} className="h-6 w-6"><Check className="h-3 w-3 text-success" /></Button>
                  <Button size="icon" variant="ghost" onClick={cancel} className="h-6 w-6"><X className="h-3 w-3" /></Button>
                </div>
              </td>
            </tr>
          )}
          {items.map(item => (
            <tr key={item.id} className="border-b border-border/20 hover:bg-muted/20">
              {editing?.id === item.id ? (
                <>
                  <td className="p-2">
                    <Input type="number" value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })}
                      className="h-7 text-xs w-16 bg-secondary/50" />
                  </td>
                  <td className="p-2">
                    <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                      className="h-7 text-xs bg-secondary/50" />
                  </td>
                  <td className="p-2">
                    {showTypeSelect ? (
                      <Select value={editing.shortOrType} onValueChange={v => setEditing({ ...editing, shortOrType: v })}>
                        <SelectTrigger className="h-7 text-xs bg-secondary/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {typeOptions?.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={editing.shortOrType} onChange={e => setEditing({ ...editing, shortOrType: e.target.value })}
                        className="h-7 text-xs bg-secondary/50" />
                    )}
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="icon" variant="ghost" onClick={save} className="h-6 w-6"><Check className="h-3 w-3 text-success" /></Button>
                      <Button size="icon" variant="ghost" onClick={cancel} className="h-6 w-6"><X className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2.5">{item.code}</td>
                  <td className="p-2.5">{item.name}</td>
                  <td className="p-2.5">{item.extra}</td>
                  <td className="p-2.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(item)} className="h-6 w-6"><Pencil className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} className="h-6 w-6"><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
          {items.length === 0 && !isAdding && (
            <tr><td colSpan={4} className="p-6 text-center text-muted-foreground text-xs">No items yet. Click "Add" to create one.</td></tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default function Lookups() {
  const { data: subjects = [] } = useSubjects();
  const { data: teachers = [] } = useTeachers();
  const { data: rooms = [] } = useRooms();
  const { data: semesters = [] } = useSemesters();

  const upsertSubject = useUpsertSubject();
  const deleteSubject = useDeleteSubject();
  const upsertTeacher = useUpsertTeacher();
  const deleteTeacher = useDeleteTeacher();
  const upsertRoom = useUpsertRoom();
  const deleteRoom = useDeleteRoom();
  const upsertSemester = useUpsertSemester();
  const deleteSemester = useDeleteSemester();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Lookup Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove reference data — all changes save to the cloud</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LookupSection
          title="Subjects"
          headers={['Code', 'Name', 'Short Name']}
          items={subjects.map(s => ({ id: s.id, code: s.code, name: s.name, extra: s.short_name }))}
          onSave={item => upsertSubject.mutate({ id: item.id, code: item.code, name: item.name, short_name: item.extra })}
          onDelete={id => deleteSubject.mutate(id)}
        />

        <LookupSection
          title="Teachers"
          headers={['Code', 'Name', 'Short Name']}
          items={teachers.map(t => ({ id: t.id, code: t.code, name: t.name, extra: t.short_name }))}
          onSave={item => upsertTeacher.mutate({ id: item.id, code: item.code, name: item.name, short_name: item.extra })}
          onDelete={id => deleteTeacher.mutate(id)}
        />

        <LookupSection
          title="Rooms"
          headers={['Code', 'Name', 'Type']}
          items={rooms.map(r => ({ id: r.id, code: r.code, name: r.name, extra: r.room_type }))}
          onSave={item => upsertRoom.mutate({ id: item.id, code: item.code, name: item.name, room_type: item.extra })}
          onDelete={id => deleteRoom.mutate(id)}
          showTypeSelect
          typeOptions={[{ value: 'Classroom', label: 'Classroom' }, { value: 'Lab', label: 'Lab' }]}
        />

        <LookupSection
          title="Semesters"
          headers={['Code', 'Name', 'Parity']}
          items={semesters.map(s => ({ id: s.id, code: s.code, name: s.name, extra: s.parity }))}
          onSave={item => upsertSemester.mutate({ id: item.id, code: item.code, name: item.name, parity: item.extra })}
          onDelete={id => deleteSemester.mutate(id)}
          showTypeSelect
          typeOptions={[{ value: 'Odd', label: 'Odd' }, { value: 'Even', label: 'Even' }]}
        />
      </div>
    </div>
  );
}
