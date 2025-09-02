import React from 'react';
import { FaHome, FaBook, FaEnvelope, FaChalkboardTeacher, FaUsers, FaStar } from 'react-icons/fa';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar d-flex flex-column p-3">
        <h2 className="mb-4">AI Edu Platform</h2>
        <nav className="nav flex-column mb-auto">
          <a href="#inicio" className="nav-link">
            <FaHome className="me-2" /> Inicio
          </a>
          <a href="#cursos" className="nav-link">
            <FaBook className="me-2" /> Cursos
          </a>
          <a href="#contacto" className="nav-link">
            <FaEnvelope className="me-2" /> Contacto
          </a>
        </nav>
        <footer className="mt-auto pt-3 border-top">
          <small>
            © 2025 AI EdTech. Todos los derechos reservados.<br />
            <a href="#terminos">Términos</a> | <a href="#privacidad">Privacidad</a>
          </small>
        </footer>
      </aside>

      {/* Contenido principal */}
      <main className="main-content p-4">
        {/* Hero */}
        <section id="inicio" className="hero text-center py-5">
          <h1 className="display-4 fw-bold">Aprende con IA, crece sin límites</h1>
          <p className="lead text-muted mb-4">
            Cursos interactivos y personalizados para potenciar tu aprendizaje.
          </p>
          <a href="#cursos" className="btn btn-primary btn-lg">
            Explorar cursos
          </a>
        </section>

        {/* Beneficios */}
        <section className="benefits py-5">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <FaBook size={40} className="mb-3 text-primary" />
                <h3>Contenido actualizado</h3>
                <p>Siempre al día con las últimas tendencias y tecnologías.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <FaChalkboardTeacher size={40} className="mb-3 text-primary" />
                <h3>Aprende a tu ritmo</h3>
                <p>Accede a los cursos desde cualquier lugar y dispositivo.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <FaUsers size={40} className="mb-3 text-primary" />
                <h3>Soporte personalizado</h3>
                <p>Resuelve tus dudas con tutores y comunidad activa.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cursos destacados */}
        <section id="cursos" className="featured-courses py-5">
          <h2 className="text-center mb-5">Cursos destacados</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-custom p-3 h-100 text-center">
                <img src="https://via.placeholder.com/300x180" alt="Curso 1" className="img-fluid rounded mb-3" />
                <h4>Introducción a la IA</h4>
                <p>Aprende los fundamentos de la inteligencia artificial.</p>
                <a href="#inscribirse" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom p-3 h-100 text-center">
                <img src="https://via.placeholder.com/300x180" alt="Curso 2" className="img-fluid rounded mb-3" />
                <h4>Machine Learning Avanzado</h4>
                <p>Profundiza en modelos y técnicas de aprendizaje automático.</p>
                <a href="#inscribirse" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom p-3 h-100 text-center">
                <img src="https://via.placeholder.com/300x180" alt="Curso 3" className="img-fluid rounded mb-3" />
                <h4>Desarrollo Web con React</h4>
                <p>Crea aplicaciones web modernas y escalables.</p>
                <a href="#inscribirse" className="btn btn-outline-primary">Ver más</a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="testimonials py-5 bg-light rounded">
          <h2 className="text-center mb-5">Lo que dicen nuestros estudiantes</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <FaStar className="text-warning mb-2" size={24} />
                <p>"La plataforma me ayudó a conseguir mi primer trabajo en tecnología."</p>
                <small>- Ana G.</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <FaStar className="text-warning mb-2" size={24} />
                <p>"Los cursos son claros, prácticos y actualizados."</p>
                <small>- Carlos M.</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-custom p-4 h-100 text-center">
                <FaStar className="text-warning mb-2" size={24} />
                <p>"Aprendí a mi ritmo y con el apoyo de una gran comunidad."</p>
                <small>- Laura P.</small>
              </div>
            </div>
          </div>
        </section>

        {/* Footer extendido */}
        <footer id="contacto" className="footer-extended py-4 mt-5 border-top">
          <div className="row">
            <div className="col-md-6">
              <h5>AI Edu Platform</h5>
              <p>Impulsando el aprendizaje con inteligencia artificial.</p>
            </div>
            <div className="col-md-3">
              <h6>Enlaces</h6>
              <ul className="list-unstyled">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#cursos">Cursos</a></li>
                <li><a href="#contacto">Contacto</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Contacto</h6>
              <p>Email: info@aiedu.com</p>
              <p>Tel: +57 300 000 0000</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
