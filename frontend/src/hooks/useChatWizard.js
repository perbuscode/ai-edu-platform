// src/hooks/useChatWizard.js
import { useState } from "react";
import { generatePlan } from "../services/planService";

// Pasos de la conversación
const STEPS = [
  "¡Hola! Cuéntame tu objetivo de aprendizaje (ej: Aprender React, Data Analyst, Inglés B2…)",
  "¿Cuál es tu nivel actual? (Ninguno /Básico / Intermedio / Avanzado)",
  "¿Cuántas horas por semana puedes dedicar? (número entero)",
  "¿En cuántas semanas quieres lograrlo? (número entero)",
];

export default function useChatWizard() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    { role: "assistant", content: STEPS[0] },
  ]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Datos recopilados del usuario
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [weeks, setWeeks] = useState("");

  async function submitTurn(userText) {
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    if (step === 0) {
      setObjective(userText);
      nextStep(1);
    } else if (step === 1) {
      setLevel(userText);
      nextStep(2);
    } else if (step === 2) {
      setHoursPerWeek(userText);
      nextStep(3);
    } else if (step === 3) {
      setWeeks(userText);
      setLoadingPlan(true);

      // 🔥 Conversión explícita a número antes de enviar
      const payload = {
        objective,
        level,
        hoursPerWeek: Number(hoursPerWeek),
        weeks: Number(userText),
      };

      try {
        const plan = await generatePlan(payload);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "¡Excelente! He preparado tu plan de estudio. Se abrirá en una ventana para que lo revises.",
            plan,
          },
        ]);
      } catch (err) {
        console.error("[useChatWizard] Error generando plan:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "No pude generar el plan ahora mismo. Intenta de nuevo en un momento o revisa tu conexión.",
          },
        ]);
      } finally {
        setLoadingPlan(false);
      }
    }
  }

  function nextStep(next) {
    setStep(next);
    if (next < STEPS.length) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: STEPS[next] },
      ]);
    }
  }

  return {
    step,
    messages,
    loadingPlan,
    submitTurn,
  };
}
