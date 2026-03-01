import { useAcademic } from '@/context/AcademicContext';
import type { AcademicConfig, TermParity } from '@/types/academic';
import { motion } from 'framer-motion';
import { Settings2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AcademicControl() {
  const { config, setConfig, activeSemesters, activeRecords, masterRecords } = useAcademic();

  const toggleTerm = () => {
    const newTerm: TermParity = config.activeTerm === 'Odd' ? 'Even' : 'Odd';
    setConfig({ ...config, activeTerm: newTerm });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Academic Control Layer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Central intelligence module — controls all data activation
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Term Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Active Term</Label>
            <div className="mt-2 flex gap-2">
              {(['Odd', 'Even'] as TermParity[]).map(term => (
                <Button
                  key={term}
                  variant={config.activeTerm === term ? 'default' : 'outline'}
                  onClick={() => setConfig({ ...config, activeTerm: term })}
                  className="flex-1"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Academic Year</Label>
            <Input
              className="mt-2 bg-secondary/50"
              value={config.academicYear}
              onChange={e => setConfig({ ...config, academicYear: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Start Date</Label>
            <Input
              type="date"
              className="mt-2 bg-secondary/50"
              value={config.startDate}
              onChange={e => setConfig({ ...config, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">End Date</Label>
            <Input
              type="date"
              className="mt-2 bg-secondary/50"
              value={config.endDate}
              onChange={e => setConfig({ ...config, endDate: e.target.value })}
            />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Activation Status</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[3,4,5,6,7,8].map(sem => {
            const isActive = activeSemesters.includes(sem);
            const count = masterRecords.filter(r => r.semesterCode === sem).length;
            return (
              <div key={sem} className={`p-4 rounded-lg border text-center transition-all ${
                isActive ? 'border-primary/40 bg-primary/5' : 'border-border/30 bg-muted/20 opacity-50'
              }`}>
                <p className="font-bold text-lg">SEM {sem}</p>
                <p className="text-xs text-muted-foreground">{count} records</p>
                <span className={`mt-2 inline-block text-[9px] px-2 py-0.5 rounded-full font-medium ${
                  isActive ? 'status-active' : 'status-stored'
                }`}>
                  {isActive ? 'ACTIVE' : 'STORED'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
          <strong>Auto-Activation Logic:</strong> Switching term instantly activates/deactivates semesters.
          Currently <strong>{activeRecords.length}</strong> of <strong>{masterRecords.length}</strong> records active.
        </div>
      </motion.div>
    </div>
  );
}
