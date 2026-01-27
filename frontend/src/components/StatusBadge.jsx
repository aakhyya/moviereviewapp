function StatusBadge({ status }) {
  const styles = {
    published:
      "border-green-500/40 text-zinc-100 hover:bg-white-200/10",
    "in-review":
      "border-yellow-500/40 text-zinc-200 hover:bg-white-200/10",
    draft:
      "border-zinc-500/40 text-zinc-300 hover:bg-white-200/10",
    rejected:
      "border-red-500/40 text-zinc-400 hover:bg-white-200/10",
    archived:
      "border-cyan-500/40 text-zinc-500 hover:bg-white-200/10",
  };

  const label =
    status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");

  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-[5px]
        text-[11px] tracking-widest
        rounded-full
        border
        bg-black/30
        backdrop-blur-sm
        transition-all duration-200
        hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]
        ${styles[status]}
      `}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
