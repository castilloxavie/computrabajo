
/**
 * Convierte un texto relativo de fecha (ej: "Hace 7 horas") en formato MySQL
 * @param fechaTexto Texto con la fecha (ej: "Hace 7 horas")
 * @returns Fecha en formato "YYYY-MM-DD HH:mm:ss"
 */
export function convertirFecha(fechaTexto: string): string {
  const ahora: Date = new Date();
  const fecha: Date = new Date(ahora);

  if (!fechaTexto) {
    return ahora.toISOString().slice(0, 19).replace("T", " ");
  }

  // Normalizar texto
  fechaTexto = fechaTexto.toLowerCase().trim();

  // Detectar unidades de tiempo
  if (fechaTexto.includes("hora")) {
    const horas = parseInt(fechaTexto.match(/\d+/)?.[0] || "0", 10);
    fecha.setHours(ahora.getHours() - horas);
  } else if (fechaTexto.includes("día")) {
    const dias = parseInt(fechaTexto.match(/\d+/)?.[0] || "0", 10);
    fecha.setDate(ahora.getDate() - dias);
  } else if (fechaTexto.includes("semana")) {
    const semanas = parseInt(fechaTexto.match(/\d+/)?.[0] || "0", 10);
    fecha.setDate(ahora.getDate() - (semanas * 7));
  } else if (fechaTexto.includes("mes")) {
    const meses = parseInt(fechaTexto.match(/\d+/)?.[0] || "0", 10);
    fecha.setMonth(ahora.getMonth() - meses);
  } else if (fechaTexto.includes("año")) {
    const anios = parseInt(fechaTexto.match(/\d+/)?.[0] || "0", 10);
    fecha.setFullYear(ahora.getFullYear() - anios);
  } else {
    // fallback: usar la fecha actual
    return ahora.toISOString().slice(0, 19).replace("T", " ");
  }

  return fecha.toISOString().slice(0, 19).replace("T", " ");
}
