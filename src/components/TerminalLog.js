import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export const TerminalLog = ({ logs }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-4 h-[400px] overflow-hidden flex flex-col" data-testid="terminal-log">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">System Logs</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-muted-foreground italic">Waiting for execution...</div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`${getLogColor(log.type)}`}
            >
              <span className="text-muted-foreground mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              {log.message}
            </motion.div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};