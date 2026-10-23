/**
 * NEXUS CORE — APPLICATION CONTROLLER
 * Arquitectura Anti-Fricción para Clientes Corporativos
 */

// ==========================================================================
// 1. GESTIÓN Y PERSISTENCIA DE TEMA (MODO CLARO / OSCURO)
// ==========================================================================
const ThemeEngine = {
  themeMeta: document.querySelector('meta[name="color-scheme"]'),
  toggleBtn: document.getElementById('themeToggleBtn'),
  themeTextLabel: document.getElementById('themeTextLabel'),
  STORAGE_KEY: 'nexus_color_theme',

  init() {
    // Sincronizar etiqueta inicial
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.updateUI(currentTheme);

    // Event listener en el botón conmutador
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Atajo de teclado 'T' para cambiar de tema rápidamente
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (!document.querySelector('.modal-backdrop.active, .command-palette-backdrop.active')) {
          e.preventDefault();
          this.toggleTheme();
        }
      }
    });

    // Detectar cambios en las preferencias del sistema
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

    // Si el navegador soporta View Transitions API, animación cinematográfica
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

    // Feedback al usuario
    Toast.show(`Tema cambiado a ${theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}`, 'info');
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
// 2. SISTEMA DE TOAST NOTIFICATIONS (FEEDBACK INMEDIATO)
// ==========================================================================
const Toast = {
  container: document.getElementById('toastContainer'),

  show(message, type = 'info', duration = 3500) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    if (type === 'success') {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }
};

// ==========================================================================
// 3. BASE DE DATOS LOCAL Y GESTIÓN DE MOVIMIENTOS
// ==========================================================================
let transactionsData = [
  {
    id: 'TX-94819',
    concept: 'Pago Recibido — Suscripción Enterprise Q4',
    client: 'Fintech Solutions Corp',
    method: 'SPEI Banxico',
    date: '23 Oct 2026, 09:42',
    status: 'completed',
    type: 'in',
    amount: 145000.00,
    currency: 'MXN',
    reference: '012180004928192831',
    notes: 'Factura SAT CFDI #8921 validada con sello digital.'
  },
  {
    id: 'TX-94818',
    concept: 'Dispersión de Nómina Quincenal',
    client: 'Equipo de Ingeniería & Operaciones',
    method: 'Transferencia Masiva',
    date: '23 Oct 2026, 08:15',
    status: 'completed',
    type: 'out',
    amount: 98450.00,
    currency: 'MXN',
    reference: 'DISP-20261023-99',
    notes: 'Dispersión a 18 cuentas sin comisión por plan VIP.'
  },
  {
    id: 'TX-94817',
    concept: 'Cobro Pasarela Stripe Connect',
    client: 'E-commerce Checkout Store',
    method: 'Stripe Gateway',
    date: '22 Oct 2026, 21:04',
    status: 'completed',
    type: 'in',
    amount: 34120.50,
    currency: 'MXN',
    reference: 'ch_3N8209481029',
    notes: 'Liquidación en cuenta en 24 horas.'
  },
  {
    id: 'TX-94816',
    concept: 'Infraestructura Cloud AWS Multi-Region',
    client: 'Amazon Web Services LatAm',
    method: 'Tarjeta Corporativa *4092',
    date: '22 Oct 2026, 17:30',
    status: 'pending',
    type: 'out',
    amount: 18450.00,
    currency: 'MXN',
    reference: 'INV-AWS-2026-10',
    notes: 'Requiere aprobación de administrador antes de las 18:00.'
  },
  {
    id: 'TX-94815',
    concept: 'Cobro de Honorarios de Auditoría Externa',
    client: 'Deloitte Consulting México',
    method: 'SPEI Inbursa',
    date: '21 Oct 2026, 14:12',
    status: 'completed',
    type: 'in',
    amount: 62100.00,
    currency: 'MXN',
    reference: 'SPEI-884910284',
    notes: 'Conciliación automática OK.'
  },
  {
    id: 'TX-94814',
    concept: 'Reembolso Solicitado por Cliente #489',
    client: 'Comercializadora del Norte',
    method: 'Devolución Directa',
    date: '20 Oct 2026, 11:28',
    status: 'review',
    type: 'out',
    amount: 4500.00,
    currency: 'MXN',
    reference: 'DEV-94814-REF',
    notes: 'En revisión por mesa de control antifraude.'
  }
];

const TableController = {
  tbody: document.getElementById('transactionsTableBody'),
  searchInput: document.getElementById('tableSearchInput'),
  statusPills: document.getElementById('statusFilterPills'),
  counterEl: document.getElementById('tableRecordCount'),
  currentFilter: 'all',
  currentSearch: '',

  init() {
    this.render();

    // Búsqueda en tiempo real
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Filtrado por estado
    if (this.statusPills) {
      this.statusPills.addEventListener('click', (e) => {
        const btn = e.target.closest('.status-pill-btn');
        if (!btn) return;
        this.statusPills.querySelectorAll('.status-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    }

    // Exportación de tabla
    const btnExport = document.getElementById('btnExportTable');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportCSV());
    }
  },

  render() {
    if (!this.tbody) return;

    const filtered = transactionsData.filter(item => {
      const matchFilter = this.currentFilter === 'all' || item.status === this.currentFilter;
      const matchSearch = !this.currentSearch ||
        item.concept.toLowerCase().includes(this.currentSearch) ||
        item.client.toLowerCase().includes(this.currentSearch) ||
        item.id.toLowerCase().includes(this.currentSearch) ||
        item.method.toLowerCase().includes(this.currentSearch);
      return matchFilter && matchSearch;
    });

    if (this.counterEl) {
      this.counterEl.textContent = `Mostrando ${filtered.length} de ${transactionsData.length} operaciones`;
    }

    if (filtered.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
            No se encontraron transacciones que coincidan con los criterios de búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    this.tbody.innerHTML = filtered.map(tx => {
      const isPositive = tx.type === 'in';
      const formattedAmount = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(tx.amount);

      let statusBadge = '';
      if (tx.status === 'completed') {
        statusBadge = `<span class="status-badge completed"><span class="status-badge-dot"></span>Completado</span>`;
      } else if (tx.status === 'pending') {
        statusBadge = `<span class="status-badge pending"><span class="status-badge-dot"></span>Pendiente</span>`;
      } else {
        statusBadge = `<span class="status-badge review"><span class="status-badge-dot"></span>En Revisión</span>`;
      }

      return `
        <tr onclick="openTransactionDetail('${tx.id}')">
          <td>
            <div class="table-concept-cell">
              <div class="concept-icon-wrap ${isPositive ? 'in' : 'out'}">
                ${isPositive ?
                  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>` :
                  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`
                }
              </div>
              <div class="concept-meta">
                <span class="concept-title">${tx.concept}</span>
                <span class="concept-id">${tx.id} • ${tx.client}</span>
              </div>
            </div>
          </td>
          <td><span class="text-secondary font-mono">${tx.method}</span></td>
          <td><span class="text-muted font-mono">${tx.date}</span></td>
          <td>${statusBadge}</td>
          <td class="text-right">
            <span class="amount-val ${isPositive ? 'positive' : 'negative'}">
              ${isPositive ? '+' : '-'}${formattedAmount}
            </span>
          </td>
          <td class="text-center" onclick="event.stopPropagation()">
            <div class="table-row-actions">
              <button class="row-action-btn" title="Descargar comprobante" onclick="downloadReceipt('${tx.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button class="row-action-btn" title="Ver detalles completos" onclick="openTransactionDetail('${tx.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  exportCSV() {
    const headers = ['ID', 'Concepto', 'Cliente', 'Metodo', 'Fecha', 'Estado', 'Tipo', 'Monto'];
    const rows = transactionsData.map(tx => [
      tx.id,
      `"${tx.concept}"`,
      `"${tx.client}"`,
      tx.method,
      tx.date,
      tx.status,
      tx.type,
      tx.amount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_movimientos_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.show('Reporte CSV descargado con éxito', 'success');
  }
};

// ==========================================================================
// 4. MOTOR DE GRÁFICO INTERACTIVO SVG DE ALTA PRECISIÓN
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
      { date: '17 Oct', val: 24500, ops: 8 },
      { date: '18 Oct', val: 38200, ops: 12 },
      { date: '19 Oct', val: 29100, ops: 9 },
      { date: '20 Oct', val: 45000, ops: 15 },
      { date: '21 Oct', val: 62100, ops: 18 },
      { date: '22 Oct', val: 48900, ops: 14 },
      { date: 'Hoy', val: 56400, ops: 16 }
    ],
    '30d': [
      { date: '1 Oct', val: 18200, ops: 6 },
      { date: '5 Oct', val: 29400, ops: 10 },
      { date: '9 Oct', val: 24800, ops: 8 },
      { date: '13 Oct', val: 41000, ops: 13 },
      { date: '17 Oct', val: 36500, ops: 11 },
      { date: '21 Oct', val: 62100, ops: 18 },
      { date: '23 Oct', val: 58900, ops: 17 }
    ],
    '90d': [
      { date: 'Agosto', val: 310000, ops: 98 },
      { date: 'Septiembre', val: 440000, ops: 135 },
      { date: 'Octubre', val: 482320, ops: 148 }
    ],
    '1y': [
      { date: 'Q1 2026', val: 980000, ops: 320 },
      { date: 'Q2 2026', val: 1240000, ops: 410 },
      { date: 'Q3 2026', val: 1420000, ops: 480 },
      { date: 'Q4 2026', val: 680000, ops: 210 }
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
        Toast.show(`Periodo actualizado a ${btn.textContent}`, 'info');
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

    // Construir línea suave Bézier
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

    // Renderizar círculos interactivos
    if (this.pointsGroup) {
      this.pointsGroup.innerHTML = points.map((p, idx) => `
        <circle class="chart-point" cx="${p.x}" cy="${p.y}" r="4.5" data-idx="${idx}"></circle>
      `).join('');

      this.pointsGroup.querySelectorAll('.chart-point').forEach((circle, idx) => {
        circle.addEventListener('mouseenter', (e) => this.showTooltip(points[idx], circle));
        circle.addEventListener('mouseleave', () => this.hideTooltip());
      });
    }
  },

  showTooltip(pointObj, circleEl) {
    if (!this.tooltip || !this.wrapper) return;
    const ttDate = document.getElementById('ttDate');
    const ttVal = document.getElementById('ttVal');
    const ttOps = document.getElementById('ttOps');

    if (ttDate) ttDate.textContent = pointObj.data.date;
    if (ttVal) {
      ttVal.textContent = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(pointObj.data.val);
    }
    if (ttOps) ttOps.textContent = `${pointObj.data.ops} transacciones registradas`;

    const rect = this.wrapper.getBoundingClientRect();
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
// 5. COMMAND PALETTE (MODAL DE ACCESO RÁPIDO ⌘K)
// ==========================================================================
const CommandPalette = {
  modal: document.getElementById('commandPaletteModal'),
  input: document.getElementById('cmdPaletteInput'),
  resultsContainer: document.getElementById('cmdPaletteResults'),

  init() {
    // Abrir con ⌘K o Ctrl+K
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

    // Manejar selección de comandos
    if (this.resultsContainer) {
      this.resultsContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.cmd-result-item');
        if (!item) return;
        this.executeCommand(item.dataset.cmd);
      });
    }

    // Filtrar comandos en tiempo real
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
      case 'new-op':
        openNewOpModal();
        break;
      case 'toggle-theme':
        ThemeEngine.toggleTheme();
        break;
      case 'download-statement':
        TableController.exportCSV();
        break;
      case 'nav-transactions':
        document.getElementById('tableSearchInput')?.focus();
        Toast.show('Navegando a tabla de transacciones', 'info');
        break;
      case 'nav-support':
        startConciergeChat();
        break;
      default:
        Toast.show(`Acción ejecutada: ${cmd}`, 'info');
    }
  }
};

// ==========================================================================
// 6. MODAL DE NUEVA OPERACIÓN
// ==========================================================================
function openNewOpModal() {
  const modal = document.getElementById('newOpModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      document.getElementById('opRecipient')?.focus();
    }, 100);
  }
}

function closeNewOpModal() {
  const modal = document.getElementById('newOpModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function handleNewOpSubmit(e) {
  e.preventDefault();
  const recipient = document.getElementById('opRecipient').value;
  const amount = parseFloat(document.getElementById('opAmount').value) || 0;
  const concept = document.getElementById('opConcept').value;

  if (amount <= 0) {
    Toast.show('Por favor ingresa un monto válido mayor a 0', 'error');
    return;
  }

  // Simulación de envío instantáneo
  const submitBtn = document.getElementById('btnSubmitOp');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Procesando SPEI...</span>`;

  setTimeout(() => {
    // Agregar nueva transacción
    const newTx = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      concept: concept,
      client: recipient,
      method: 'SPEI Inmediato',
      date: 'Hace un momento',
      status: 'completed',
      type: 'out',
      amount: amount,
      currency: 'MXN',
      reference: `SPEI-BANXICO-${Date.now().toString().slice(-8)}`,
      notes: 'Operación liquidada en tiempo real sin incidencias.'
    };

    transactionsData.unshift(newTx);
    TableController.render();

    // Actualizar saldo visual
    const balEl = document.getElementById('mainBalanceVal');
    if (balEl) {
      let currentNum = 1284950 - amount;
      balEl.textContent = currentNum.toLocaleString('es-MX');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    closeNewOpModal();

    Toast.show(`Transferencia de $${amount.toLocaleString('es-MX')} enviada con éxito`, 'success');
  }, 750);
}

// ==========================================================================
// 7. DRAWER DE DETALLE DE TRANSACCIÓN (SLIDE-OVER)
// ==========================================================================
function openTransactionDetail(txId) {
  const tx = transactionsData.find(t => t.id === txId);
  if (!tx) return;

  const drawer = document.getElementById('txDetailDrawer');
  const body = document.getElementById('drawerBodyContent');
  if (!drawer || !body) return;

  const isPositive = tx.type === 'in';
  const formattedAmount = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(tx.amount);

  body.innerHTML = `
    <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
      <div>
        <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${tx.id}</span>
        <h4 style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${tx.concept}</h4>
      </div>
      <span class="amount-val ${isPositive ? 'positive' : 'negative'}" style="font-size: 20px;">
        ${isPositive ? '+' : '-'}${formattedAmount}
      </span>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--card-nested-bg); padding: 14px; border-radius: 12px; border: 1px solid var(--border-subtle);">
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">BENEFICIARIO / ORIGEN</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--text-primary);">${tx.client}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">CANAL DE LIQUIDACIÓN</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--text-primary); font-family: var(--font-mono);">${tx.method}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">FECHA & HORA</span>
        <span style="font-size: 12px; color: var(--text-secondary);">${tx.date}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">ESTADO FISCAL</span>
        <span style="font-size: 12px; color: var(--status-emerald); font-weight: 600;">Timbrado SAT 4.0</span>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
      <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">CLAVE DE RASTREO / REFERENCIA</span>
      <div style="background: var(--card-nested-bg); padding: 10px 14px; border-radius: 8px; font-family: var(--font-mono); font-size: 11.5px; color: var(--text-primary); display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-subtle);">
        <span>${tx.reference}</span>
        <button style="color: var(--accent-primary); font-size: 11px; font-weight: 600;" onclick="navigator.clipboard.writeText('${tx.reference}'); Toast.show('Referencia copiada', 'info');">Copiar</button>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 6px;">
      <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">NOTAS & AUDITORÍA</span>
      <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; background: var(--card-nested-bg); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
        ${tx.notes}
      </p>
    </div>

    <div style="display: flex; gap: 10px; margin-top: auto;">
      <button style="flex: 1; padding: 10px; border-radius: var(--radius-pill); background: var(--card-nested-bg); border: 1px solid var(--border-inner); font-weight: 600; font-size: 12px; color: var(--text-primary);" onclick="downloadReceipt('${tx.id}')">
        Descargar CFDI / PDF
      </button>
      <button style="flex: 1; padding: 10px; border-radius: var(--radius-pill); background: var(--accent-gradient); color: #fff; font-weight: 600; font-size: 12px;" onclick="repeatTransaction('${tx.id}')">
        Repetir Operación
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

function downloadReceipt(txId) {
  Toast.show(`Generando comprobante fiscal para ${txId}...`, 'info');
  setTimeout(() => {
    Toast.show(`Comprobante ${txId}.pdf descargado correctamente`, 'success');
  }, 600);
}

function repeatTransaction(txId) {
  closeDrawer();
  openNewOpModal();
  Toast.show(`Datos precargados de la operación ${txId}`, 'info');
}

// ==========================================================================
// 8. OTRAS ACCIONES RÁPIDAS Y CONCIERGE VIP
// ==========================================================================
function approveInvoice(invoiceId) {
  Toast.show(`Factura ${invoiceId} aprobada exitosamente`, 'success');
}

function completeTask(checkboxEl) {
  const item = checkboxEl.closest('.radar-task-item');
  if (!item) return;
  item.classList.toggle('done');
  checkboxEl.classList.toggle('checked');
  if (checkboxEl.classList.contains('checked')) {
    checkboxEl.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>`;
    Toast.show('Tarea marcada como completada', 'success');
  } else {
    checkboxEl.innerHTML = '';
  }
}

function openCertModal() {
  Toast.show('Abriendo portal de Certificados Digitales SAT', 'info');
}

function toggleSmsAlerts() {
  Toast.show('Alertas SMS prioritarias activadas para tu línea corporativa', 'success');
}

function openSecurityLogs() {
  Toast.show('Descargando bitácora de accesos y firmas WebAuthn...', 'info');
}

function startConciergeChat() {
  Toast.show('Conectando en tiempo real con Sofía Valenzuela (Ejecutiva VIP)...', 'info');
}

// ==========================================================================
// 9. INICIALIZACIÓN GLOBAL AL CARGAR EL DOM
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  TableController.init();
  ChartEngine.init();
  CommandPalette.init();

  // Botón de Nueva Operación
  document.getElementById('btnOpenNewOp')?.addEventListener('click', openNewOpModal);
  document.getElementById('btnCloseNewOpModal')?.addEventListener('click', closeNewOpModal);
  document.getElementById('btnCancelNewOp')?.addEventListener('click', closeNewOpModal);

  // Botones de Ribbon de Acción Rápida
  document.querySelectorAll('.action-card-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const act = pill.dataset.quickAction;
      if (act === 'transfer') openNewOpModal();
      else if (act === 'invoice') Toast.show('Abriendo módulo de Facturación SAT 4.0', 'info');
      else if (act === 'extract') TableController.exportCSV();
      else if (act === 'apikey') Toast.show('Gestión de Llaves API y Webhooks en producción', 'info');
    });
  });

  // Botón Concierge
  document.getElementById('btnContactConcierge')?.addEventListener('click', startConciergeChat);

  // Cerrar Drawer
  document.getElementById('btnCloseDrawer')?.addEventListener('click', closeDrawer);
  document.getElementById('txDetailDrawer')?.addEventListener('click', (e) => {
    if (e.target.id === 'txDetailDrawer') closeDrawer();
  });

  // Cerrar modal al hacer click fuera
  document.getElementById('newOpModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'newOpModal') closeNewOpModal();
  });

  // Notificaciones
  document.getElementById('btnNotifications')?.addEventListener('click', () => {
    Toast.show('No tienes notificaciones urgentes pendientes', 'info');
  });

  // Retiro rápido
  document.getElementById('btnQuickWithdraw')?.addEventListener('click', () => {
    openNewOpModal();
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
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      Toast.show(`Cambiando a vista: ${item.querySelector('.nav-label')?.textContent}`, 'info');
    });
  });
});
