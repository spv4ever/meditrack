import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportRecetasToPDF = (usuario, recetas) => {
  const doc = new jsPDF();
  const fechaGeneracion = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.setTextColor(33, 37, 41);
  doc.text('MediTrack - Informe de Medicación', 14, 20);

  doc.setFontSize(11);
  doc.text(`Nombre del Paciente: ${usuario.nombre} ${usuario.apellidos || ''}`, 14, 30);
  doc.text(`Fecha de generación: ${fechaGeneracion}`, 14, 36);

  const tableColumn = ['Medicamento', 'Dosis', 'Frecuencia', 'Hora Inicio', 'Inicio', 'Fin'];
  const tableRows = recetas.map((receta) => [
    receta.medicationName,
    receta.dosage,
    `${receta.frequency}x/${receta.intervaloHoras}h`,
    receta.startHour,
    new Date(receta.startDate).toLocaleDateString(),
    new Date(receta.endDate).toLocaleDateString(),
  ]);

  autoTable(doc,{
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'striped',
    headStyles: { fillColor: [22, 160, 133] },
  });

  const finalY = doc.lastAutoTable.finalY || 80;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Este documento fue generado automáticamente por MediTrack.', 14, finalY + 10);

  doc.save('informe_recetas.pdf');
};
