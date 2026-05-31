// ─── Load SheetJS dynamically ───────────────────────────────────────────────
(function loadSheetJS() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  document.head.appendChild(script);
})();

// ─── Form submit handler ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('registroForm');
  const toast = document.getElementById('toast');
  const hero = document.querySelector('.hero');
  const formSection = document.querySelector('.form-section');
  const inputs = Array.from(document.querySelectorAll('#registroForm input'));

  window.requestAnimationFrame(() => {
    hero.classList.add('visible');
    formSection.classList.add('visible');
  });

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.toggle('filled', input.value.trim().length > 0);
    });

    input.addEventListener('blur', () => {
      input.classList.toggle('filled', input.value.trim().length > 0);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const instagram = document.getElementById('instagram').value.trim();
    const tiktok   = document.getElementById('tiktok').value.trim();
    const correo   = document.getElementById('correo').value.trim();

    // Validate all fields filled
    if (!nombre || !telefono || !instagram || !tiktok || !correo) {
      const invalidField = inputs.find(input => !input.value.trim());
      if (invalidField) {
        invalidField.classList.add('invalid');
        setTimeout(() => invalidField.classList.remove('invalid'), 300);
        invalidField.focus();
      }
      return;
    }

    exportToExcel({ nombre, telefono, instagram, tiktok, correo });

    // Show toast
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);

    form.reset();
    inputs.forEach(input => input.classList.remove('filled'));
  });

});

// ─── Export to Excel ─────────────────────────────────────────────────────────
function exportToExcel(data) {
  const headers = [
    'Nombre y Apellidos',
    'N° de Teléfono',
    'Usuario de Instagram',
    'Usuario de TikTok',
    'Correo Electrónico',
    'Fecha de Registro'
  ];

  const fecha = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const row = [
    data.nombre,
    data.telefono,
    data.instagram,
    data.tiktok,
    data.correo,
    fecha
  ];

  // Build workbook
  const wb = XLSX.utils.book_new();
  const wsData = [headers, row];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws['!cols'] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 22 },
    { wch: 22 },
    { wch: 30 },
    { wch: 22 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Inscripciones');

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, 'Inscripcion_' + timestamp + '.xlsx');
}
