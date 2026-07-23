export default function Navbar() {
  return (
    <header className="navbar">
      <div className="flex items-center gap-3">
        {/* Espacio para el logo oficial de la universidad/Fab Lab.
            Reemplaza este div por <img src="/logo.svg" alt="..." /> cuando
            tengan el archivo real — no recreamos logos de terceros aquí. */}
        <div className="logo-slot">LOGO</div>
        <div className="brand-text font-mono text-[10.5px] leading-tight text-muted">
          <b>Universidad Continental</b><br />Fab Lab · IMAGYNER PROJECT
        </div>
      </div>

    </header>
  );
}