import { useAcademic } from '@/context/AcademicContext';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ClashDetection() {
  const { clashes, activeRecords } = useAcademic();

  const errors = clashes.filter(c => c.severity === 'error');
  const warnings = clashes.filter(c => c.severity === 'warning');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Clash Detection Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time validation across {activeRecords.length} active records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-destructive">{errors.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Critical Conflicts</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-warning">{warnings.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Warnings</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-bold text-success">{activeRecords.length - clashes.reduce((a, c) => a + c.records.length, 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Clean Records</p>
        </div>
      </div>

      {clashes.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-10 text-center">
          <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
          <p className="font-semibold">No Conflicts Detected</p>
          <p className="text-sm text-muted-foreground mt-1">All schedules are valid</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {clashes.map((clash, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 border-l-4 ${
                clash.severity === 'error' ? 'border-l-destructive' : 'border-l-warning'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  clash.severity === 'error' ? 'text-destructive' : 'text-warning'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                      clash.severity === 'error' ? 'status-conflict' : 'status-stored'
                    }`}>
                      {clash.type.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{clash.message}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {clash.records.map(r => (
                      <div key={r.id} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="encoding-mono text-[10px]">{r.encodedId}</span>
                        <span>{r.humanReadable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
