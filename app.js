/**
 * ATENDO - PANEL DE CONTROL Y OPERACIONES IA (CONTROLLER)
 * Arquitectura Anti-Friccion: Agentes de Voz y Automatizacion WhatsApp
 */

// ==========================================================================
// 1. GESTION Y PERSISTENCIA DE TEMA (MODO CLARO / OSCURO)
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
// 3. MOTOR DE DICCIONARIO SEMANTICO Y DATOS POR GIRO DE EMPRESA
// ==========================================================================
const GiroDataConfig = {
  restaurante: {
    id: 'restaurante',
    name: 'Trattoria Bella Napoli',
    label: 'Restaurante & Delivery • Plan Pro',
    phone: '+52 (55) 9225-4012',
    iconSvg: `<svg class="giro-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    agentName: 'Mario (Pizzeria y Cocina)',
    agentRole: 'Toma de pedidos y comandas',
    heroSubtitle: 'Tu asistente Mario esta activo atendiendo llamadas y WhatsApp. Tienes 3 pedidos en preparacion para el turno de cocina de hoy.',
    ordersNav: 'Pedidos & Cocina',
    ordersBadge: '3 pend.',
    kbNav: 'Menu & Precios (KB)',
    kbDoc: 'Menu_Precios_Octubre_2026.pdf',
    kbPages: '14 paginas aprendidas con recetas y tiempos de cocina',
    kpiOrdersLabel: 'Pedidos capturados por IA',
    revenueNumber: '14,250',
    ordersCountSub: '38 pedidos confirmados hoy',
    tableTitle: 'Comandas y Pedidos en Tiempo Real',
    searchPlaceholder: 'Buscar por cliente, telefono o comanda...',
    filterTab2: 'Pedidos',
    filterTab3: 'Comandas',
    thCols: ['CLIENTE Y CONTACTO', 'CANAL Y TIEMPO', 'PLATILLOS / COMANDA', 'ESTADO DE COMANDA', 'TOTAL MXN'],
    actionSimTitle: 'Simular Pedido Telefonico',
    actionLeadTitle: 'Nuevo Pedido Manual',
    actionLeadSub: 'Capturar orden a cocina',
    actionMenuTitle: 'Actualizar Menu / Precios',
    actionMenuSub: 'Subir PDF de platillos',
    actionChatTitle: 'WhatsApp Cocina & Pedidos',
    actionChatSub: 'Atender pedidos en vivo',
    calcomConnected: false,
    calcomDetail: 'No configurada. Sincroniza reservaciones de mesas si requieres agenda.',
    dialogues: [
      { speaker: 'Mario', text: 'Buenas tardes, gracias por llamar a Trattoria Bella Napoli. Te gustaria ordenar para entrega a domicilio o tienes alguna consulta de nuestra carta?' },
      { speaker: 'Cliente', text: 'Hola, buenas tardes. Tienen disponible la pizza Diavola en tamano grande?' },
      { speaker: 'Mario', text: 'Si, por supuesto. La pizza Diavola grande cuesta $280 pesos y lleva pepperoni artesanal con queso mozzarella fresco. Deseas agregar alguna bebida o postre a tu orden?' },
      { speaker: 'Cliente', text: 'Si, agrega un refresco de lata y salsa de la casa por favor.' },
      { speaker: 'Mario', text: 'Excelente. Tu orden es: 1 Pizza Diavola grande, 1 refresco y salsa de la casa. Total $345 pesos. A que direccion te lo enviamos?' }
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
        status: 'En Cocina / Preparacion',
        statusType: 'info',
        amount: 345.00,
        currency: 'MXN',
        sentiment: 'Muy Satisfecho (98%)',
        transcript: 'Cliente ordeno a domicilio a Roma Norte. Tiempo estimado de entrega: 35 min. Pago con tarjeta contra entrega.'
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
        transcript: 'IA confirmo mesa en terraza para hoy a las 20:30 hrs y envio menu digital en PDF por WhatsApp.'
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
        transcript: 'Se le informo que el valet parking es en cortesia y el descorche tiene costo de $250 por botella.'
      },
      {
        id: 'AT-9018',
        client: 'Dra. Elena Vega',
        phone: '+52 55 8812 0491',
        channel: 'Voz IA (3m 05s)',
        channelType: 'pedidos',
        time: 'Hoy, 11:15',
        detail: 'Pedido corporativo: 8 Pizzas surtidas para oficina',
        status: 'En Ruta de Entrega',
        statusType: 'success',
        amount: 2480.00,
        currency: 'MXN',
        sentiment: 'Excelente (99%)',
        transcript: 'Factura CFDI 4.0 solicitada con RFC enviado por WhatsApp tras llamada. Comanda en cocina numero #402.'
      }
    ]
  },

  clinica_salud: {
    id: 'clinica_salud',
    name: 'Centro Odontologico Dentalis',
    label: 'Clinica Dental & Especialidades • Plan Pro',
    phone: '+52 (55) 8431-9011',
    iconSvg: `<svg class="giro-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
    agentName: 'Sofia (Recepcion Medica & Citas)',
    agentRole: 'Triaje y agendamiento de pacientes',
    heroSubtitle: 'Tu asistente medica Sofia esta activa recibiendo pacientes y triaje de urgencias. Tienes 2 consultas pendientes de confirmacion para hoy.',
    ordersNav: 'Agenda & Citas',
    ordersBadge: '2 citas',
    kbNav: 'Tratamientos & Aranceles (KB)',
    kbDoc: 'Tratamientos_y_Seguros_2026.pdf',
    kbPages: '8 paginas de aranceles, aseguradoras y preparaciones previas',
    kpiOrdersLabel: 'Consultas medicas agendadas',
    revenueNumber: '28,400',
    ordersCountSub: '142 pacientes atendidos este mes',
    tableTitle: 'Citas Medicas y Consultas en Tiempo Real',
    searchPlaceholder: 'Buscar por paciente, telefono o motivo de consulta...',
    filterTab2: 'Citas',
    filterTab3: 'Urgencias',
    thCols: ['PACIENTE Y CONTACTO', 'CANAL Y TIEMPO', 'MOTIVO DE CONSULTA', 'ESTADO DE CITA', 'HONORARIOS MXN'],
    actionSimTitle: 'Simular Cita Medica',
    actionLeadTitle: 'Agendar Nueva Consulta',
    actionLeadSub: 'Registrar paciente en agenda',
    actionMenuTitle: 'Actualizar Aranceles',
    actionMenuSub: 'Subir PDF de coberturas',
    actionChatTitle: 'WhatsApp Pacientes & Recordatorios',
    actionChatSub: 'Confirmar asistencia de citas',
    calcomConnected: true,
    calcomDetail: 'Conectada. Sincronizado en tiempo real con Agenda Dr. Ramos (Google Calendar / Cal.com).',
    dialogues: [
      { speaker: 'Sofia', text: 'Buen dia, gracias por comunicarte con Centro Dentalis. Deseas agendar una valoracion o tienes alguna pregunta sobre un tratamiento?' },
      { speaker: 'Paciente', text: 'Hola, tengo dolor intenso en una muela y queria saber si tienen espacio hoy por la tarde.' },
      { speaker: 'Sofia', text: 'Lamento mucho el malestar. Contamos con un espacio para valoracion urgente hoy a las 16:30 hrs con el Dr. Ramos en nuestra sucursal Del Valle. Te aparto ese horario?' },
      { speaker: 'Paciente', text: 'Si por favor, a nombre de Patricia Alarcon.' },
      { speaker: 'Sofia', text: 'Queda confirmada tu cita urgente hoy a las 16:30 hrs, Patricia. Te enviamos recordatorio y ubicacion exacta a tu WhatsApp.' }
    ],
    items: [
      {
        id: 'AT-8105',
        client: 'Patricia Alarcon',
        phone: '+52 55 2109 4432',
        channel: 'Voz IA (1m 45s)',
        channelType: 'citas',
        time: 'Hoy, 14:10',
        detail: 'Cita urgente por dolor agudo molar: Dr. Ramos',
        status: 'Cita Confirmada 16:30',
        statusType: 'success',
        amount: 850.00,
        currency: 'MXN',
        sentiment: 'Muy Agradecida (96%)',
        transcript: 'Triaje realizado: molestia aguda sin inflamacion visible. Cupo confirmado en consultorio 2.'
      },
      {
        id: 'AT-8104',
        client: 'Lic. Fernando Ortiz',
        phone: '+52 55 7712 9900',
        channel: 'WhatsApp IA',
        channelType: 'whatsapp',
        time: 'Hoy, 13:20',
        detail: 'Cotizacion de alineadores invisibles y seguro dental GNP',
        status: 'Escaneo 3D Agendado',
        statusType: 'success',
        amount: 32000.00,
        currency: 'MXN',
        sentiment: 'Interesado (92%)',
        transcript: 'Se enviaron folletos digitales de ortodoncia invisible y se confirmo cita para escaneo 3D el sabado.'
      },
      {
        id: 'AT-8103',
        client: 'Mariana Elizondo',
        phone: '+52 55 3314 8820',
        channel: 'Voz IA (2m 04s)',
        channelType: 'citas',
        time: 'Hoy, 11:40',
        detail: 'Limpieza dental con ultrasonido y revision anual',
        status: 'Cita Agendada Manana',
        statusType: 'success',
        amount: 1100.00,
        currency: 'MXN',
        sentiment: 'Excelente (98%)',
        transcript: 'Cita programada manana viernes 11:00 am con Dra. Castillo. Recordatorio de WhatsApp programado 2 hrs antes.'
      },
      {
        id: 'AT-8102',
        client: 'Ing. Javier Solis',
        phone: '+52 55 4902 1199',
        channel: 'WhatsApp IA',
        channelType: 'whatsapp',
        time: 'Hoy, 09:15',
        detail: 'Consulta de costo y requisitos para extraccion de terceros molares',
        status: 'Valoracion Requerida',
        statusType: 'info',
        amount: 2800.00,
        currency: 'MXN',
        sentiment: 'Informativo (90%)',
        transcript: 'IA explico protocolo con radiografia panoramica previa y facilito enlace para agendar valoracion inicial.'
      }
    ]
  },

  inmobiliaria: {
    id: 'inmobiliaria',
    name: 'Metropolitan Real Estate',
    label: 'Desarrollos Residenciales Polanco • Plan Elite',
    phone: '+52 (55) 7109-2244',
    iconSvg: `<svg class="giro-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14"></path></svg>`,
    agentName: 'Mateo (Asesor Inmobiliario)',
    agentRole: 'Calificacion de leads y visitas',
    heroSubtitle: 'Tu asesor comercial Mateo esta activo calificando prospectos y agendando visitas al showroom Polanco. Tienes 4 prospectos calificados hoy.',
    ordersNav: 'Prospectos & Visitas',
    ordersBadge: '4 leads',
    kbNav: 'Brochure & Planos (KB)',
    kbDoc: 'Brochure_Torre_Skyline_2026.pdf',
    kbPages: '22 paginas de planos, amenidades, enganches y plusvalia',
    kpiOrdersLabel: 'Prospectos calificados por IA',
    revenueNumber: '48,500',
    ordersCountSub: '58 visitas agendadas a showroom',
    tableTitle: 'Prospectos y Visitas en Tiempo Real',
    searchPlaceholder: 'Buscar por prospecto, telefono o desarrollo...',
    filterTab2: 'Visitas',
    filterTab3: 'Calificados',
    thCols: ['PROSPECTO Y CONTACTO', 'CANAL Y TIEMPO', 'DESARROLLO / PROTOTIPO', 'ESTADO COMERCIAL', 'PRESUPUESTO'],
    actionSimTitle: 'Simular Asesoria Inmobiliaria',
    actionLeadTitle: 'Registrar Prospecto',
    actionLeadSub: 'Alta inmediata en pipeline',
    actionMenuTitle: 'Cargar Brochure & Planos',
    actionMenuSub: 'Subir PDF de preventa',
    actionChatTitle: 'WhatsApp Inversionistas',
    actionChatSub: 'Enviar fichas tecnicas',
    calcomConnected: true,
    calcomDetail: 'Conectada. Sincronizado con Agenda Visitas Showroom (Cal.com).',
    dialogues: [
      { speaker: 'Mateo', text: 'Hola, gracias por comunicarte con Metropolitan Real Estate. Te interesa conocer nuestros departamentos en preventa en Torre Skyline Polanco?' },
      { speaker: 'Cliente', text: 'Hola, vi su anuncio en Instagram. Que precio tienen los departamentos de 2 recamaras?' },
      { speaker: 'Mateo', text: 'Contamos con prototipos de 2 recamaras desde 88 m2 a partir de $5.2 millones de pesos, con balcon y 2 cajones de estacionamiento. Te gustaria agendar una visita al departamento muestra este fin de semana?' },
      { speaker: 'Cliente', text: 'Si, me interesaria el sabado alrededor de las 11:00 am.' },
      { speaker: 'Mateo', text: 'Excelente. Te agende para el sabado a las 11:00 am con nuestro director comercial. Te comparto el acceso al showroom por WhatsApp.' }
    ],
    items: [
      {
        id: 'AT-7301',
        client: 'Arq. Gustavo Peralta',
        phone: '+52 55 6019 3321',
        channel: 'Voz IA (3m 40s)',
        channelType: 'citas',
        time: 'Hoy, 12:45',
        detail: 'Visita Showroom Torre Skyline: 2 Recamaras 110m2',
        status: 'Visita Agendada Sab',
        statusType: 'success',
        amount: 5200000.00,
        currency: 'MXN',
        sentiment: 'Lead Calificado A+',
        transcript: 'Capacidad de compra verificada con enganche del 30% listo. Notificacion enviada al equipo comercial.'
      },
      {
        id: 'AT-7300',
        client: 'Dra. Carmen Villalobos',
        phone: '+52 55 9812 4001',
        channel: 'WhatsApp IA',
        channelType: 'whatsapp',
        time: 'Hoy, 10:15',
        detail: 'Solicitud de corrida financiera prototipo Penthouse 180m2',
        status: 'Corrida Enviada',
        statusType: 'info',
        amount: 8900000.00,
        currency: 'MXN',
        sentiment: 'Muy Interesada (94%)',
        transcript: 'Corrida financiera a 15 anos enviada en PDF por WhatsApp. Solicitud de llamada con broker hipotecario.'
      }
    ]
  },

  servicios_b2b: {
    id: 'servicios_b2b',
    name: 'Legal & Fiscal Consultores',
    label: 'Asesoria Corporativa & SAT • Plan Pro',
    phone: '+52 (55) 6049-1123',
    iconSvg: `<svg class="giro-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    agentName: 'Valentina (Triaje Comercial)',
    agentRole: 'Diagnostico y agendamiento de demos',
    heroSubtitle: 'Tu asistente Valentina esta activa recibiendo consultas legales y tributarias. Tienes 1 solicitud pendiente para revision de socio.',
    ordersNav: 'Consultas & Demos',
    ordersBadge: '1 pend.',
    kbNav: 'Servicios & Tarifas (KB)',
    kbDoc: 'Catalogo_Servicios_Fiscales_2026.pdf',
    kbPages: '16 paginas de normativas SAT, defensas y honorarios',
    kpiOrdersLabel: 'Demos y reuniones agendadas',
    revenueNumber: '42,000',
    ordersCountSub: '24 consultas comerciales cerradas',
    tableTitle: 'Consultas y Asesorias en Tiempo Real',
    searchPlaceholder: 'Buscar por cliente, empresa o asunto...',
    filterTab2: 'Demos',
    filterTab3: 'Propuestas',
    thCols: ['CLIENTE / EMPRESA', 'CANAL Y TIEMPO', 'ASUNTO DE CONSULTA', 'ESTADO COMERCIAL', 'HONORARIOS'],
    actionSimTitle: 'Simular Consulta Fiscal',
    actionLeadTitle: 'Nueva Consulta B2B',
    actionLeadSub: 'Agendar llamada tecnica',
    actionMenuTitle: 'Actualizar Catalogo',
    actionMenuSub: 'Subir tarifas de honorarios',
    actionChatTitle: 'WhatsApp Clientes B2B',
    actionChatSub: 'Soporte y documentos',
    calcomConnected: true,
    calcomDetail: 'Conectada. Sincronizado con Agenda de Socios en Cal.com.',
    dialogues: [
      { speaker: 'Valentina', text: 'Buen dia, gracias por llamar a Legal & Fiscal Consultores. Requieres asesoria para defensa fiscal, auditoria preventiva o constitucion de empresa?' },
      { speaker: 'Cliente', text: 'Hola, nos llego una notificacion de buzon tributario y necesitamos revisarla de urgencia.' },
      { speaker: 'Valentina', text: 'Comprendo. Podemos agendar una sesion inicial de diagnostico con nuestro socio fiscal para revisar el documento. Te acomoda una llamada tecnica hoy a las 17:00 hrs?' }
    ],
    items: [
      {
        id: 'AT-6102',
        client: 'Ing. Rodrigo Castillo',
        phone: '+52 55 8890 1234',
        channel: 'Voz IA (2m 10s)',
        channelType: 'citas',
        time: 'Hoy, 10:30',
        detail: 'Revision de requerimiento SAT y opinion de cumplimiento 32-D',
        status: 'Sesion Agendada 17:00',
        statusType: 'success',
        amount: 3500.00,
        currency: 'MXN',
        sentiment: 'Urgente / Resuelto',
        transcript: 'Cliente cargo PDF de notificacion via enlace temporal seguro. Socio asignado: Lic. Trevino.'
      }
    ]
  },

  ecommerce: {
    id: 'ecommerce',
    name: 'NovaStyle Streetwear',
    label: 'E-commerce & Retail Moda • Plan Scale',
    phone: '+52 (55) 5519-8800',
    iconSvg: `<svg class="giro-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    agentName: 'Camila (Soporte de Envios)',
    agentRole: 'Rastreo de paquetes y cambios',
    heroSubtitle: 'Tu asistente Camila esta activa resolviendo dudas de envios y tallas sin intervencion humana.',
    ordersNav: 'Pedidos & Envios',
    ordersBadge: '5 guias',
    kbNav: 'Guia de Envios & Tallas (KB)',
    kbDoc: 'Guia_de_Tallas_y_Devoluciones.pdf',
    kbPages: '10 paginas de politicas DHL/FedEx y tabla de medidas en cm',
    kpiOrdersLabel: 'Envios rastreados por IA',
    revenueNumber: '48,900',
    ordersCountSub: '89 paquetes entregados esta semana',
    tableTitle: 'Envios y Paquetes en Tiempo Real',
    searchPlaceholder: 'Buscar por comprador, guia o producto...',
    filterTab2: 'Envios',
    filterTab3: 'Devoluciones',
    thCols: ['COMPRADOR Y CONTACTO', 'CANAL Y TIEMPO', 'GUIA / PRODUCTO', 'ESTADO DE ENVIO', 'TOTAL MXN'],
    actionSimTitle: 'Simular Soporte de Rastreo',
    actionLeadTitle: 'Generar Guia Manual',
    actionLeadSub: 'Crear ticket de despacho',
    actionMenuTitle: 'Actualizar Guia de Tallas',
    actionMenuSub: 'Subir PDF de medidas',
    actionChatTitle: 'WhatsApp Compradores',
    actionChatSub: 'Notificar guias de rastreo',
    calcomConnected: false,
    calcomDetail: 'No configurada. El rubro de comercio electronico opera con guias de paqueteria DHL/FedEx.',
    dialogues: [
      { speaker: 'Camila', text: 'Hola, gracias por llamar a NovaStyle. Tienes alguna pregunta sobre tu numero de guia, cambio de talla o catalogo nuevo?' },
      { speaker: 'Cliente', text: 'Hola, compre unos tenis el martes y queria saber cuando me llegan.' },
      { speaker: 'Camila', text: 'Con gusto. Tu guia DHL 4920194821 esta en ruta de entrega hoy antes de las 18:00 hrs en tu domicilio de Guadalajara.' }
    ],
    items: [
      {
        id: 'AT-5091',
        client: 'Sebastian Morales',
        phone: '+52 55 4120 7865',
        channel: 'Voz IA (1m 02s)',
        channelType: 'pedidos',
        time: 'Hoy, 15:02',
        detail: 'Rastreo de paquete #89421 Sneakers Retro Edicion Limitada',
        status: 'En Ruta DHL',
        statusType: 'info',
        amount: 3200.00,
        currency: 'MXN',
        sentiment: 'Satisfecho (100%)',
        transcript: 'Llamada rapida de rastreo resuelta sin intervencion humana en 62 segundos.'
      }
    ]
  }
};

// Variable activa del giro actual
let currentGiroKey = localStorage.getItem('atendo_giro') || 'restaurante';
if (!GiroDataConfig[currentGiroKey]) currentGiroKey = 'restaurante';

let activeTransactions = [...GiroDataConfig[currentGiroKey].items];

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
            No se encontraron registros con el filtro actual.
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
            <button class="btn-table-action" onclick="event.stopPropagation(); openInteractionDetail('${item.id}')" title="Ver audio y transcripcion completa">
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

    const headers = ['ID', 'Cliente_O_Paciente', 'Telefono', 'Canal', 'Fecha_Hora', 'Detalle', 'Resultado_IA', 'Importe_MXN'];
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
    link.setAttribute('download', `atendo_${currentGiroKey}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.show('Reporte CSV exportado exitosamente', 'success');
  }
};

// ==========================================================================
// 5. MOTOR DE GRAFICO INTERACTIVO (LLAMADAS & WHATSAPP)
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
        Toast.show(`Grafico actualizado: periodo ${btn.textContent}`, 'info');
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
    if (ttOps) ttOps.textContent = `${pointObj.data.ops} registradas`;

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

  const nameEl = document.querySelector('.call-agent-name');
  if (nameEl) nameEl.textContent = giro.agentName;

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
  Toast.show('Llamada finalizada: Datos sincronizados con tu CRM', 'success');
}

function simulateNextDialog() {
  const giro = GiroDataConfig[currentGiroKey] || GiroDataConfig.restaurante;
  const transcriptBox = document.getElementById('callLiveTranscript');
  if (!transcriptBox || !giro.dialogues) return;

  if (currentDialogIndex >= giro.dialogues.length) {
    Toast.show('La conversacion de prueba ha concluido. Puedes colgar.', 'info');
    return;
  }

  const d = giro.dialogues[currentDialogIndex];
  const isClient = d.speaker.toLowerCase().includes('cliente') || d.speaker.toLowerCase().includes('paciente');
  const msgEl = document.createElement('div');
  msgEl.className = `transcript-msg ${isClient ? 'user' : 'agent'}`;
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
  Toast.show(isCallMuted ? 'Microfono silenciado' : 'Microfono activo', 'info');
}

// ==========================================================================
// 7. MODAL DE NUEVO REGISTRO / DISPARO DE LLAMADA SALIENTE
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
  const objective = document.getElementById('leadObjective')?.value || 'Contacto';
  const giro = GiroDataConfig[currentGiroKey] || GiroDataConfig.restaurante;

  const submitBtn = document.getElementById('btnSubmitLead');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Marcando a ${phone}...</span>`;

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
      amount: 450.00,
      currency: 'MXN',
      sentiment: 'En progreso',
      transcript: `Marcacion saliente ejecutada via Vapi/ElevenLabs. Cliente respondio y esta en linea con ${giro.agentName}.`
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
// 8. DRAWER DE DETALLE DE INTERACCION (SLIDE-OVER)
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
        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Grabacion de la Llamada</span>
        <span style="font-size: 11px; color: var(--text-secondary); font-variant-numeric: tabular-nums;">02:14 / 02:14</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-primary); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="Toast.show('Reproduciendo grabacion de llamada...', 'info')">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <div style="flex: 1; height: 6px; background: var(--card-outer-bg); border-radius: 3px; position: relative; overflow: hidden;">
          <div style="width: 65%; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--card-nested-bg); padding: 14px; border-radius: 12px;">
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">CANAL & DURACION</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--text-primary);">${item.channel}</span>
      </div>
      <div>
        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block;">TELEFONO</span>
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
      <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">TRANSCRIPCION Y RESUMEN IA</span>
      <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; background: var(--card-nested-bg); padding: 14px; border-radius: 8px;">
        ${item.transcript}
      </p>
    </div>

    <div style="display: flex; gap: 10px; margin-top: auto; padding-top: 14px;">
      <button style="flex: 1; padding: 10px; border-radius: var(--radius-pill); background: var(--card-nested-bg); font-weight: 600; font-size: 12px; color: var(--text-primary); cursor: pointer; border: none;" onclick="Toast.show('Notificacion de seguimiento enviada a tu equipo', 'success')">
        Reenviar Notificacion
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
// 9. MODAL DE PERFIL DE EMPRESA Y PLANTILLAS DE AGENTE (RUBRO PROPIO)
// ==========================================================================
let selectedTempRubro = currentGiroKey;

function openProfileModal() {
  const modal = document.getElementById('businessProfileModal');
  if (!modal) return;

  selectedTempRubro = currentGiroKey;
  const config = GiroDataConfig[currentGiroKey] || GiroDataConfig.restaurante;

  const nameInput = document.getElementById('companyNameInput');
  if (nameInput) {
    const savedName = localStorage.getItem('atendo_company_name');
    nameInput.value = savedName || config.name;
  }

  // Marcar tarjeta activa
  document.querySelectorAll('.rubro-option-card').forEach(card => {
    card.classList.toggle('active', card.dataset.rubro === currentGiroKey);
  });

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeProfileModal() {
  const modal = document.getElementById('businessProfileModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function handleSaveProfile(e) {
  e.preventDefault();
  const nameInput = document.getElementById('companyNameInput');
  const customName = nameInput ? nameInput.value.trim() : '';

  applyVerticalProfile(selectedTempRubro, customName);
  closeProfileModal();
}

// ==========================================================================
// 10. MODAL DE MARKETPLACE DE INTEGRACIONES OFICIALES Y VERIFICADAS
// ==========================================================================
function openIntegrationsModal() {
  const modal = document.getElementById('integracionesModal');
  if (!modal) return;

  const giro = GiroDataConfig[currentGiroKey] || GiroDataConfig.restaurante;
  const calcomCard = document.getElementById('calcomIntegrationCard');
  const calcomBadge = document.getElementById('calcomBadge');
  const calcomDetail = document.getElementById('calcomDetail');
  const btnCalcom = document.getElementById('btnConnectCalcom');

  if (calcomBadge && calcomDetail && btnCalcom) {
    if (giro.calcomConnected) {
      calcomCard?.classList.add('is-connected');
      calcomBadge.textContent = 'Conectada';
      calcomBadge.className = 'integration-badge connected';
      calcomDetail.textContent = giro.calcomDetail;
      btnCalcom.textContent = 'Configurar';
      btnCalcom.className = 'integration-btn-ghost';
    } else {
      calcomCard?.classList.remove('is-connected');
      calcomBadge.textContent = 'No configurada';
      calcomBadge.className = 'integration-badge disconnected';
      calcomDetail.textContent = giro.calcomDetail;
      btnCalcom.textContent = 'Vincular';
      btnCalcom.className = 'integration-btn-action';
    }
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeIntegrationsModal() {
  const modal = document.getElementById('integracionesModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function toggleCalcomIntegration() {
  const giro = GiroDataConfig[currentGiroKey];
  if (!giro) return;
  giro.calcomConnected = !giro.calcomConnected;

  if (giro.calcomConnected) {
    giro.calcomDetail = 'Conectada. Calendario sincronizado con tus agentes.';
    Toast.show('Cal.com vinculado con exito', 'success');
  } else {
    giro.calcomDetail = 'No configurada. Sincroniza tus horarios y citas.';
    Toast.show('Cal.com desconectado', 'info');
  }
  openIntegrationsModal();
}

// ==========================================================================
// 11. MOTOR DE ADAPTACION SEMANTICA DEL PANEL SEGUN EL GIRO REGISTRADO
// ==========================================================================
function applyVerticalProfile(rubroKey, customName = '') {
  const config = GiroDataConfig[rubroKey];
  if (!config) return;

  currentGiroKey = rubroKey;
  activeTransactions = [...config.items];

  localStorage.setItem('atendo_giro', rubroKey);
  if (customName) {
    localStorage.setItem('atendo_company_name', customName);
  }

  const finalName = customName || config.name;

  // 1. Sidebar y Encabezado
  const nameLabel = document.getElementById('businessNameLabel');
  const giroLabel = document.getElementById('businessGiroLabel');
  const iconBox = document.getElementById('currentGiroIcon');

  if (nameLabel) nameLabel.textContent = finalName;
  if (giroLabel) giroLabel.textContent = config.label;
  if (iconBox && config.iconSvg) iconBox.innerHTML = config.iconSvg;

  // 2. Navegacion lateral personalizada
  const ordersNavLabel = document.getElementById('ordersNavLabel');
  const pendingOrdersCount = document.getElementById('pendingOrdersCount');
  const kbNavLabel = document.getElementById('kbNavLabel');

  if (ordersNavLabel) ordersNavLabel.textContent = config.ordersNav;
  if (pendingOrdersCount) pendingOrdersCount.textContent = config.ordersBadge;
  if (kbNavLabel) kbNavLabel.textContent = config.kbNav;

  // 3. Hero y Subtitulo Dinamico
  const heroSubtitle = document.getElementById('heroDynamicSubtitle');
  if (heroSubtitle) heroSubtitle.textContent = config.heroSubtitle;

  // 4. Botones de Accion Rapida
  const actionSimTitle = document.getElementById('actionSimTitle');
  const actionLeadTitle = document.getElementById('actionLeadTitle');
  const actionLeadSub = document.getElementById('actionLeadSub');
  const actionMenuTitle = document.getElementById('actionMenuTitle');
  const actionMenuSub = document.getElementById('actionMenuSub');
  const actionChatTitle = document.getElementById('actionChatTitle');
  const actionChatSub = document.getElementById('actionChatSub');

  if (actionSimTitle) actionSimTitle.textContent = config.actionSimTitle;
  if (actionLeadTitle) actionLeadTitle.textContent = config.actionLeadTitle;
  if (actionLeadSub) actionLeadSub.textContent = config.actionLeadSub;
  if (actionMenuTitle) actionMenuTitle.textContent = config.actionMenuTitle;
  if (actionMenuSub) actionMenuSub.textContent = config.actionMenuSub;
  if (actionChatTitle) actionChatTitle.textContent = config.actionChatTitle;
  if (actionChatSub) actionChatSub.textContent = config.actionChatSub;

  // 5. Metricas Bento Grid
  const kpiOrdersLabel = document.getElementById('kpiOrdersLabel');
  const statRevenueNumber = document.getElementById('statRevenueNumber');
  const ordersCountSub = document.getElementById('ordersCountSub');

  if (kpiOrdersLabel) kpiOrdersLabel.textContent = config.kpiOrdersLabel;
  if (statRevenueNumber) statRevenueNumber.textContent = config.revenueNumber;
  if (ordersCountSub) ordersCountSub.textContent = config.ordersCountSub;

  // 6. Base de Conocimiento
  const kbDocTitle = document.getElementById('kbDocTitle');
  if (kbDocTitle) kbDocTitle.textContent = config.kbDoc;

  // 7. Titulo y Encabezados de la Tabla
  const tableTitle = document.getElementById('tableTitle');
  const searchInput = document.getElementById('tableSearchInput');
  const filterTab2 = document.getElementById('filterPillTab2');
  const filterTab3 = document.getElementById('filterPillTab3');

  if (tableTitle) tableTitle.textContent = config.tableTitle;
  if (searchInput) searchInput.placeholder = config.searchPlaceholder;
  if (filterTab2) filterTab2.textContent = config.filterTab2;
  if (filterTab3) filterTab3.textContent = config.filterTab3;

  const thCol1 = document.getElementById('thCol1');
  const thCol2 = document.getElementById('thCol2');
  const thCol3 = document.getElementById('thCol3');
  const thCol4 = document.getElementById('thCol4');
  const thCol5 = document.getElementById('thCol5');

  if (thCol1) thCol1.textContent = config.thCols[0];
  if (thCol2) thCol2.textContent = config.thCols[1];
  if (thCol3) thCol3.textContent = config.thCols[2];
  if (thCol4) thCol4.textContent = config.thCols[3];
  if (thCol5) thCol5.textContent = config.thCols[4];

  // 8. Re-renderizar tabla de transacciones
  TableController.render();

  Toast.show(`Panel adaptado a: ${finalName} (${config.label})`, 'success');
}

// ==========================================================================
// 12. COMMAND PALETTE (MODAL DE ACCESO RAPIDO ⌘K)
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
      case 'profile-settings':
        openProfileModal();
        break;
      case 'integrations':
        openIntegrationsModal();
        break;
      case 'toggle-theme':
        ThemeEngine.toggleTheme();
        break;
      case 'nav-whatsapp':
        Toast.show('Abriendo WhatsApp Inbox multi-agente...', 'info');
        break;
      case 'nav-orders':
        document.getElementById('tableSearchInput')?.focus();
        Toast.show('Navegando a tabla de actividad en tiempo real', 'info');
        break;
      default:
        Toast.show(`Accion ejecutada: ${cmd}`, 'info');
    }
  }
};

// ==========================================================================
// 13. OTRAS ACCIONES Y FUNCIONES GLOBALES
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
  Toast.show('Abriendo configuracion de voz en ElevenLabs Cartesia', 'info');
}

function openUploadModal() {
  Toast.show('Abriendo dialogo de carga para Menu o Documento PDF...', 'info');
}

// ==========================================================================
// 14. INICIALIZACION GLOBAL AL CARGAR EL DOM
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  TableController.init();
  ChartEngine.init();
  CommandPalette.init();

  // Inicializar el giro guardado de la empresa
  const savedGiro = localStorage.getItem('atendo_giro') || 'restaurante';
  const savedCompanyName = localStorage.getItem('atendo_company_name') || '';
  applyVerticalProfile(savedGiro, savedCompanyName);

  // Selector de Empresa / Perfil
  document.getElementById('businessSelectorBtn')?.addEventListener('click', openProfileModal);
  document.getElementById('btnCloseProfileModal')?.addEventListener('click', closeProfileModal);
  document.getElementById('btnCancelProfile')?.addEventListener('click', closeProfileModal);

  // Tarjetas de opciones de rubro en el modal
  const rubroGrid = document.getElementById('rubroOptionsGrid');
  if (rubroGrid) {
    rubroGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.rubro-option-card');
      if (!card) return;
      rubroGrid.querySelectorAll('.rubro-option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedTempRubro = card.dataset.rubro;
    });
  }

  // Modal de Integraciones
  document.getElementById('btnTopIntegrations')?.addEventListener('click', openIntegrationsModal);
  document.getElementById('btnCloseIntegrationsModal')?.addEventListener('click', closeIntegrationsModal);
  document.querySelector('[data-tab="integraciones"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openIntegrationsModal();
  });

  // Botones para abrir Simulador de Llamada de Voz
  document.getElementById('actionSimCall')?.addEventListener('click', openCallSimulatorModal);
  document.getElementById('btnTopTestAgent')?.addEventListener('click', openCallSimulatorModal);
  document.getElementById('btnListenLive')?.addEventListener('click', openCallSimulatorModal);
  document.getElementById('btnTestVoiceCall')?.addEventListener('click', openCallSimulatorModal);

  // Boton para silenciar llamada
  document.getElementById('btnToggleMute')?.addEventListener('click', toggleMute);

  // Boton para abrir modal de Nuevo Registro / Lead
  document.getElementById('actionNewLead')?.addEventListener('click', openNewLeadModal);
  document.getElementById('btnCloseNewLeadModal')?.addEventListener('click', closeNewLeadModal);
  document.getElementById('btnCancelNewLead')?.addEventListener('click', closeNewLeadModal);

  // Otros botones de accion rapida
  document.getElementById('actionUpdateMenu')?.addEventListener('click', openUploadModal);
  document.getElementById('actionLiveChat')?.addEventListener('click', () => {
    Toast.show('Abriendo bandeja de WhatsApp con 8 conversaciones', 'info');
  });
  document.getElementById('btnWhatsAppQuick')?.addEventListener('click', () => {
    Toast.show('WhatsApp: 8 mensajes pendientes de atencion', 'info');
  });

  // Cerrar Drawer
  document.getElementById('btnCloseDrawer')?.addEventListener('click', closeDrawer);
  document.getElementById('txDetailDrawer')?.addEventListener('click', (e) => {
    if (e.target.id === 'txDetailDrawer') closeDrawer();
  });

  // Cerrar modales al hacer click en el backdrop
  document.getElementById('newLeadModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'newLeadModal') closeNewLeadModal();
  });
  document.getElementById('callSimulatorModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'callSimulatorModal') closeCallSimulatorModal();
  });
  document.getElementById('businessProfileModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'businessProfileModal') closeProfileModal();
  });
  document.getElementById('integracionesModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'integracionesModal') closeIntegrationsModal();
  });

  // Menu movil responsive
  const sidebar = document.getElementById('mainSidebar');
  const toggleMobile = document.getElementById('mobileSidebarToggle');
  const closeMobile = document.getElementById('mobileSidebarClose');

  if (toggleMobile && sidebar) {
    toggleMobile.addEventListener('click', () => sidebar.classList.add('mobile-open'));
  }
  if (closeMobile && sidebar) {
    closeMobile.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
  }

  // Navegacion en sidebar
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      if (tab === 'integraciones') return; // Manejado por su propio modal
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const label = item.querySelector('.nav-label')?.textContent || 'Vista';
      Toast.show(`Cambiando a: ${label}`, 'info');
    });
  });
});
