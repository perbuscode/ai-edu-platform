function App() {
  return (
    <div className="container py-5">
      <header className="text-center mb-5 py-5 bg-light rounded shadow-sm">
        <h1 className="display-4 fw-bold text-primary">AI EdTech Platform</h1>
        <p className="lead text-secondary">Aprende más rápido con inteligencia artificial</p>
        <a href="#cta" className="btn btn-primary btn-lg mt-3 px-4">Comenzar ahora</a>
      </header>

      <section className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Aprendizaje Personalizado</h5>
              <p className="card-text">Contenido adaptado a tu ritmo y estilo de aprendizaje.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Recursos Interactivos</h5>
              <p className="card-text">Ejercicios y evaluaciones en tiempo real.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Progreso Medible</h5>
              <p className="card-text">Estadísticas claras para seguir tu avance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="text-center mt-5">
        <h2>¿Listo para empezar?</h2>
        <a href="#" className="btn btn-success btn-lg mt-3">Crear cuenta</a>
      </section>
    </div>
  );
}

export default App;
