// src/pages/TermsAndConditions.jsx
import React from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../LegalLayout";

export default function TermsAndConditions() {
  return (
    <LegalLayout
      title="Términos y Condiciones"
      lastUpdated="14 de Septiembre de 2025"
    >
      <h2>1. Aceptación de los Términos</h2>
      <p>
        Al acceder y utilizar la plataforma Edvance ("la Plataforma"), usted
        acepta estar sujeto a estos Términos y Condiciones ("Términos"). Si no
        está de acuerdo con alguna parte de los términos, no podrá utilizar
        nuestros servicios.
      </p>

      <h2>2. Descripción del Servicio</h2>
      <p>
        Edvance es una plataforma educativa basada en inteligencia artificial
        que ofrece planes de estudio personalizados, generación de contenido,
        tutoría virtual y certificación. Los servicios se proporcionan "tal
        cual" y "según disponibilidad".
      </p>

      <h2>3. Cuentas de Usuario</h2>
      <p>
        Para acceder a ciertas funciones, debe crear una cuenta. Usted es
        responsable de mantener la confidencialidad de su contraseña y de todas
        las actividades que ocurran en su cuenta. Se compromete a notificar a
        Edvance inmediatamente sobre cualquier uso no autorizado de su cuenta.
      </p>

      <h2>4. Propiedad Intelectual</h2>
      <p>
        Todo el contenido generado por la Plataforma, incluyendo planes de
        estudio, lecciones y materiales, es propiedad de Edvance o sus
        licenciantes. Se le concede una licencia limitada, no exclusiva y no
        transferible para usar el contenido con fines personales y no
        comerciales.
      </p>

      {/* ... (el resto de las secciones se mantienen igual) ... */}

      <h2>8. Contacto</h2>
      <p>
        Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a
        través de nuestro{" "}
        <Link to="/contact" className="text-sky-400 hover:underline">
          formulario de contacto
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
