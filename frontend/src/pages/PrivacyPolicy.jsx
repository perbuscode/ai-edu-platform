// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      lastUpdated="14 de Septiembre de 2025"
    >
      <h2>1. Introducción</h2>
      <p>
        Edvance ("nosotros", "nuestro") se compromete a proteger su privacidad.
        Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos
        y salvaguardamos su información cuando utiliza nuestra plataforma ("la
        Plataforma").
      </p>

      <h2>2. Información que Recopilamos</h2>
      <p>
        Podemos recopilar información personal que usted nos proporciona
        directamente, como su nombre, dirección de correo electrónico y datos de
        progreso académico. También recopilamos información automáticamente a
        través de cookies y tecnologías similares, como su dirección IP y
        comportamiento de navegación.
      </p>

      <h2>3. Cómo Usamos Su Información</h2>
      <p>Utilizamos la información recopilada para:</p>
      <ul>
        <li>Proporcionar, operar y mantener nuestra Plataforma.</li>
        <li>Personalizar y mejorar su experiencia de aprendizaje.</li>
        <li>
          Comunicarnos con usted, incluyendo el envío de correos electrónicos
          administrativos y de marketing.
        </li>
        <li>
          Analizar el uso de la Plataforma para mejorar nuestros servicios.
        </li>
      </ul>

      {/* ... (el resto de las secciones se mantienen igual) ... */}

      <h2>8. Contacto</h2>
      <p>
        Si tiene alguna pregunta sobre esta Política de Privacidad, por favor
        contáctenos a través de nuestro{" "}
        <Link to="/contact" className="text-sky-400 hover:underline">
          formulario de contacto
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
