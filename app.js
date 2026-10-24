/**
 * ATENDO - PANEL DE CONTROL Y OPERACIONES IA (CONTROLLER)
 * Arquitectura Anti-Fricción: Agentes de Voz y Automatización WhatsApp
 */

// ==========================================================================
// 1. GESTIÓN Y PERSISTENCIA DE TEMA (MODO CLARO / OSCURO)
// ==========================================================================
const ThemeEngine = {
  themeMeta: document.querySelector('meta[name="color-scheme"]'),
  toggleBtn: document.getElementById('themeToggleBtn'),
  themeTextLabel: document.getElementById('themeTextLabel'),
  STORAGE_KEY: 'atendo_theme',

  init() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.updateUI(currentTheme);

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Atajo de teclado 'T'
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        if (!document.querySelector('.modal-backdrop.active, .command-palette-backdrop.active')) {
          e.preventDefault();
          this.toggleTheme();
        }
      }
    });

    // Sincronizar preferencia del sistema si el usuario no ha elegido manualmente
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  toggleTheme() {
    const current = this.getCurrentTheme();
    const target = current === 'dark' ? 'light' : 'dark';

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        this.applyTheme(target);
      });
    } else {
      this.applyTheme(target);
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (this.themeMeta) {
      this.themeMeta.content = theme;
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateUI(theme);
    Toast.show(`Tema visual: ${theme === 'dark' ? 'Modo Oscuro (Carbon)' : 'Modo Claro (Ivory)'}`, 'info');
  },

  updateUI(theme) {
    if (this.themeTextLabel) {
      this.themeTextLabel.textContent = theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro';
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
    }
  }
};

// ==========================================================================
// 2. SISTEMA DE NOTIFICACIONES TOAST
// ==========================================================================
const Toast = {
  container: document.getElementById('toastContainer'),

  show(message, type = 'info', duration = 3200) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    if (type === 'success') {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
};

// ==========================================================================
// 3. BASE DE DATOS MULTI-GIRO (RESTAURANTE, CLÍNICA, INMOBILIARIA, ETC.)
// ==========================================================================
const GiroDataConfig = {
  restaurante: {
    name: 'Trattoria Bella Napoli',
    label: 'Restaurante & Delivery • Plan Pro',
    phone: '+52 (55) 9225-4012',
    agentName: 'Valeria (Agente Atendo IA)',
    kbDoc: 'Menú_Precios_Octubre_2026.pdf',
    kbPages: '14 páginas aprendidas con recetas y tiempos de cocina',
    interactions: '1,429',
    sales: '$84,320',
    automation: '98.4%',
    savedTime: '46.5 horas',
    dialogues: [
      { speaker: 'Valeria', text: '¡Hola! Buenas tardes, gracias por comunicarte con Trattoria Bella Napoli. ¿Te gustaría ordenar a domicilio o tienes alguna duda sobre nuestra carta?' },
      { speaker: 'Cliente', text: 'Hola, buenas tardes. ¿Tienen disponible la pizza Diavola en tamaño grande?' },
      { speaker: 'Valeria', text: '¡Sí, por supuesto! La pizza Diavola grande cuesta $280 pesos y lleva pepperoni artesanal con queso mozzarella fresco. ¿Deseas agregar alguna bebida o postre a tu orden?' },
      { speaker: 'Cliente', text: 'Sí, agrega un refresco de lata y salsa de la casa por favor.' },
      { speaker: 'Valeria', text: 'Excelente. Tu orden es: 1 Pizza Diavola grande, 1 refresco y salsa de la casa. Total $345 pesos. ¿A qué dirección te lo enviamos?' }
    ],
    items: [
      {
        id: 'AT-9021',
        client: 'Carlos Mendoza',
        phone: '+52 55 9182 3401',
        channel: 'Voz IA (2m 14s)',
        channelType: 'pedidos',
        time: 'Hoy, 14:22',
        detail: 'Pizza Diavola grande + Refresco + Salsa de la casa',
        status: 'Pedido Confirmado',
        statusType: 'success',
        amount: 345.00,
        currency: 'MXN',
        sentiment: 'Muy Satisfecho (98%)',
        transcript: 'Cliente ordenó a domicilio a Roma Norte. Tiempo de entrega prometido: 35 min. Pago con tarjeta contra entrega.'
      },
      {
        id: 'AT-9020',
        client: 'Mariana Soto',
        phone: '+52 55 4910 8271',
        channel: 'WhatsApp IA',
        channelType: 'whatsapp',
        time: 'Hoy, 13:45',
        detail: 'Consulta de opciones veganas y reserva mesa para 4 personas',
        status: 'Mesa #6 Reservada',
        statusType: 'success',
        amount: 1200.00,
        currency: 'MXN',
        sentiment: 'Positivo (95%)',
        transcript: 'IA confirmó mesa en terraza para hoy a las 20:30 hrs y envió menú digital en PDF por WhatsApp.'
      },
      {
        id: 'AT-9019',
        client: 'Roberto Garza',
        phone: '+52 55 3302 9182',
        channel: 'Voz IA (1m 18s)',
        channelType: 'pedidos',
        time: 'Hoy, 12:50',
        detail: 'Pregunta por estacionamiento con valet parking y descorche',
        status: 'Consulta Resuelta',
        statusType: 'info',
        amount: 0.00,
        currency: 'MXN',
        sentiment: 'Neutral (88%)',
        transcript: 'Se le informó que el valet parking es en cortesía y el descorche tiene costo de $250 por botella.'
      },
      {
        id: 'AT-9018',
        client: 'Dra. Elena Vega',
        phone: '+52 55 8812 0491',
        channel: 'Voz IA (3m 05s)',
        channelType: 'pedidos',
        time: 'Hoy, 11:15',
        detail: 'Pedido corporativo: 8 Pizzas surtidas para despacho',
        status: 'En Cocina / Despacho',
        statusType: 'success',
        amount: 2480.00,
        currency: 'MXN',
        sentiment: 'Excelente (99%)',
        transcript: 'Factura CFDI 4.0 solicitada con RFC enviado por WhatsApp tras llamada. Comanda en cocina número #402.'
      }
    ]
  },

  clinica: {
    name: 'Centro Odontológico Dentalis',
    label: 'Clínica Dental & Ortodoncia • Plan Pro',
    phone: '+52 (55) 8431-9011',
    agentName: 'Sofía (Agente de Citas Atendo)',
    kbDoc: 'Tratamientos_y_Seguros_2026.pdf',
    kbPages: '8 páginas de aranceles, aseguradoras y preparaciones previas',
    interactions: '892',
    sales: '$118,500',
    automation: '96.8%',
    savedTime: '38.2 horas',
    dialogues: [
      { speaker: 'Sofía', text: '¡Buen día! Gracias por comunicarte con Centro Dentalis. ¿Deseas agendar una valoración o tienes alguna pregunta sobre un tratamiento?' },
      { speaker: 'Cliente', text: 'Hola, tengo dolor en una muela y quería saber si tienen cita hoy por la tarde.' },
      { speaker: 'Sofía', text: 'Lamento mucho el malestar. Contamos con un espacio para valoración urgente hoy a las 16:30 hrs con el Dr. Ramos en nuestra sucursal Del Valle. ¿Te aparto ese horario?' },
      { speaker: 'Cliente', text: 'Sí por favor, a nombre de Patricia Alarcón.' },
      { speaker: 'Sofía', text: 'Queda confirmada tu cita urgente hoy a las 16:30 hrs, Patricia. Te enviamos recordatorio y ubicación exacta a tu WhatsApp.' }
    ],
    items: [
      {
        id: 'AT-8105',
        client: 'Patricia Alarcón',
        phone: '+52 55 2109 4432',
        channel: 'Voz IA (1m 45s)',
        channelType: 'citas',
        time: 'Hoy, 14:10',
        detail: 'Cita urgente por molestia dental molar: Dr. Ramos',
        status: 'Cita Agendada 16:30',
        statusType: 'success',
        amount: 850.00,
        currency: 'MXN',
        sentiment: 'Muy Agradecida (96%)',
        transcript: 'Triaje realizado: sin inflamación visible. Cupo confirmado en consultorio 2.'
      },
      {
        id: 'AT-8104',
        client: 'Lic. Fernando Ortiz',
        phone: '+52 55 7712 9900',
        channel: 'WhatsApp IA',
        channelType: 'whatsapp',
        time: 'Hoy, 13:20',
        detail: 'Cotización de alineadores invisibles y cobertura seguro GNP',
        status: 'Demo Agendada',
        statusType: 'success',
        amount: 32000.00,
        currency: 'MXN',
        sentiment: 'Interesado (92%)',
        transcript: 'Se enviaron folletos digitales de ortodoncia invisible y se confirmó cita para escaneo 3D el sábado.'
      }
    ]
  },

  inmobiliaria: {
    name: 'Metropolitan Real Estate',
    label: 'Desarrollos Residenciales Polanco • Plan Elite',
    phone: '+52 (55) 7109-2244',
    agentName: 'Mateo (Asesor Inmobiliario IA)',
    kbDoc: 'Brochure_Torre_Skyline_2026.pdf',
    kbPages: '22 páginas de planos, amenidades, enganches y plusvalía',
    interactions: '640',
    sales: '$4,850,000',
    automation: '99.1%',
    savedTime: '62.0 horas',
    dialogues: [
      { speaker: 'Mateo', text: 'Hola, gracias por comunicarte con Metropolitan Real Estate. ¿Te interesa conocer nuestros departamentos en preventa en Torre Skyline Polanco?' },
      { speaker: 'Cliente', text: 'Hola, vi su anuncio en Instagram. ¿Qué precio tienen los departamentos de 2 recámaras?' },
      { speaker: 'Mateo', text: 'Contamos con prototipos de 2 recámaras desde 88 m² a partir de $5.2 millones de pesos, con balcón y 2 cajones de estacionamiento. ¿Te gustaría agendar una visita al departamento muestra este fin de semana?' },
      { speaker: 'Cliente', text: 'Sí, me interesaría el sábado alrededor de las 11:00 am.' },
      { speaker: 'Mateo', text: 'Excelente. Te agendé para el sábado a las 11:00 am con nuestro director comercial. Te comparto el acceso al showroom por WhatsApp.' }
    ],
    items: [
      {
        id: 'AT-7301',
        client: 'Arq. Gustavo Peralta',
        phone: '+52 55 6019 3321',
        channel: 'Voz IA (3m 40s)',
        channelType: 'citas',
        time: 'Hoy, 12:45',
        detail: 'Visita Showroom Torre Skyline: 2 Recámaras 110m²',
        status: 'Visita Agendada Sáb',
        statusType: 'success',
        amount: 5200000.00,
        currency: 'MXN',
        sentiment: 'Lead Calificado A+',
        transcript: 'Capacidad de compra verificada con enganche del 30% listo. Notificación enviada al equipo de ventas.'
      }
    ]
  },

  servicios: {
    name: 'Legal & Fiscal Consultores',
    label: 'Asesoría Corporativa & SAT • Plan Pro',
    phone: '+52 (55) 6049-1123',
    agentName: 'Valentina (Triaje de Consultas IA)',
    kbDoc: 'Catalogo_Servicios_Fiscales_2026.pdf',
    kbPages: '16 páginas de normativas SAT, defensas y honorarios',
    interactions: '520',
    sales: '$142,000',
    automation: '97.5%',
    savedTime: '41.0 horas',
    dialogues: [
      { speaker: 'Valentina', text: 'Buen día, gracias por llamar a Legal & Fiscal Consultores. ¿Requieres asesoría para defensa fiscal, auditoría preventiva o constitución de empresa?' },
      { speaker: 'Cliente', text: 'Hola, nos llegó una notificación de buzón tributario y necesitamos revisarla.' },
      { speaker: 'Valentina', text: 'Comprendo. Podemos agendar una sesión inicial de diagnóstico con nuestro socio fiscal para revisar el documento. ¿Te acomoda una llamada técnica hoy a las 17:00 hrs?' }
    ],
    items: [
      {
        id: 'AT-6102',
        client: 'Ing. Rodrigo Castillo',
        phone: '+52 55 8890 1234',
        channel: 'Voz IA (2m 10s)',
        channelType: 'citas',
        time: 'Hoy, 10:30',
        detail: 'Revisión de requerimiento SAT y opinión de cumplimiento 32-D',
        status: 'Sesión Agendada',
        statusType: 'success',
        amount: 3500.00,
        currency: 'MXN',
        sentiment: 'Urgente / Resuelto',
        transcript: 'Cliente cargó PDF de notificación vía enlace temporal seguro. Socio asignado: Lic. Treviño.'
      }
    ]
  },

  ecommerce: {
    name: 'NovaStyle Streetwear',
    label: 'E-commerce & Retail Moda • Plan Scale',
    phone: '+52 (55) 5519-8800',
    agentName: 'Camila (Soporte y Envíos IA)',
    kbDoc: 'Guia_de_Tallas_y_Devoluciones.pdf',
    kbPages: '10 páginas de políticas DHL/FedEx y tabla de medidas en cm',
    interactions: '2,180',
    sales: '$248,900',
    automation: '99.4%',
    savedTime: '78.5 horas',
    dialogues: [
      { speaker: 'Camila', text: '¡Hola! Gracias por llamar a NovaStyle. ¿Tienes alguna pregunta sobre tu número de guía, cambio de talla o catálogo nuevo?' },
      { speaker: 'Cliente', text: 'Hola, compré unos tenis el martes y quería saber cuándo me llegan.' },
      { speaker: 'Camila', text: 'Con gusto. Tu guía DHL 4920194821 está en ruta de entrega hoy antes de las 18:00 hrs en tu domicilio de Guadalajara.' }
    ],
    items: [
      {
        id: 'AT-5091',
        client: 'Sebastián Morales',
        phone: '+52 55 4120 7865',
        channel: 'Voz IA (1m 02s)',
        channelType: 'pedidos',
        time: 'Hoy, 15:02',
        detail: 'Rastreo de paquete #89421 Sneakers Retro Edición Limitada',
        status: 'En Ruta DHL',
        statusType: 'info',
        amount: 3200.00,
        currency: 'MXN',
        sentiment: 'Satisfecho (100%)',
        transcript: 'Llamada rápida de rastreo resuelta sin intervención humana en 62 segundos.'
      }
    ]
  }
};

// Variable activa del giro actual
let currentGiroKey = 'restaurante';
let activeTransactions = [...GiroDataConfig.restaurante.items];

// ==========================================================================
// 4. CONTROLADOR DE LA TABLA DE OPERACIONES RECIENTES
// ==========================================================================
const TableController = {
  tbody: document.getElementById('callsTableBody'),
  searchInput: document.getElementById('tableSearchInput'),
  filterPills: document.getElementById('statusFilterPills'),
  exportBtn: document.getElementById('btnExportTable'),
  activeFilter: 'all',

  init() {
    this.render();

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.render());
    }

    if (this.filterPills) {
      this.filterPills.addEventListener('click', (e) => {
        const btn = e.target.closest('.status-pill-btn');
        if (!btn) return;
        this.filterPills.querySelectorAll('.status-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter || 'all';
        this.render();
      });
    }

    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => this.exportCSV());
    }
  },

  getFilteredData() {
    const query = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
    return activeTransactions.filter(item => {
      const matchesFilter = this.activeFilter === 'all' || item.channelType === this.activeFilter;
      const matchesQuery = !query ||
        item.client.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.detail.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  },

  render() {
    if (!this.tbody) return;
    const data = this.getFilteredData();

    if (data.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px 20px; color: var(--text-muted);">
            No se encontraron interacciones con el filtro actual.
          </td>
        </tr>
      `;
      return;
    }

    this.tbody.innerHTML = data.map(item => {
      const formattedAmount = item.amount > 0
        ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.amount)
        : '-';

      return `
        <tr class="table-row-clickable" onclick="openInteractionDetail('${item.id}')">
          <td>
            <div class="client-cell">
              <span class="client-name">${item.client}</span>
              <span class="client-phone tabular">${item.phone}</span>
            </div>
          </td>
          <td>
            <div class="channel-cell">
              <span class="channel-badge ${item.channelType}">${item.channel}</span>
            </div>
          </td>
          <td>
            <div class="detail-cell">
              <span class="detail-time">${item.time}</span>
              <span class="detail-desc">${item.detail}</span>
            </div>
          </td>
          <td>
            <span class="status-chip ${item.statusType}">
              ${item.status}
            </span>
          </td>
          <td class="text-right">
            <span class="amount-val ${item.amount > 0 ? 'positive' : 'neutral'} tabular">
              ${formattedAmount}
            </span>
          </td>
          <td class="text-center">
            <button class="btn-table-action" onclick="event.stopPropagation(); openInteractionDetail('${item.id}')" title="Ver audio y transcripción completa">
              Ver detalle
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  exportCSV() {
    const data = this.getFilteredData();
    if (data.length === 0) {
      Toast.show('No hay datos disponibles para exportar', 'error');
      return;
    }

    const headers = ['ID', 'Cliente', 'Telefono', 'Canal', 'Fecha_Hora', 'Detalle', 'Resultado_IA', 'Importe_MXN'];
    const rows = data.map(d => [
      d.id,
      `"${d.client}"`,
      `"${d.phone}"`,
      `"${d.channel}"`,
      `"${d.time}"`,
      `"${d.detail.replace(/"/g, '""')}"`,
      `"${d.status}"`,
      d.amount
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `atendo_reporte_${currentGiroKey}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.show('Reporte CSV exportado exitosamente', 'success');
  }
};

// ==========================================================================
// 5. MOTOR DE GRÁFICO INTERACTIVO (LLAMADAS & WHATSAPP)
// ==========================================================================
const ChartEngine = {
  svg: document.getElementById('interactiveChartSvg'),
  areaPath: document.getElementById('chartAreaPath'),
  linePath: document.getElementById('chartLinePath'),
  pointsGroup: document.getElementById('chartPointsGroup'),
  tooltip: document.getElementById('chartTooltip'),
  wrapper: document.getElementById('chartCanvasWrapper'),
  periodSelector: document.getElementById('timePeriodSelector'),

  dataSets: {
    '7d': [
      { date: '17 Oct', val: 145, ops: 48 },
      { date: '18 Oct', val: 192, ops: 62 },
      { date: '19 Oct', val: 160, ops: 51 },
      { date: '20 Oct', val: 210, ops: 74 },
      { date: '21 Oct', val: 245, ops: 88 },
      { date: '22 Oct', val: 280, ops: 95 },
      { date: 'Hoy', val: 312, ops: 104 }
    ],
    '30d': [
      { date: '1 Oct', val: 110, ops: 35 },
      { date: '5 Oct', val: 160, ops: 52 },
      { date: '9 Oct', val: 195, ops: 64 },
      { date: '13 Oct', val: 230, ops: 79 },
      { date: '17 Oct', val: 275, ops: 91 },
      { date: '21 Oct', val: 295, ops: 98 },
      { date: '23 Oct', val: 342, ops: 115 }
    ],
    '90d': [
      { date: 'Agosto', val: 1840, ops: 610 },
      { date: 'Septiembre', val: 2420, ops: 790 },
      { date: 'Octubre', val: 3150, ops: 980 }
    ],
    '1y': [
      { date: 'Q1 2026', val: 5100, ops: 1680 },
      { date: 'Q2 2026', val: 6800, ops: 2240 },
      { date: 'Q3 2026', val: 8900, ops: 2950 },
      { date: 'Q4 2026', val: 4200, ops: 1400 }
    ]
  },

  init() {
    this.render('30d');

    if (this.periodSelector) {
      this.periodSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.seg-btn');
        if (!btn) return;
        this.periodSelector.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render(btn.dataset.period);
        Toast.show(`Gráfico actualizado: periodo ${btn.textContent}`, 'info');
      });
    }
  },

  render(periodKey) {
    const data = this.dataSets[periodKey] || this.dataSets['30d'];
    const maxVal = Math.max(...data.map(d => d.val)) * 1.15;
    const minVal = 0;
    const width = 760;
    const height = 240;
    const paddingX = 20;
    const paddingY = 20;

    const points = data.map((d, index) => {
      const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((d.val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
      return { x, y, data: d };
    });

    let lineD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      lineD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const areaD = `${lineD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    if (this.linePath) this.linePath.setAttribute('d', lineD);
    if (this.areaPath) this.areaPath.setAttribute('d', areaD);

    if (this.pointsGroup) {
      this.pointsGroup.innerHTML = points.map((p, idx) => `
        <circle class="chart-point" cx="${p.x}" cy="${p.y}" r="4.5" data-idx="${idx}"></circle>
      `).join('');

      this.pointsGroup.querySelectorAll('.chart-point').forEach((circle, idx) => {
        circle.addEventListener('mouseenter', () => this.showTooltip(points[idx]));
        circle.addEventListener('mouseleave', () => this.hideTooltip());
      });
    }
  },

  showTooltip(pointObj) {
    if (!this.tooltip || !this.wrapper) return;
    const ttDate = document.getElementById('ttDate');
    const ttVal = document.getElementById('ttVal');
    const ttOps = document.getElementById('ttOps');

    if (ttDate) ttDate.textContent = pointObj.data.date;
    if (ttVal) ttVal.textContent = `${pointObj.data.val} interacciones`;
    if (ttOps) ttOps.textContent = `${pointObj.data.ops} órdenes / citas cerradas`;

    const pctX = (pointObj.x / 760) * 100;
    const pctY = (pointObj.y / 240) * 100;

    this.tooltip.style.left = `${pctX}%`;
    this.tooltip.style.top = `${pctY}%`;
    this.tooltip.style.opacity = '1';
  },

  hideTooltip() {
    if (this.tooltip) this.tooltip.style.opacity = '0';
  }
};

// ==========================================================================
// 6. SIMULADOR DE LLAMADAS EN VIVO CON AGENTE DE VOZ IA
// ==========================================================================
let callTimerInterval = null;
let callDurationSeconds = 14;
let currentDialogIndex = 0;
let isCallMuted = false;

function openCallSimulatorModal() {
  const modal = document.getElementById('callSimulatorModal');
  if (!modal) return;

  const giro = GiroDataConfig[currentGiroKey] || GiroDataConfig.restaurante;
  currentDialogIndex = 0;
  isCallMuted = false;

  const btnMute = document.getElementById('btnToggleMute');
  if (btnMute) btnMute.classList.remove('muted');

  const transcriptBox = document.getElementById('callLiveTranscript');
  if (transcriptBox && giro.dialogues) {
    transcriptBox.innerHTML = `
      <div class="transcript-msg agent">
        <span class="speaker-tag">${giro.dialogues[0].speaker}:</span>
        <p>${giro.dialogues[0].text}</p>
      </div>
    `;
    currentDialogIndex = 1;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');

  // Iniciar temporizador
  callDurationSeconds = 1;
  updateTimerBadge();
  clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callDurationSeconds++;
    updateTimerBadge();
  }, 1000);

  Toast.show(`Llamada en vivo iniciada con ${giro.agentName}`, 'info');
}

function updateTimerBadge() {
  const badge = document.getElementById('callTimerDisplay');
  if (!badge) return;
  const mins = String(Math.floor(callDurationSeconds / 60)).padStart(2, '0');
  const secs = String(callDurationSeconds % 60).padStart(2, '0');
  badge.textContent = `${mins}:${secs} • En llamada`;
}

function closeCallSimulatorModal() {
  const modal = document.getElementById('callSimulatorModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  clearInterval(callTimerInterval);
  Toast.show('Llamada finalizada: Pedido sincronizado con cocina y CRM', 'success');
}

function simulateNextDialog() {
  const giro = GiroDataConfig[currentGiroKey] || GiroDataConfig.restaurante;
  const transcriptBox = document.getElementById('callLiveTranscript');
  if (!transcriptBox || !giro.dialogues) return;

  if (currentDialogIndex >= giro.dialogues.length) {
    Toast.show('La conversación ha concluido. Puedes colgar para guardar la comanda.', 'info');
    return;
  }

  const d = giro.dialogues[currentDialogIndex];
  const msgEl = document.createElement('div');
  msgEl.className = `transcript-msg ${d.speaker.toLowerCase().includes('cliente') ? 'user' : 'agent'}`;
  msgEl.innerHTML = `
    <span class="speaker-tag">${d.speaker}:</span>
    <p>${d.text}</p>
  `;

  transcriptBox.appendChild(msgEl);
  transcriptBox.scrollTop = transcriptBox.scrollHeight;
  currentDialogIndex++;
}

function toggleMute() {
  isCallMuted = !isCallMuted;
  const btn = document.getElementById('btnToggleMute');
  if (btn) btn.classList.toggle('muted', isCallMuted);
  Toast.show(isCallMuted ? 'Micrófono silenciado' : 'Micrófono activo', 'info');
}

// ==========================================================================
// 7. MODAL DE NUEVO LEAD / DISPARO DE LLAMADA SALIENTE
// ==========================================================================
function openNewLeadModal() {
  const modal = document.getElementById('newLeadModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      document.getElementById('leadName')?.focus();
    }, 100);
  }
}

function closeNewLeadModal() {
  const modal = document.getElementById('newLeadModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function handleNewLeadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('leadName').value;
  const phone = document.getElementById('leadPhone').value;
  const objective = document.getElementById('leadObjective')?.value || 'Confirmar Pedido';

  const submitBtn = document.getElementById('btnSubmitLead');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Valeria marcando a ${phone}...</span>`;

  setTimeout(() => {
    const newInteraction = {
      id: `AT-${Math.floor(1000 + Math.random() * 9000)}`,
      client: name,
      phone: phone,
      channel: 'Llamada Saliente IA',
      channelType: 'pedidos',
      time: 'Hace un momento',
      detail: `Llamada inmediata iniciada: ${objective}`,
      status: 'En Llamada...',
      statusType: 'info',
      amount: 420.00,
      currency: 'MXN',
      sentiment: 'En progreso',
      transcript: `Marcación saliente ejecutada vía Vapi/ElevenLabs. Cliente respondió y está en línea con Valeria.`
    };

    activeTransactions.unshift(newInteraction);
    TableController.render();

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    closeNewLeadModal();

    Toast.show(`Llamada disparada exitosamente a ${name} (${phone})`, 'success');
  }, 900);
}

// ==========================================================================
// 8. DRAWER DE DETALLE DE INTERACCIÓN (SLIDE-OVER)
// ==========================================================================
function openInteractionDetail(itemId) {
  const item = activeTransactions.find(t => t.id === itemId);
  if (!item) return;

  const drawer = document.getElementById('txDetailDrawer');
  const body = document.getElementById('drawerBodyContent');
  if (!drawer || !body) return;

  const formattedAmount = item.amount > 0
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.amount)
    : '$0.00 MXN';

  body.innerHTML = `
    <div style="display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 16px;">
      <div>
        <span style="font-size: 11px; color: var(--text-muted); font-variant-numeric: tabular-nums;">${item.id}</span>
        <h4 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${item.client}</h4>
      </div>
      <span class="amount-val positive tabular" style="font-size: 18px;">
        ${formattedAmount}
      </span>
    </div>

    <!-- Reproductor de Audio Simulado -->
    <div style="background: var(--card-nested-bg); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Grabación de la Llamada</span>
        <span style="font-size: 11px; color: var(--text-secondary); font-variant-numeric: tabular-nums;">02:14 / 02:14</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-primary); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="Toast.show('Reproduciendo grabación de llamada...', 'info')">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <div style="flex: 1; height: 6px; background: var(--card-outer-bg); border-radius: 3px; position: relative; overflow: hidden;">
          <div style="width: 65%; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--card-nested-bg); padding: 14px; border-radius: 12px;">
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">CANAL & DURACIÓN</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--text-primary);">${item.channel}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">TELÉFONO</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--text-primary); font-variant-numeric: tabular-nums;">${item.phone}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">HORA</span>
        <span style="font-size: 12px; color: var(--text-secondary);">${item.time}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">SENTIMIENTO IA</span>
        <span style="font-size: 12px; color: var(--status-emerald); font-weight: 600;">${item.sentiment}</span>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
      <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">TRANSCRIPCIÓN Y RESUMEN IA</span>
      <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; background: var(--card-nested-bg); padding: 14px; border-radius: 8px;">
        ${item.transcript}
      </p>
    </div>

    <div style="display: flex; gap: 10px; margin-top: auto; padding-top: 14px;">
      <button style="flex: 1; padding: 10px; border-radius: var(--radius-pill); background: var(--card-nested-bg); font-weight: 600; font-size: 12px; color: var(--text-primary); cursor: pointer; border: none;" onclick="Toast.show('Enviando comanda a impresora de cocina...', 'success')">
        Reenviar Comanda
      </button>
      <button style="flex: 1; padding: 10px; border-radius: var(--radius-pill); background: var(--accent-primary); color: #fff; font-weight: 600; font-size: 12px; cursor: pointer; border: none;" onclick="Toast.show('Mensaje de seguimiento enviado por WhatsApp', 'success')">
        Contactar por WhatsApp
      </button>
    </div>
  `;

  drawer.classList.add('active');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  const drawer = document.getElementById('txDetailDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
  }
}

// ==========================================================================
// 9. CONMUTADOR DE GIRO DE NEGOCIO (VERTICAL SWITCHER)
// ==========================================================================
function switchGiro(giroKey) {
  const config = GiroDataConfig[giroKey];
  if (!config) return;

  currentGiroKey = giroKey;
  activeTransactions = [...config.items];

  // Actualizar etiquetas en barra superior y sidebar
  const nameLabel = document.getElementById('businessNameLabel');
  const giroLabel = document.getElementById('businessGiroLabel');
  if (nameLabel) nameLabel.textContent = config.name;
  if (giroLabel) giroLabel.textContent = config.label;

  // Actualizar documento de Knowledge Base
  const kbDocTitle = document.getElementById('kbDocTitle');
  if (kbDocTitle) kbDocTitle.textContent = config.kbDoc;

  // Re-renderizar tabla de transacciones
  TableController.render();

  Toast.show(`Giro adaptado: ${config.name} (${config.label})`, 'success');
}

// ==========================================================================
// 10. COMMAND PALETTE (MODAL DE ACCESO RÁPIDO ⌘K)
// ==========================================================================
const CommandPalette = {
  modal: document.getElementById('commandPaletteModal'),
  input: document.getElementById('cmdPaletteInput'),
  resultsContainer: document.getElementById('cmdPaletteResults'),

  init() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    const trigger = document.getElementById('cmdSearchTrigger');
    if (trigger) {
      trigger.addEventListener('click', () => this.open());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    if (this.resultsContainer) {
      this.resultsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.cmd-result-item');
        if (!item) return;
        this.executeCommand(item.dataset.cmd);
      });
    }

    if (this.input) {
      this.input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = this.resultsContainer.querySelectorAll('.cmd-result-item');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'flex' : 'none';
        });
      });
    }
  },

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    if (this.input) {
      this.input.value = '';
      setTimeout(() => this.input.focus(), 50);
    }
  },

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
  },

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  },

  executeCommand(cmd) {
    this.close();
    switch (cmd) {
      case 'sim-call':
        openCallSimulatorModal();
        break;
      case 'new-lead':
        openNewLeadModal();
        break;
      case 'toggle-theme':
        ThemeEngine.toggleTheme();
        break;
      case 'nav-whatsapp':
        Toast.show('Abriendo WhatsApp Inbox multi-agente...', 'info');
        break;
      case 'nav-orders':
        document.getElementById('tableSearchInput')?.focus();
        Toast.show('Navegando a tabla de pedidos y comandas', 'info');
        break;
      default:
        Toast.show(`Acción ejecutada: ${cmd}`, 'info');
    }
  }
};

// ==========================================================================
// 11. OTRAS ACCIONES Y FUNCIONES GLOBALES
// ==========================================================================
function completeTask(checkboxEl) {
  const item = checkboxEl.closest('.radar-task-item');
  if (!item) return;
  item.classList.toggle('done');
  checkboxEl.classList.toggle('checked');
  if (checkboxEl.classList.contains('checked')) {
    checkboxEl.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>`;
    Toast.show('Documento marcado como aprendido por la IA', 'success');
  } else {
    checkboxEl.innerHTML = '';
  }
}

function openVoiceSettings() {
  Toast.show('Abriendo configuración de voz de Valeria (ElevenLabs Cartesia)', 'info');
}

function openUploadModal() {
  Toast.show('Abriendo diálogo de carga para Menú o Catálogo PDF...', 'info');
}

// ==========================================================================
// 12. INICIALIZACIÓN GLOBAL AL CARGAR EL DOM
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  TableController.init();
  ChartEngine.init();
  CommandPalette.init();

  // Giro selector pills
  const vPillsWrap = document.getElementById('verticalPills');
  if (vPillsWrap) {
    vPillsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.v-pill');
      if (!btn) return;
      vPillsWrap.querySelectorAll('.v-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchGiro(btn.dataset.giro);
    });
  }

  // Botones para abrir Simulador de Llamada de Voz
  document.getElementById('actionSimCall')?.addEventListener('click', openCallSimulatorModal);
  document.getElementById('btnTopTestAgent')?.addEventListener('click', openCallSimulatorModal);
  document.getElementById('btnListenLive')?.addEventListener('click', openCallSimulatorModal);
  document.getElementById('btnTestVoiceCall')?.addEventListener('click', openCallSimulatorModal);

  // Botón para silenciar llamada
  document.getElementById('btnToggleMute')?.addEventListener('click', toggleMute);

  // Botón para abrir modal de Nuevo Lead
  document.getElementById('actionNewLead')?.addEventListener('click', openNewLeadModal);
  document.getElementById('btnCloseNewLeadModal')?.addEventListener('click', closeNewLeadModal);
  document.getElementById('btnCancelNewLead')?.addEventListener('click', closeNewLeadModal);

  // Otros botones de acción rápida
  document.getElementById('actionUpdateMenu')?.addEventListener('click', openUploadModal);
  document.getElementById('actionLiveChat')?.addEventListener('click', () => {
    Toast.show('Abriendo bandeja de WhatsApp en vivo con 8 conversaciones', 'info');
  });
  document.getElementById('btnWhatsAppQuick')?.addEventListener('click', () => {
    Toast.show('WhatsApp: 8 mensajes pendientes de atención', 'info');
  });

  // Cerrar Drawer
  document.getElementById('btnCloseDrawer')?.addEventListener('click', closeDrawer);
  document.getElementById('txDetailDrawer')?.addEventListener('click', (e) => {
    if (e.target.id === 'txDetailDrawer') closeDrawer();
  });

  // Cerrar modal de lead al hacer click fuera
  document.getElementById('newLeadModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'newLeadModal') closeNewLeadModal();
  });
  document.getElementById('callSimulatorModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'callSimulatorModal') closeCallSimulatorModal();
  });

  // Menú móvil responsive
  const sidebar = document.getElementById('mainSidebar');
  const toggleMobile = document.getElementById('mobileSidebarToggle');
  const closeMobile = document.getElementById('mobileSidebarClose');

  if (toggleMobile && sidebar) {
    toggleMobile.addEventListener('click', () => sidebar.classList.add('mobile-open'));
  }
  if (closeMobile && sidebar) {
    closeMobile.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
  }

  // Navegación en sidebar
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const label = item.querySelector('.nav-label')?.textContent || 'Vista';
      Toast.show(`Cambiando a: ${label}`, 'info');
    });
  });
});
