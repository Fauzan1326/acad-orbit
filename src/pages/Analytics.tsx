import { useAcademic } from '@/context/AcademicContext';
import { TEACHERS, ROOMS, SUBJECTS, SEMESTERS, TYPE_NAMES } from '@/data/lookups';
import { DAYS, SLOTS } from '@/types/academic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['hsl(187, 85%, 47%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(280, 70%, 50%)', 'hsl(210, 70%, 50%)'];

export default function Analytics() {
  const { activeRecords, clashes, activeSemesters } = useAcademic();

  // Teacher workload
  const teacherWorkload = TEACHERS
    .map(t => ({
      name: t.shortName,
      slots: activeRecords.filter(r => r.teacherCode === t.code).length,
    }))
    .filter(t => t.slots > 0)
    .sort((a, b) => b.slots - a.slots);

  // Room utilization
  const totalSlots = DAYS.length * SLOTS.length;
  const roomUtil = ROOMS.map(room => ({
    name: room.name,
    used: activeRecords.filter(r => r.roomCode === room.code).length,
    pct: Math.round((activeRecords.filter(r => r.roomCode === room.code).length / totalSlots) * 100),
  })).filter(r => r.used > 0);

  // Semester load
  const semLoad = activeSemesters.map(sem => ({
    name: `SEM ${sem}`,
    theory: activeRecords.filter(r => r.semesterCode === sem && r.typeCode === 0).length,
    practical: activeRecords.filter(r => r.semesterCode === sem && r.typeCode === 1).length,
  }));

  // Conflict breakdown
  const conflictTypes = ['Teacher', 'Room', 'Semester', 'RoomRule'].map(type => ({
    name: type,
    value: clashes.filter(c => c.type === type).length,
  })).filter(c => c.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visual insights into scheduling data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-4">Faculty Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teacherWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(222, 41%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: 8 }}
                labelStyle={{ color: 'hsl(210, 40%, 93%)' }}
              />
              <Bar dataKey="slots" fill="hsl(187, 85%, 47%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-4">Room Utilization (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roomUtil}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(222, 41%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: 8 }}
                labelStyle={{ color: 'hsl(210, 40%, 93%)' }}
              />
              <Bar dataKey="pct" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-4">Semester Load Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={semLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(222, 41%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: 8 }}
                labelStyle={{ color: 'hsl(210, 40%, 93%)' }}
              />
              <Bar dataKey="theory" fill="hsl(187, 85%, 47%)" name="Theory" radius={[4, 4, 0, 0]} />
              <Bar dataKey="practical" fill="hsl(38, 92%, 50%)" name="Practical" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-4">Conflict Breakdown</h3>
          {conflictTypes.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              No conflicts detected ✓
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={conflictTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                  dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {conflictTypes.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(222, 41%, 10%)', border: '1px solid hsl(222, 30%, 18%)', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
