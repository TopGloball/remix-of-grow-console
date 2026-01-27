import { useState } from 'react';
import { ChevronDown, ChevronUp, Bug, Trash2 } from 'lucide-react';
import { useMode } from '@/context/ModeContext';
import { getDebugLogs, clearDebugLogs } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ApiDebugInfo } from '@/types';

export function DebugPanel() {
  const { isDevMode, apiBaseUrl, authMode, useMockData, uiMode } = useMode();
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState<ApiDebugInfo[]>([]);

  if (!isDevMode) {
    return null;
  }

  const refreshLogs = () => {
    setLogs(getDebugLogs());
  };

  const handleClear = () => {
    clearDebugLogs();
    setLogs([]);
  };

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 max-h-[50vh] overflow-hidden border-2 border-orange-500 bg-background/95 backdrop-blur md:left-auto md:right-4 md:w-96">
      <CardHeader 
        className="cursor-pointer p-3"
        onClick={() => {
          setExpanded(!expanded);
          if (!expanded) refreshLogs();
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-sm font-medium">Dev Mode</CardTitle>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="max-h-[40vh] overflow-y-auto p-3 pt-0">
          {/* Config Info */}
          <div className="mb-4 space-y-1 rounded bg-muted p-2 text-xs font-mono">
            <div><span className="text-muted-foreground">API Base:</span> {apiBaseUrl}</div>
            <div><span className="text-muted-foreground">Auth Mode:</span> {authMode}</div>
            <div><span className="text-muted-foreground">Mock Data:</span> {useMockData ? 'true' : 'false'}</div>
            <div><span className="text-muted-foreground">UI Mode:</span> {uiMode}</div>
          </div>

          {/* API Logs */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">API Calls</span>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-6 px-2">
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          {logs.length === 0 ? (
            <div className="text-xs text-muted-foreground italic">No API calls logged yet</div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, idx) => (
                <ApiLogEntry key={`${log.timestamp}-${idx}`} log={log} />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function ApiLogEntry({ log }: { log: ApiDebugInfo }) {
  const [showResponse, setShowResponse] = useState(false);
  const time = new Date(log.timestamp).toLocaleTimeString();

  return (
    <div className="rounded border border-border bg-card p-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold ${log.method === 'POST' ? 'text-green-600' : 'text-blue-600'}`}>
            {log.method}
          </span>
          <span className="font-mono text-foreground truncate max-w-[180px]" title={log.endpoint}>
            {log.endpoint}
          </span>
        </div>
        <span className="text-muted-foreground">{time}</span>
      </div>
      
      <button
        onClick={() => setShowResponse(!showResponse)}
        className="mt-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {showResponse ? 'Hide' : 'Show'} response
      </button>

      {showResponse && (
        <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 text-[10px]">
          {JSON.stringify(log.response, null, 2)}
        </pre>
      )}
    </div>
  );
}
