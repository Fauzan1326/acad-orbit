import { useAcademic } from '@/context/AcademicContext';
import { SUBJECTS, TEACHERS, ROOMS, SEMESTERS } from '@/data/lookups';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, AlertTriangle, Calendar, Users,
  Building, BookOpen, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, accent, link }: {
  icon: any; label: string; value: string | number; accent?: boolean; link?: string;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 ${accent ? 'animate-glow' : ''} hover:border-primary/30 transition-colors`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${accent ? 'bg-destructive/10' : 'bg-primary/10'}`}>
          <Icon className={`h-5 w-5 ${accent ? 'text-destructive' : 'text-primary'}`} />
        </div>
      </div>
    </motion.div>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}

export default function Dashboard() {
  const { activeRecords, clashes, config, activeSemesters, masterRecords } = useAcademic();

  const activeTeachers = new Set(activeRecords.map(r => r.teacherCode)).size;
  const activeRooms = new Set(activeRecords.map(r => r.roomCode)).size;
  const theoryCount = activeRecords.filter(r => r.typeCode === 0).length;
  const practicalCount = activeRecords.filter(r => r.typeCode === 1).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {config.activeTerm} Term · {config.academicYear} · Semesters {activeSemesters.join(', ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Active Records" value={activeRecords.length} link="/master" />
        <StatCard icon={AlertTriangle} label="Conflicts" value={clashes.length} accent={clashes.length > 0} link="/clashes" />
        <StatCard icon={Users} label="Active Faculty" value={activeTeachers} link="/view/teacher" />
        <StatCard icon={Building} label="Rooms in Use" value={activeRooms} link="/view/room" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Master Records (Total)</span>
              <span className="font-medium">{masterRecords.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Theory Slots</span>
              <span className="font-medium">{theoryCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Practical Slots</span>
              <span className="font-medium">{practicalCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Semesters</span>
              <span className="font-medium">{activeSemesters.join(', ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stored (Inactive)</span>
              <span className="font-medium">{masterRecords.length - activeRecords.length}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Active Conflicts
          </h3>
          {clashes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No conflicts detected ✓</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {clashes.slice(0, 8).map((clash, i) => (
                <div key={i} className={`text-xs p-2 rounded-md ${
                  clash.severity === 'error' ? 'status-conflict' : 'status-stored'
                }`}>
                  <span className="font-medium">{clash.type}:</span> {clash.message}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {SEMESTERS.map(sem => {
          const isActive = activeSemesters.includes(sem.code);
          const count = masterRecords.filter(r => r.semesterCode === sem.code).length;
          return (
            <Link key={sem.code} to="/view/semester">
              <div className={`glass-card p-4 text-center hover:border-primary/30 transition-all ${
                isActive ? '' : 'opacity-40'
              }`}>
                <p className="text-lg font-bold">SEM {sem.code}</p>
                <p className="text-xs text-muted-foreground mt-1">{count} records</p>
                <span className={`mt-2 inline-block text-[9px] px-2 py-0.5 rounded-full font-medium ${
                  isActive ? 'status-active' : 'status-stored'
                }`}>
                  {isActive ? 'ACTIVE' : 'STORED'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
