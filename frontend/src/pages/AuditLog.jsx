import { useEffect, useState } from "react";

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/audit`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.log(`Failed to load audit logs: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <p className="text-zinc-500 text-sm">
        Loading audit logs…
      </p>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">
        No audit activity yet.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-serif tracking-widest text-zinc-200">
          AUDIT LOG
        </h1>
        <p className="text-xs tracking-wide text-zinc-400">
          System activity & editorial actions
        </p>
      </div>

      {/* Logs */}
      <div className="space-y-4">
        {logs.map(log => (
          <div
            key={log._id}
            className="
              rounded-xl
              p-6
              backdrop-blur-xl
              bg-gradient-to-br
              from-white/10 via-white/5 to-white/10
              border border-white/20
              shadow-[0_12px_40px_rgba(0,0,0,0.45)]
            "
          >
            {/* Action */}
            <p className="text-sm tracking-widest uppercase text-zinc-100">
              {log.action.replaceAll("_", " ")}
            </p>

            {/* Actor */}
            <p className="text-xs text-zinc-400 mt-1">
              by {log.actor?.name} ({log.actor?.role})
            </p>

            {/* Timestamp */}
            <p className="text-[11px] text-zinc-500 mt-1">
              {new Date(log.createdAt).toLocaleString()}
            </p>

            {/* Metadata */}
            {log.metadata && (
              <div className="mt-4 rounded-lg bg-black/40 border border-white/10 p-3">
                <pre className="text-[11px] text-zinc-300 overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditLog;
