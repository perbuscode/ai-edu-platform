import React from 'react';

const courses = [
  {
    title: "Introducción a la IA",
    description: "Fundamentos de inteligencia artificial desde cero.",
    image: "https://via.placeholder.com/300x180",
    link: "#"
  },
  {
    title: "Machine Learning Avanzado",
    description: "Modelos supervisados, no supervisados y deep learning.",
    image: "https://via.placeholder.com/300x180",
    link: "#"
  },
  {
    title: "Desarrollo Web con React",
    description: "Crea aplicaciones web modernas y escalables.",
    image: "https://via.placeholder.com/300x180",
    link: "#"
  }
];

const FeaturedCourses = () => {
  return (
    <section id="cursos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
          Cursos destacados
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <a
                  href={course.link}
                  className="inline-block text-blue-700 font-semibold hover:underline"
                >
                  Ver más →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
