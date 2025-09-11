// frontend/src/data/materials.mock.js
// Mock de materiales de un curso

export const mockMaterials = [
  {
    id: "mat-1",
    type: "pdf",
    title: "Apuntes de la clase (PDF)",
    size: "2.3 MB",
    duration: null,
    visto: false,
    descargado: false,
  },
  {
    id: "mat-2",
    type: "zip",
    title: "Código de ejemplo (ZIP)",
    size: "1.1 MB",
    duration: null,
    visto: false,
    descargado: false,
  },
  {
    id: "mat-3",
    type: "mp4",
    title: "Bonus: Tips de productividad (MP4)",
    size: "120 MB",
    duration: "08:45",
    visto: false,
    descargado: false,
  },
];

// Helpers simples para simular tracking en el mock
export function markMaterialSeen(id) {
  const it = mockMaterials.find((m) => m.id === id);
  if (it) it.visto = true;
  return it ?? null;
}

export function markMaterialDownloaded(id) {
  const it = mockMaterials.find((m) => m.id === id);
  if (it) it.descargado = true;
  return it ?? null;
}

