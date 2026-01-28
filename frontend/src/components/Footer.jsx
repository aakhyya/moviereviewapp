function Footer() {
  return (
    <footer className="relative z-10 bg-black/25 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="space-y-1">
          <p className="text-sm font-serif tracking-wide text-zinc-300">
            SCREENED
          </p>

          <p className="text-xs tracking-wide text-zinc-500">
            Curated film criticism
          </p>

          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
