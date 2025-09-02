import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { FaBook, FaChalkboardTeacher, FaUsers, FaStar } from 'react-icons/fa';
import './App.css';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Hero */}
          <section id="inicio" className="hero text-center py-5">
            <h1 className="text-4xl font-bold mb-4">Aprende con IA, crece sin límites</h1>
            <p className="text-lg text-gray-600 mb-6">
              Cursos interactivos y personalizados para potenciar tu aprendizaje.
            </p>
            <a href="#cursos" className="bg-blue-700 text-white px-6 py-3 rounded hover:bg-blue-800">
              Explorar cursos
            </a>
          </section>

          {/* Beneficios */}
          <section className="benefits py-10">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white shadow rounded text-center">
                <FaBook size={40} className="mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-xl">Contenido actualizado</h3>
                <p>Siempre al día con las últimas tendencias y tecnologías.</p>
              </div>
              <div className="p-6 bg-white shadow rounded text-center">
                <FaChalkboardTeacher size={40} className="mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-xl">Aprende a tu ritmo</h3>
                <p>Accede a los cursos desde cualquier lugar y dispositivo.</p>
              </div>
              <div className="p-6 bg-white shadow rounded text-center">
                <FaUsers size={40} className="mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-xl">Soporte personalizado</h3>
                <p>Resuelve tus dudas con tutores y comunidad activa.</p>
              </div>
            </div>
          </section>

          {/* Cursos destacados */}
          <section id="cursos" className="featured-courses py-10">
            <h2 className="text-3xl font-bold text-center mb-8">Cursos destacados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-4 bg-white shadow rounded text-center">
                <img src="https://via.placeholder.com/300x180" alt="Curso 1" className="rounded mb-4 mx-auto" />
                <h4 className="font-semibold text-lg mb-2">Introducción a la IA</h4>
                <p>Aprende los fundamentos de la inteligencia artificial.</p>
                <a href="#inscribirse" className="text-blue-600 mt-3 inline-block">Ver más</a>
              </div>
              <div className="p-4 bg-white shadow rounded text-center">
                <img src="https://via.placeholder.com/300x180" alt="Curso 2" className="rounded mb-4 mx-auto" />
                <h4 className="font-semibold text-lg mb-2">Machine Learning Avanzado</h4>
                <p>Profundiza en modelos y técnicas de aprendizaje automático.</p>
                <a href="#inscribirse" className="text-blue-600 mt-3 inline-block">Ver más</a>
              </div>
              <div className="p-4 bg-white shadow rounded text-center">
                <img src="https://via.placeholder.com/300x180" alt="Curso 3" className="rounded mb-4 mx-auto" />
                <h4 className="font-semibold text-lg mb-2">Desarrollo Web con React</h4>
                <p>Crea aplicaciones web modernas y escalables.</p>
                <a href="#inscribirse" className="text-blue-600 mt-3 inline-block">Ver más</a>
              </div>
            </div>
          </section>

          {/* Testimonios */}
          <section className="testimonials py-10 bg-gray-100 rounded">
            <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros estudiantes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white shadow rounded text-center">
                <FaStar className="text-yellow-400 mb-2 mx-auto" size={24} />
                <p>"La plataforma me ayudó a conseguir mi primer trabajo en tecnología."</p>
                <small>- Ana G.</small>
              </div>
              <div className="p-6 bg-white shadow rounded text-center">
                <FaStar className="text-yellow-400 mb-2 mx-auto" size={24} />
                <p>"Los cursos son claros, prácticos y actualizados."</p>
                <small>- Carlos M.</small>
              </div>
              <div className="p-6 bg-white shadow rounded text-center">
                <FaStar className="text-yellow-400 mb-2 mx-auto" size={24} />
                <p>"Aprendí a mi ritmo y con el apoyo de una gran comunidad."</p>
                <small>- Laura P.</small>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
