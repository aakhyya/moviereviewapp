import { useEffect, useState } from "react";

function AuditLog(){
    const [logs,setLogs]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        async function fetchLogs(){
            try{
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
            }
            catch(err){
                console.log(`Failed to load audit logs: ${err}`);
            }
            finally{
                setLoading(false);
            }
        }

        fetchLogs();
    },[]);

    if(loading){
        return <p className="text-zinc-500">Loading audit logs...</p>
    }

    if(logs.length===0){
        return <p className="text-zinc-500">No audit activity yet.</p>
    }

    return(
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold font-serif">
                Audit Log
            </h1>

            <div className="space-y-3">
                {logs.map((log) => (
                <div key={log._id} className="bg-ivory p-4 rounded border border-black/10 text-sm">
                    <p className="font-semibold text-velvet">
                    {log.action.replaceAll("_", " ")}
                    </p>

                    <p className="text-zinc-600">
                    by {log.actor?.name} ({log.actor?.role})
                    </p>

                    <p className="text-zinc-500 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                    </p>

                    {log.metadata && (
                    <pre className="mt-2 text-xs bg-black/5 p-2 rounded">
                        {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                    )}
                </div>
                ))}
            </div>
        </div>
    );
    
}

export default AuditLog;