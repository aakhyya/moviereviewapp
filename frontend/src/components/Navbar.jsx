function Navbar(){
    return(
    <nav className="border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Screened</h2>
        <span className="text-sm text-zinc-400">Viewer</span>
      </div>
    </nav>
    );
}

export default Navbar;