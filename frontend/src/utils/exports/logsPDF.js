import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportLogsToPDF = (usuario, logs) => {
  const doc = new jsPDF();
  const fechaGeneracion = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.setTextColor(33, 37, 41);
  doc.text('MediTrack - Registro de Toma de Medicación', 14, 20);

  doc.setFontSize(11);
  doc.text(`Nombre del Paciente: ${usuario.nombre} ${usuario.apellidos || ''}`, 14, 30);
  doc.text(`Fecha de generación: ${fechaGeneracion}`, 14, 36);

  const tableColumn = ['Medicamento', 'Programada', 'Confirmada', 'Estado', 'Aviso'];
  const tableRows = logs.map((log) => [
    log.prescription?.medicationName || '—',
    new Date(log.scheduledTime).toLocaleString(),
    log.status === 'confirmed'
      ? new Date(log.confirmedAt).toLocaleString()
      : '—',
    log.status === 'confirmed' ? 'Confirmado' : 'Pendiente',
    log.status === 'confirmed'
      ? '—'
      : log.wasNotified === true ? 'Avisado' : 'Pendiente',
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] },
  });

  const finalY = doc.lastAutoTable?.finalY || 80;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Este documento fue generado automáticamente por MediTrack.', 14, finalY + 10);

  doc.save('registro_tomas.pdf');
};
