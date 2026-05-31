// ─── Load SheetJS dynamically ───────────────────────────────────────────────
(function loadSheetJS() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  document.head.appendChild(script);
})();

// ─── Form submit handler ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  const form  = document.getElementById('registroForm');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const restaurante = document.getElementById('restaurante').value.trim();
    const ubicacion   = document.getElementById('ubicacion').value.trim();
    const cocina      = document.getElementById('cocina').value.trim();
    const redes       = document.getElementById('redes').value.trim();
    const correo      = document.getElementById('correo').value.trim();

    if (!restaurante || !ubicacion || !cocina || !redes || !correo) {
      alert('Por favor completa todos los campos antes de inscribirte.');
      return;
    }

    exportToExcel({ restaurante, ubicacion, cocina, redes, correo });

    toast.style.display = 'block';
    setTimeout(function () {
      toast.style.display = 'none';
    }, 3500);

    form.reset();
  });

});

// ─── Export to Excel ─────────────────────────────────────────────────────────
function exportToExcel(data) {
  const headers = [
    'Nombre del Restaurante',
    'Ubicación',
    'Tipo de Cocina',
    'Redes Sociales',
    'Correo Electrónico',
    'Fecha de Registro'
  ];

  const fecha = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const row = [
    data.restaurante,
    data.ubicacion,
    data.cocina,
    data.redes,
    data.correo,
    fecha
  ];

  const wb = XLSX.utils.book_new();
  const wsData = [headers, row];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [
    { wch: 28 },
    { wch: 22 },
    { wch: 22 },
    { wch: 25 },
    { wch: 30 },
    { wch: 22 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Negocios');

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, 'Inscripcion_Negocio_' + timestamp + '.xlsx');
}
