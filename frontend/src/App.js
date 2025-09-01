export default function App() {
  return (
    <main style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f9fafb',
      color: '#111827',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          AI Edu Project 🎓
        </h1>
        <h1 className="text-3xl font-bold underline">
          Hola Tailwind
        </h1>
        <h2 style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>
          Aprendizaje personalizado impulsado por IA
        </h2>
        <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '2rem' }}>
          Crea, evalúa y certifica cursos de forma automática con tecnología modular y escalable.
        </p>
        <button style={{
          backgroundColor: '#2563eb',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Probar demo
        </button>
      </section>

      {/* Beneficios */}
      <section style={{ marginTop: '4rem', maxWidth: '800px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          ¿Por qué elegirnos?
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, color: '#374151' }}>
          <li>✅ Cursos generados por IA adaptados a cada estudiante</li>
          <li>✅ Evaluaciones automáticas con retroalimentación inmediata</li>
          <li>✅ Certificación digital al completar el curso</li>
        </ul>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Última actualización: {new Date().toLocaleString()}
      </footer>
    </main>
  );
}
