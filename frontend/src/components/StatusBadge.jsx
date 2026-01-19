function StatusBadge({status}){
    const styles={
        published:"border border-green-500/30 bg-transparent hover:bg-green-500/30 text-green-400 hover:text-zinc-200",
        rejected:"border border-red-500/30 bg-transparent hover:bg-red-500/30 text-red-400 hover:text-zinc-200",
        draft:"border border-zinc-200/30 bg-transparent hover:bg-zinc-200/30 text-zinc-300 hover:text-zinc-100",
        archived:"border border-cyan-500/30 bg-transparent hover:bg-cyan-500/30 text-cyan-400 hover:text-zinc-200",
        "in-review":"border border-yellow-500/30 bg-transparent hover:bg-yellow-500/30 text-yellow-400 hover:text-zinc-200",
    };

    const label=status.charAt(0).toUpperCase()+status.slice(1).replace("-"," ");

    return(
        <span className={`text-sm px-4 py-2 rounded-full ${styles[status]}`}>
            {label}
        </span>
    );
}

export default StatusBadge;