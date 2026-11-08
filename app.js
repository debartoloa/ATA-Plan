/**
 * ATA Planner — Versione HTML + CSS + JavaScript Puro (Vanilla JS)
 * Nessuna dipendenza di compilazione. Pronto per GitHub Pages e uso offline.
 */

(function () {
  'use strict';

  const SETTINGS_KEY = 'ata_planner_settings_v1';
  const EVENTS_KEY = 'ata_planner_events_v1';

  const START_HOUR = 7; // 07:00
  const END_HOUR = 20;  // 20:00
  const HOURS_ARRAY = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const DAY_NAMES_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  const DAY_NAMES_FULL = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

  const PRESETS_6_DAYS = [
    { id: '6d_0730_1330', label: '07:30 - 13:30', start: '07:30', end: '13:30', desc: 'Turno mattutino anticipato (6h)' },
    { id: '6d_0800_1400', label: '08:00 - 14:00', start: '08:00', end: '14:00', desc: 'Turno standard mattutino (6h)' },
    { id: '6d_0900_1500', label: '09:00 - 15:00', start: '09:00', end: '15:00', desc: 'Turno posticipato (6h)' },
    { id: 'custom', label: 'Scelta libera', start: '08:00', end: '14:00', desc: 'Personalizza ora ingresso e uscita' },
  ];

  const PRESETS_5_DAYS = [
    { id: '5d_0745_1442', label: '07:45 - 14:42', start: '07:45', end: '14:42', desc: 'Fascia proposta su 5 giorni' },
    { id: 'custom', label: 'Scelta libera', start: '07:45', end: '14:57', desc: 'Personalizza ora ingresso e uscita' },
  ];

  const CATEGORIES = [
    { id: 'FERIE', label: 'Ferie', desc: 'Giornata intera o ad ore' },
    { id: 'FESTIVITA_SOPPRESSE', label: 'Festività Soppresse', desc: 'Solo a giornata intera (1 gg)' },
    { id: 'PERMESSI_PERSONALI', label: 'Permessi Personali', desc: 'Fruizione ad ore (monte 18h)' },
    { id: 'VISITA_SPECIALISTICA', label: 'Visita Specialistica', desc: 'Esami/visite ad ore (monte 18h)' },
    { id: 'MONTE_ORE', label: 'Monte Ore Recupero', desc: '+ Straordinario / - Recupero' },
  ];

  // ============================================================================
  // ICONE SVG INLINE (Lucide Icons)
  // ============================================================================
  const ICONS = {
    graduationCap: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,
    checkCircle: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
    wifiOff: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/></svg>`,
    clock: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    calendar: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    listTodo: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>`,
    plus: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    settings: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    palmtree: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/></svg>`,
    sparkles: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>`,
    userCheck: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
    stethoscope: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
    trendingUp: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    trendingDown: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`,
    chevronLeft: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    chevronRight: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    rows3: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 9H3"/><path d="M21 15H3"/></svg>`,
    columns3: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
    close: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    award: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    plusCircle: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
    minusCircle: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>`,
    trash: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    edit: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    download: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    upload: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
    spreadsheet: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>`,
    check: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  };

  // ============================================================================
  // UTILITY DI CALCOLO E FORMATTAZIONE
  // ============================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getDailyHours(scheduleType) {
    return scheduleType === '6_days' ? 6 : 7.2;
  }

  function toISODateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseISODate(dateStr) {
    const parts = (dateStr || '').split('-').map(Number);
    return new Date(parts[0] || 2026, (parts[1] || 1) - 1, parts[2] || 1, 12, 0, 0);
  }

  function getSchoolYearForDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startYear = month >= 8 ? year : year - 1;
    const endYear = startYear + 1;
    return {
      label: `${startYear}/${endYear}`,
      startYear,
      endYear,
      startDate: `${startYear}-09-01`,
      endDate: `${endYear}-08-31`,
    };
  }

  function getSchoolYearBoundsFromLabel(label) {
    const parts = (label || '').split('/');
    const startYear = parseInt(parts[0], 10) || 2026;
    const endYear = parseInt(parts[1], 10) || startYear + 1;
    return {
      label: `${startYear}/${endYear}`,
      startYear,
      endYear,
      startDate: `${startYear}-09-01`,
      endDate: `${endYear}-08-31`,
    };
  }

  function isDateInSchoolYear(dateStr, schoolYearLabel) {
    const bounds = getSchoolYearBoundsFromLabel(schoolYearLabel);
    return dateStr >= bounds.startDate && dateStr <= bounds.endDate;
  }

  function getAvailableSchoolYears() {
    const current = getSchoolYearForDate(new Date());
    const list = [];
    for (let y = current.startYear - 2; y <= current.startYear + 2; y++) {
      list.push(`${y}/${y + 1}`);
    }
    return list;
  }

  function timeToMinutes(time) {
    const parts = (time || '00:00').split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }

  function minutesToTime(totalMinutes) {
    const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(totalMinutes)));
    const h = Math.floor(clamped / 60);
    const m = clamped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function calculateDurationHours(startTime, endTime) {
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    if (endMin <= startMin) return 0;
    return Number(((endMin - startMin) / 60).toFixed(4));
  }

  function formatHoursToReadable(hoursDecimal, showSign = false) {
    const sign = hoursDecimal < 0 ? '-' : showSign && hoursDecimal > 0 ? '+' : '';
    const absHours = Math.abs(hoursDecimal);
    const totalMinutes = Math.round(absHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (m === 0) return `${sign}${h}h`;
    return `${sign}${h}h ${m}m`;
  }

  function formatDaysDecimal(days) {
    const rounded = Math.round(days * 100) / 100;
    return rounded.toLocaleString('it-IT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function getWeekDays(referenceDate) {
    const d = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
      12,
      0,
      0
    );
    const day = d.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      days.push(current);
    }
    return days;
  }

  function getEventStyleMeta(category, monteOreOp) {
    switch (category) {
      case 'FERIE':
        return {
          label: 'Ferie',
          shortLabel: 'Ferie',
          badgeBg: 'bg-emerald-100/90',
          badgeText: 'text-emerald-800',
          blockBg: 'bg-gradient-to-br from-emerald-500/90 to-teal-600/90',
          blockText: 'text-white',
          dotColor: 'bg-emerald-500',
          accentGradient: 'from-emerald-500 to-teal-600',
        };
      case 'FESTIVITA_SOPPRESSE':
        return {
          label: 'Festività Soppresse',
          shortLabel: 'Fest. Soppr.',
          badgeBg: 'bg-teal-100/90',
          badgeText: 'text-teal-800',
          blockBg: 'bg-gradient-to-br from-teal-500/90 to-cyan-600/90',
          blockText: 'text-white',
          dotColor: 'bg-teal-500',
          accentGradient: 'from-teal-500 to-cyan-600',
        };
      case 'PERMESSI_PERSONALI':
        return {
          label: 'Permessi Personali',
          shortLabel: 'Permesso',
          badgeBg: 'bg-violet-100/90',
          badgeText: 'text-violet-800',
          blockBg: 'bg-gradient-to-br from-violet-500/90 to-purple-600/90',
          blockText: 'text-white',
          dotColor: 'bg-violet-500',
          accentGradient: 'from-violet-500 to-purple-600',
        };
      case 'VISITA_SPECIALISTICA':
        return {
          label: 'Visita Specialistica',
          shortLabel: 'Visita Spec.',
          badgeBg: 'bg-rose-100/90',
          badgeText: 'text-rose-800',
          blockBg: 'bg-gradient-to-br from-rose-500/90 to-red-600/90',
          blockText: 'text-white',
          dotColor: 'bg-rose-500',
          accentGradient: 'from-rose-500 to-red-600',
        };
      case 'MONTE_ORE':
        if (monteOreOp === 'SUBTRACT') {
          return {
            label: 'Monte Ore (- Recupero)',
            shortLabel: 'Recupero (-)',
            badgeBg: 'bg-amber-100/90',
            badgeText: 'text-amber-900',
            blockBg: 'bg-gradient-to-br from-orange-500/90 to-amber-600/90',
            blockText: 'text-white',
            dotColor: 'bg-orange-500',
            accentGradient: 'from-orange-500 to-amber-600',
          };
        }
        return {
          label: 'Monte Ore (+ Straordinario)',
          shortLabel: 'Straordinario (+)',
          badgeBg: 'bg-sky-100/90',
          badgeText: 'text-sky-900',
          blockBg: 'bg-gradient-to-br from-sky-500/90 to-blue-600/90',
          blockText: 'text-white',
          dotColor: 'bg-sky-500',
          accentGradient: 'from-sky-500 to-blue-600',
        };
      default:
        return {
          label: 'Evento',
          shortLabel: 'Evento',
          badgeBg: 'bg-slate-100',
          badgeText: 'text-slate-800',
          blockBg: 'bg-slate-600',
          blockText: 'text-white',
          dotColor: 'bg-slate-500',
          accentGradient: 'from-slate-600 to-slate-700',
        };
    }
  }

  function calculateCounters(events, settings) {
    const dailyHours = getDailyHours(settings.scheduleType);
    const initialFerieDays = settings.hasThreeYearsSeniority ? 32 : 30;
    const initialFerieHours = Number((initialFerieDays * dailyHours).toFixed(2));

    const schoolYearEvents = events.filter((ev) =>
      isDateInSchoolYear(ev.date, settings.activeSchoolYear)
    );

    let ferieUsedDays = 0;
    let ferieUsedHours = 0;
    let festivitaUsedDays = 0;
    let permessiUsedHours = 0;
    let visitaUsedHours = 0;
    let monteOreAdded = 0;
    let monteOreSubtracted = 0;

    for (const ev of schoolYearEvents) {
      switch (ev.category) {
        case 'FERIE':
          if (ev.ferieMode === 'FULL_DAY' || ev.isFullDay) {
            ferieUsedDays += 1;
            ferieUsedHours += dailyHours;
          } else {
            ferieUsedHours += ev.durationHours;
            ferieUsedDays += ev.durationHours / dailyHours;
          }
          break;
        case 'FESTIVITA_SOPPRESSE':
          festivitaUsedDays += 1;
          break;
        case 'PERMESSI_PERSONALI':
          permessiUsedHours += ev.durationHours;
          break;
        case 'VISITA_SPECIALISTICA':
          visitaUsedHours += ev.durationHours;
          break;
        case 'MONTE_ORE':
          if (ev.monteOreOp === 'ADD') {
            monteOreAdded += ev.durationHours;
          } else {
            monteOreSubtracted += ev.durationHours;
          }
          break;
      }
    }

    const netMonteOre = monteOreAdded - monteOreSubtracted;

    return {
      dailyHours,
      ferie: {
        initialDays: initialFerieDays,
        initialHours: initialFerieHours,
        usedDaysEquivalent: ferieUsedDays,
        usedHoursTotal: ferieUsedHours,
        remainingDays: initialFerieDays - ferieUsedDays,
        remainingHours: initialFerieHours - ferieUsedHours,
      },
      festivitaSoppresse: {
        initialDays: 4,
        usedDays: festivitaUsedDays,
        remainingDays: 4 - festivitaUsedDays,
        remainingHours: (4 - festivitaUsedDays) * dailyHours,
      },
      permessiPersonali: {
        initialHours: 18,
        usedHours: permessiUsedHours,
        remainingHours: 18 - permessiUsedHours,
      },
      visitaSpecialistica: {
        initialHours: 18,
        usedHours: visitaUsedHours,
        remainingHours: 18 - visitaUsedHours,
      },
      monteOre: {
        addedHours: monteOreAdded,
        subtractedHours: monteOreSubtracted,
        netHours: netMonteOre,
        netDaysEquivalent: netMonteOre / dailyHours,
      },
    };
  }

  // ============================================================================
  // PERSISTENZA E STORAGE
  // ============================================================================
  function getDefaultSettings() {
    const currentSY = getSchoolYearForDate(new Date());
    return {
      onboarded: false,
      profileName: 'Assistente Amministrativo',
      scheduleType: '5_days',
      hasThreeYearsSeniority: true,
      shiftPreset: '5d_0745_1442',
      shiftStart: '07:45',
      shiftEnd: '14:42',
      activeSchoolYear: currentSY.label,
    };
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return getDefaultSettings();
      return { ...getDefaultSettings(), ...JSON.parse(raw) };
    } catch {
      return getDefaultSettings();
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch (e) {
      console.error('Errore salvataggio impostazioni:', e);
    }
  }

  function loadEvents() {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveEvents(evList) {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(evList));
    } catch (e) {
      console.error('Errore salvataggio eventi:', e);
    }
  }

  // ============================================================================
  // STATO APPLICAZIONE
  // ============================================================================
  const initialSettings = loadSettings();

  const state = {
    settings: initialSettings,
    events: loadEvents(),
    activeTab: 'calendar', // 'calendar' | 'history'
    layoutMode: 'timeline', // 'timeline' | 'columns'
    currentDate: new Date(),
    isOnline: navigator.onLine,

    // Filtri vista storico
    searchQuery: '',
    categoryFilter: 'ALL',
    onlyCurrentSY: true,
    importStatus: null,

    // Modale Onboarding / Impostazioni
    isSettingsOpen: !initialSettings.onboarded,
    settingsForm: { ...initialSettings },

    // Modale Evento
    eventModalOpen: false,
    editingEventId: null,
    eventForm: {
      date: toISODateString(new Date()),
      category: 'FERIE',
      ferieMode: 'FULL_DAY',
      monteOreOp: 'ADD',
      inputMode: 'TIME_RANGE',
      startTime: initialSettings.shiftStart,
      endTime: initialSettings.shiftEnd,
      directHours: 2,
      notes: '',
      errorMsg: null,
    },
  };

  // ============================================================================
  // FUNZIONI DI APERTURA MODALI ED EXPORT
  // ============================================================================
  function openSettingsModal() {
    state.settingsForm = { ...state.settings };
    state.isSettingsOpen = true;
    render();
  }

  function openNewEventModal(dateStr, startTime, category) {
    const cat = category || 'FERIE';
    let sTime = state.settings.shiftStart;
    let eTime = state.settings.shiftEnd;
    let fMode = 'FULL_DAY';

    if (startTime) {
      sTime = startTime;
      eTime = minutesToTime(timeToMinutes(startTime) + 120);
      if (cat === 'FERIE') fMode = 'HOURLY';
    }

    state.editingEventId = null;
    state.eventForm = {
      date: dateStr || toISODateString(state.currentDate),
      category: cat,
      ferieMode: fMode,
      monteOreOp: 'ADD',
      inputMode: 'TIME_RANGE',
      startTime: sTime,
      endTime: eTime,
      directHours: 2,
      notes: '',
      errorMsg: null,
    };
    state.eventModalOpen = true;
    render();
  }

  function openEditEventModal(eventId) {
    const ev = state.events.find((x) => x.id === eventId);
    if (!ev) return;

    state.editingEventId = ev.id;
    state.eventForm = {
      date: ev.date,
      category: ev.category,
      ferieMode: ev.ferieMode || (ev.isFullDay ? 'FULL_DAY' : 'HOURLY'),
      monteOreOp: ev.monteOreOp || 'ADD',
      inputMode: 'TIME_RANGE',
      startTime: ev.startTime,
      endTime: ev.endTime,
      directHours: ev.durationHours,
      notes: ev.notes || '',
      errorMsg: null,
    };
    state.eventModalOpen = true;
    render();
  }

  function exportBackupJSON() {
    const payload = {
      app: 'ATA_PLANNER',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      events: state.events,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const datePart = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `ATA_Planner_Backup_${state.settings.activeSchoolYear.replace('/', '-')}_${datePart}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportEventsCSV(filteredList) {
    const headers = [
      'ID',
      'Data',
      'Causale',
      'Modalità',
      'Ora Inizio',
      'Ora Fine',
      'Durata (Ore Decimali)',
      'Durata (Leggibile)',
      'Note',
    ];
    const sorted = [...filteredList].sort((a, b) => a.date.localeCompare(b.date));
    const rows = sorted.map((ev) => {
      const meta = getEventStyleMeta(ev.category, ev.monteOreOp);
      const modeLabel = ev.isFullDay
        ? 'Giornata Intera'
        : ev.category === 'MONTE_ORE'
        ? ev.monteOreOp === 'ADD'
          ? '+ Straordinario'
          : '- Recupero'
        : 'Ad Ore';
      const safeNotes = (ev.notes || '').replace(/"/g, '""');
      return [
        ev.id,
        ev.date,
        `"${meta.label}"`,
        `"${modeLabel}"`,
        ev.startTime,
        ev.endTime,
        ev.durationHours.toString().replace('.', ','),
        `"${formatHoursToReadable(ev.durationHours)}"`,
        `"${safeNotes}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const datePart = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `ATA_Planner_Eventi_${state.settings.activeSchoolYear.replace('/', '-')}_${datePart}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================================================
  // RENDERING DEI COMPONENTI HTML
  // ============================================================================
  function renderHeader() {
    const s = state.settings;
    const years = getAvailableSchoolYears();

    return `
      <header class="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-white/80 shadow-sm">
        <div class="max-w-7xl mx-auto px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              ${ICONS.graduationCap}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 truncate">
                  ATA Planner
                </h1>
                <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-bold">
                  ${
                    state.isOnline
                      ? `<span class="text-emerald-600">${ICONS.checkCircle}</span> Offline-Ready`
                      : `<span class="text-amber-600">${ICONS.wifiOff}</span> Modalità Offline`
                  }
                </span>
              </div>
              <p class="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                <span class="font-semibold text-slate-700">${escapeHtml(s.profileName)}</span>
                <span>•</span>
                <span>${s.scheduleType === '6_days' ? '6 gg (6h)' : '5 gg (7h 12m)'}</span>
                <span>•</span>
                <span>${s.hasThreeYearsSeniority ? '32 gg Ferie' : '30 gg Ferie'}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <div class="hidden md:flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
              <span class="text-[11px] font-bold text-slate-500">A.S.</span>
              <select data-change="active-sy" aria-label="Seleziona Anno Scolastico" class="bg-transparent text-xs font-extrabold text-indigo-950 focus:outline-none cursor-pointer">
                ${years
                  .map(
                    (sy) =>
                      `<option value="${sy}" ${sy === s.activeSchoolYear ? 'selected' : ''}>${sy}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="hidden sm:inline-flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/80">
              <button type="button" data-action="switch-tab" data-tab="calendar" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                state.activeTab === 'calendar'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }">
                ${ICONS.calendar} Calendario
              </button>
              <button type="button" data-action="switch-tab" data-tab="history" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                state.activeTab === 'history'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }">
                ${ICONS.listTodo} Storico (${state.events.length})
              </button>
            </div>

            <button type="button" data-action="open-new-event" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition">
              ${ICONS.plus}
              <span class="hidden sm:inline">Nuovo Evento</span>
              <span class="sm:hidden">Aggiungi</span>
            </button>

            <button type="button" data-action="open-settings" class="p-2 rounded-xl bg-white/90 hover:bg-slate-100 border border-slate-200/80 text-slate-700 shadow-sm transition" title="Configurazione Orario & Anno Scolastico">
              ${ICONS.settings}
            </button>
          </div>
        </div>
      </header>
    `;
  }

  function renderCounters(counters) {
    const {
      ferie,
      festivitaSoppresse,
      permessiPersonali,
      visitaSpecialistica,
      monteOre,
      dailyHours,
    } = counters;

    const feriePct = Math.max(0, Math.min(100, (ferie.remainingHours / ferie.initialHours) * 100));
    const festPct = Math.max(
      0,
      Math.min(100, (festivitaSoppresse.remainingDays / festivitaSoppresse.initialDays) * 100)
    );
    const permPct = Math.max(
      0,
      Math.min(100, (permessiPersonali.remainingHours / permessiPersonali.initialHours) * 100)
    );
    const visitaPct = Math.max(
      0,
      Math.min(100, (visitaSpecialistica.remainingHours / visitaSpecialistica.initialHours) * 100)
    );

    const monteIsPositive = monteOre.netHours > 0;
    const monteIsNegative = monteOre.netHours < 0;

    return `
      <section aria-label="Contatori Anno Scolastico" class="w-full">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          <!-- 1. FERIE -->
          <div data-action="quick-add-cat" data-category="FERIE" class="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-emerald-300/80 transition-all">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700">1. Ferie</span>
                <div class="mt-1 flex items-baseline gap-1.5">
                  <span class="text-xl sm:text-2xl font-extrabold text-slate-900">${formatDaysDecimal(ferie.remainingDays)}</span>
                  <span class="text-xs font-semibold text-slate-500">/ ${ferie.initialDays} gg</span>
                </div>
              </div>
              <div class="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 group-hover:scale-105 transition">
                ${ICONS.palmtree}
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between text-[11px] text-slate-600">
              <span>In ore: <strong class="text-slate-800">${formatHoursToReadable(ferie.remainingHours)}</strong></span>
              <span class="text-[10px] text-slate-400">(${formatHoursToReadable(dailyHours)}/g)</span>
            </div>
            <div class="mt-2 w-full h-1.5 rounded-full bg-emerald-100 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300" style="width: ${feriePct}%"></div>
            </div>
          </div>

          <!-- 2. FESTIVITÀ SOPPRESSE -->
          <div data-action="quick-add-cat" data-category="FESTIVITA_SOPPRESSE" class="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-teal-300/80 transition-all">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-teal-700">2. Fest. Soppresse</span>
                <div class="mt-1 flex items-baseline gap-1.5">
                  <span class="text-xl sm:text-2xl font-extrabold text-slate-900">${formatDaysDecimal(festivitaSoppresse.remainingDays)}</span>
                  <span class="text-xs font-semibold text-slate-500">/ 4 gg</span>
                </div>
              </div>
              <div class="p-2 rounded-xl bg-teal-500/15 text-teal-600 group-hover:scale-105 transition">
                ${ICONS.sparkles}
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between text-[11px] text-slate-600">
              <span>Fruite: <strong class="text-slate-800">${festivitaSoppresse.usedDays} gg</strong></span>
              <span class="text-[10px] text-slate-400">Giornata intera</span>
            </div>
            <div class="mt-2 w-full h-1.5 rounded-full bg-teal-100 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300" style="width: ${festPct}%"></div>
            </div>
          </div>

          <!-- 3. PERMESSI PERSONALI -->
          <div data-action="quick-add-cat" data-category="PERMESSI_PERSONALI" class="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-violet-300/80 transition-all">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-violet-700">3. Permessi Pers.</span>
                <div class="mt-1 flex items-baseline gap-1.5">
                  <span class="text-xl sm:text-2xl font-extrabold text-slate-900">${formatHoursToReadable(permessiPersonali.remainingHours)}</span>
                  <span class="text-xs font-semibold text-slate-500">/ 18h</span>
                </div>
              </div>
              <div class="p-2 rounded-xl bg-violet-500/15 text-violet-600 group-hover:scale-105 transition">
                ${ICONS.userCheck}
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between text-[11px] text-slate-600">
              <span>Usate: <strong class="text-slate-800">${formatHoursToReadable(permessiPersonali.usedHours)}</strong></span>
              <span class="text-[10px] text-slate-400">Art. 31 CCNL</span>
            </div>
            <div class="mt-2 w-full h-1.5 rounded-full bg-violet-100 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300" style="width: ${permPct}%"></div>
            </div>
          </div>

          <!-- 4. VISITA SPECIALISTICA -->
          <div data-action="quick-add-cat" data-category="VISITA_SPECIALISTICA" class="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-rose-300/80 transition-all">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-rose-700">4. Visita Spec.</span>
                <div class="mt-1 flex items-baseline gap-1.5">
                  <span class="text-xl sm:text-2xl font-extrabold text-slate-900">${formatHoursToReadable(visitaSpecialistica.remainingHours)}</span>
                  <span class="text-xs font-semibold text-slate-500">/ 18h</span>
                </div>
              </div>
              <div class="p-2 rounded-xl bg-rose-500/15 text-rose-600 group-hover:scale-105 transition">
                ${ICONS.stethoscope}
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between text-[11px] text-slate-600">
              <span>Usate: <strong class="text-slate-800">${formatHoursToReadable(visitaSpecialistica.usedHours)}</strong></span>
              <span class="text-[10px] text-slate-400">Terapie/Esami</span>
            </div>
            <div class="mt-2 w-full h-1.5 rounded-full bg-rose-100 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-300" style="width: ${visitaPct}%"></div>
            </div>
          </div>

          <!-- 5. MONTE ORE RECUPERO -->
          <div data-action="quick-add-cat" data-category="MONTE_ORE" class="col-span-2 sm:col-span-1 group cursor-pointer relative overflow-hidden rounded-2xl backdrop-blur-xl border p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all ${
            monteIsNegative
              ? 'bg-amber-50/80 border-orange-300/80'
              : monteIsPositive
              ? 'bg-sky-50/80 border-sky-300/80'
              : 'bg-white/75 border-white/80'
          }">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider ${
                  monteIsNegative
                    ? 'text-orange-700'
                    : monteIsPositive
                    ? 'text-sky-700'
                    : 'text-slate-600'
                }">5. Monte Ore Rec.</span>
                <div class="mt-1 flex items-baseline gap-1.5">
                  <span class="text-xl sm:text-2xl font-extrabold ${
                    monteIsNegative
                      ? 'text-orange-600'
                      : monteIsPositive
                      ? 'text-sky-600'
                      : 'text-slate-900'
                  }">
                    ${formatHoursToReadable(monteOre.netHours, true)}
                  </span>
                  <span class="text-[11px] font-semibold text-slate-500">
                    (${formatDaysDecimal(monteOre.netDaysEquivalent)} gg)
                  </span>
                </div>
              </div>
              <div class="p-2 rounded-xl transition group-hover:scale-105 ${
                monteIsNegative
                  ? 'bg-orange-500/15 text-orange-600'
                  : 'bg-sky-500/15 text-sky-600'
              }">
                ${
                  monteIsNegative
                    ? ICONS.trendingDown
                    : monteIsPositive
                    ? ICONS.trendingUp
                    : ICONS.clock
                }
              </div>
            </div>
            <div class="mt-2.5 flex items-center justify-between text-[11px]">
              <span class="px-2 py-0.5 rounded-md bg-sky-100/90 text-sky-800 font-semibold">+ ${formatHoursToReadable(monteOre.addedHours)}</span>
              <span class="px-2 py-0.5 rounded-md bg-orange-100/90 text-orange-800 font-semibold">- ${formatHoursToReadable(monteOre.subtractedHours)}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function getTimeSlotGeometry(start, end) {
    const minBound = START_HOUR * 60;
    const maxBound = END_HOUR * 60;
    const totalMinutes = maxBound - minBound;

    const sMin = Math.max(minBound, Math.min(maxBound, timeToMinutes(start)));
    const eMin = Math.max(sMin + 25, Math.min(maxBound, timeToMinutes(end)));

    const startPct = ((sMin - minBound) / totalMinutes) * 100;
    const sizePct = ((eMin - sMin) / totalMinutes) * 100;
    return { startPct, sizePct };
  }

  function renderWeeklySchedule() {
    const s = state.settings;
    const weekDays = getWeekDays(state.currentDate);
    const todayStr = toISODateString(new Date());

    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    const startFmt = firstDay.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    const endFmt = lastDay.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const shiftGeo = getTimeSlotGeometry(s.shiftStart, s.shiftEnd);
    const isWorkDay = (dayIdx) => {
      if (dayIdx === 6) return false;
      if (s.scheduleType === '5_days' && dayIdx === 5) return false;
      return true;
    };

    return `
      <div class="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/85 shadow-xl shadow-indigo-950/5 overflow-hidden">
        <!-- Header del Calendario -->
        <div class="p-4 sm:p-5 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/50">
          <div class="flex items-center gap-2.5">
            <div class="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              ${ICONS.calendar}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-extrabold text-slate-900 capitalize">${startFmt} – ${endFmt}</h2>
                <span class="px-2 py-0.5 rounded-lg bg-indigo-100/90 text-indigo-800 text-[11px] font-bold">A.S. ${s.activeSchoolYear}</span>
              </div>
              <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                Turno base: <strong>${s.shiftStart} – ${s.shiftEnd}</strong> (${
      s.scheduleType === '6_days' ? '6 gg • 6h/g' : '5 gg • 7h 12m/g'
    })
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-2">
            <div class="inline-flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/70">
              <button type="button" data-action="set-layout" data-layout="timeline" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                state.layoutMode === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }">
                ${ICONS.rows3} <span class="hidden md:inline">Timeline</span>
              </button>
              <button type="button" data-action="set-layout" data-layout="columns" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                state.layoutMode === 'columns'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }">
                ${ICONS.columns3} <span class="hidden md:inline">Colonne</span>
              </button>
            </div>

            <div class="flex items-center gap-1.5">
              <button type="button" data-action="prev-week" class="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-700 shadow-sm transition" title="Settimana precedente">
                ${ICONS.chevronLeft}
              </button>
              <button type="button" data-action="today-week" class="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200/90 text-xs font-bold text-indigo-700 shadow-sm transition">
                Oggi
              </button>
              <button type="button" data-action="next-week" class="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-700 shadow-sm transition" title="Settimana successiva">
                ${ICONS.chevronRight}
              </button>
            </div>
          </div>
        </div>

        <!-- Legenda rapida -->
        <div class="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="inline-flex items-center gap-1.5 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Ferie</span>
            <span class="inline-flex items-center gap-1.5 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Fest. Soppr.</span>
            <span class="inline-flex items-center gap-1.5 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Permessi</span>
            <span class="inline-flex items-center gap-1.5 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Visita Spec.</span>
            <span class="inline-flex items-center gap-1.5 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Monte Ore (+)</span>
            <span class="inline-flex items-center gap-1.5 font-semibold"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Recupero (-)</span>
          </div>
          <span class="text-[10px] text-slate-400">Tocca uno slot orario per registrare un evento</span>
        </div>

        ${
          state.layoutMode === 'timeline'
            ? `
          <div class="overflow-x-auto touch-pan-x">
            <div class="min-w-[780px]">
              <div class="grid grid-cols-[132px_1fr] border-b border-slate-200/80 bg-slate-100/60">
                <div class="px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200/80 sticky left-0 bg-slate-100/95 backdrop-blur-md z-20">
                  Giorno
                </div>
                <div class="grid-cols-13 relative">
                  ${HOURS_ARRAY.map(
                    (hour) => `
                    <div class="py-2.5 px-1.5 text-[11px] font-bold text-slate-500 border-r border-slate-200/50 last:border-r-0 text-left">
                      ${String(hour).padStart(2, '0')}:00
                    </div>
                  `
                  ).join('')}
                </div>
              </div>

              <div class="divide-y divide-slate-200/70">
                ${weekDays
                  .map((dayDate, dayIdx) => {
                    const dateStr = toISODateString(dayDate);
                    const isToday = dateStr === todayStr;
                    const workDay = isWorkDay(dayIdx);
                    const dayEvents = state.events.filter((ev) => ev.date === dateStr);

                    return `
                    <div class="grid grid-cols-[132px_1fr] min-h-[76px] transition-colors ${
                      isToday
                        ? 'bg-indigo-50/40'
                        : !workDay
                        ? 'bg-slate-50/60'
                        : 'bg-white/40 hover:bg-white/80'
                    }">
                      <div data-action="slot-click" data-date="${dateStr}" class="cursor-pointer p-3 border-r border-slate-200/80 sticky left-0 z-20 flex items-center justify-between backdrop-blur-md transition ${
                      isToday
                        ? 'bg-indigo-50/95'
                        : !workDay
                        ? 'bg-slate-100/90'
                        : 'bg-white/90 hover:bg-indigo-50/60'
                    }">
                        <div>
                          <div class="flex items-center gap-1.5">
                            <span class="text-xs font-extrabold uppercase tracking-wide ${
                              isToday
                                ? 'text-indigo-600'
                                : dayIdx === 6
                                ? 'text-rose-500'
                                : 'text-slate-700'
                            }">${DAY_NAMES_SHORT[dayIdx]}</span>
                            ${
                              isToday
                                ? '<span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>'
                                : ''
                            }
                          </div>
                          <div class="text-lg font-black leading-tight ${
                            isToday ? 'text-indigo-700' : 'text-slate-900'
                          }">
                            ${dayDate.getDate()} <span class="text-[11px] font-semibold text-slate-400">${dayDate.toLocaleDateString(
                      'it-IT',
                      { month: 'short' }
                    )}</span>
                          </div>
                        </div>
                        <button type="button" data-action="slot-click" data-date="${dateStr}" class="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-500 transition">
                          ${ICONS.plus}
                        </button>
                      </div>

                      <div class="relative grid-cols-13">
                        ${
                          workDay
                            ? `<div class="pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl bg-indigo-500/[0.04] border border-dashed border-indigo-300/50" style="left: ${shiftGeo.startPct}%; width: ${shiftGeo.sizePct}%;"></div>`
                            : ''
                        }

                        ${HOURS_ARRAY.map((hour) => {
                          const slotStart = `${String(hour).padStart(2, '0')}:00`;
                          return `<div data-action="slot-click" data-date="${dateStr}" data-time="${slotStart}" class="h-full min-h-[74px] border-r border-slate-200/40 last:border-r-0 hover:bg-indigo-500/5 cursor-pointer transition" title="${DAY_NAMES_FULL[dayIdx]} ore ${slotStart}"></div>`;
                        }).join('')}

                        ${dayEvents
                          .map((ev, idx) => {
                            const style = getEventStyleMeta(ev.category, ev.monteOreOp);
                            const geo = getTimeSlotGeometry(ev.startTime, ev.endTime);
                            const totalDayEvents = dayEvents.length;
                            const heightPct = totalDayEvents > 1 ? 82 / totalDayEvents : 78;
                            const topPct =
                              totalDayEvents > 1 ? 9 + idx * (82 / totalDayEvents) : 11;

                            return `
                            <div data-action="edit-event" data-id="${ev.id}" style="left: ${
                              geo.startPct
                            }%; width: ${Math.max(
                              geo.sizePct,
                              7.5
                            )}%; top: ${topPct}%; height: ${heightPct}%;" class="absolute z-10 rounded-xl px-2.5 py-1 ${
                              style.blockBg
                            } ${
                              style.blockText
                            } shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer transition-all flex flex-col justify-center overflow-hidden border border-white/30">
                              <div class="flex items-center justify-between gap-1 text-[11px] font-extrabold leading-tight truncate">
                                <span class="truncate">${style.shortLabel}</span>
                                <span class="text-[10px] opacity-90 shrink-0">${
                                  ev.isFullDay
                                    ? '1 gg'
                                    : formatHoursToReadable(
                                        ev.category === 'MONTE_ORE' && ev.monteOreOp === 'SUBTRACT'
                                          ? -ev.durationHours
                                          : ev.durationHours,
                                        ev.category === 'MONTE_ORE'
                                      )
                                }</span>
                              </div>
                              <div class="text-[10px] opacity-90 truncate leading-tight">
                                ${
                                  ev.isFullDay
                                    ? `Giornata intera (${ev.startTime}-${ev.endTime})`
                                    : `${ev.startTime} – ${ev.endTime}`
                                }${ev.notes ? ` • ${escapeHtml(ev.notes)}` : ''}
                              </div>
                            </div>
                          `;
                          })
                          .join('')}
                      </div>
                    </div>
                  `;
                  })
                  .join('')}
              </div>
            </div>
          </div>
        `
            : `
          <!-- VISTA COLONNE -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70">
            ${weekDays
              .map((dayDate, dayIdx) => {
                const dateStr = toISODateString(dayDate);
                const isToday = dateStr === todayStr;
                const workDay = isWorkDay(dayIdx);
                const dayEvents = state.events.filter((ev) => ev.date === dateStr);

                return `
                <div class="p-3.5 flex flex-col justify-between min-h-[150px] transition ${
                  isToday ? 'bg-indigo-50/50' : !workDay ? 'bg-slate-50/70' : 'bg-white/40'
                }">
                  <div>
                    <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/60">
                      <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
                          isToday ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-800'
                        }">${dayDate.getDate()}</span>
                        <div>
                          <div class="text-xs font-extrabold text-slate-800">${DAY_NAMES_FULL[dayIdx]}</div>
                          <div class="text-[10px] text-slate-400">${
                            workDay ? `Turno ${s.shiftStart}-${s.shiftEnd}` : 'Riposo / Non lavorativo'
                          }</div>
                        </div>
                      </div>
                      <button type="button" data-action="slot-click" data-date="${dateStr}" class="p-1.5 rounded-xl bg-white hover:bg-indigo-600 hover:text-white text-slate-600 border border-slate-200/80 shadow-sm transition">
                        ${ICONS.plus}
                      </button>
                    </div>

                    <div class="space-y-2">
                      ${
                        dayEvents.length === 0
                          ? `<div data-action="slot-click" data-date="${dateStr}" class="py-5 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition">Nessun evento • Tocca per aggiungere</div>`
                          : dayEvents
                              .map((ev) => {
                                const style = getEventStyleMeta(ev.category, ev.monteOreOp);
                                return `
                                <div data-action="edit-event" data-id="${ev.id}" class="p-2.5 rounded-xl ${style.blockBg} ${style.blockText} shadow-sm cursor-pointer hover:opacity-95 transition">
                                  <div class="flex items-center justify-between text-xs font-extrabold">
                                    <span>${style.shortLabel}</span>
                                    <span>${ev.isFullDay ? '1 Giorno' : formatHoursToReadable(ev.durationHours)}</span>
                                  </div>
                                  <div class="text-[11px] opacity-90 mt-0.5">${
                                    ev.isFullDay ? 'Giornata Intera' : `${ev.startTime} – ${ev.endTime}`
                                  }</div>
                                  ${
                                    ev.notes
                                      ? `<div class="text-[10px] opacity-85 mt-1 pt-1 border-t border-white/20 truncate">${escapeHtml(ev.notes)}</div>`
                                      : ''
                                  }
                                </div>
                              `;
                              })
                              .join('')
                      }
                    </div>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        `
        }
      </div>
    `;
  }

  function getFilteredHistoryEvents() {
    return state.events
      .filter((ev) => {
        if (state.onlyCurrentSY && !isDateInSchoolYear(ev.date, state.settings.activeSchoolYear)) {
          return false;
        }
        if (state.categoryFilter !== 'ALL' && ev.category !== state.categoryFilter) {
          return false;
        }
        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase();
          const meta = getEventStyleMeta(ev.category, ev.monteOreOp);
          const matchNotes = (ev.notes || '').toLowerCase().includes(q);
          const matchLabel = meta.label.toLowerCase().includes(q);
          const matchDate = ev.date.includes(q);
          return matchNotes || matchLabel || matchDate;
        }
        return true;
      })
      .sort((a, b) => {
        const cmp = b.date.localeCompare(a.date);
        if (cmp !== 0) return cmp;
        return b.startTime.localeCompare(a.startTime);
      });
  }

  function renderHistoryList() {
    const filteredEvents = getFilteredHistoryEvents();
    const dailyHours = getDailyHours(state.settings.scheduleType);

    return `
      <div class="space-y-4">
        <div class="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/85 p-4 sm:p-5 shadow-lg shadow-indigo-950/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-900">Backup, Esportazione & Sicurezza Dati (Offline-Ready)</h3>
            <p class="text-xs text-slate-500 mt-0.5">Tutti i dati sono salvati in locale sul tuo dispositivo. Esporta una copia JSON o CSV per trasferirli su un altro smartphone o PC.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button type="button" data-action="export-csv" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition">
              ${ICONS.spreadsheet} Esporta CSV (Excel)
            </button>
            <button type="button" data-action="export-json" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition">
              ${ICONS.download} Backup JSON
            </button>
            <button type="button" data-action="trigger-import-json" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition">
              ${ICONS.upload} Importa Backup
            </button>
          </div>
        </div>

        ${
          state.importStatus
            ? `
          <div class="p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
            state.importStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }">
            <span>${escapeHtml(state.importStatus.message)}</span>
            <button type="button" data-action="clear-import-status" class="underline text-[11px] ml-4">Chiudi</button>
          </div>
        `
            : ''
        }

        <div class="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/85 p-4 sm:p-5 shadow-xl shadow-indigo-950/5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex-1">
              <input type="text" data-input="history-search" value="${escapeHtml(
                state.searchQuery
              )}" placeholder="Cerca per causale, data o note personali..." class="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <select data-change="history-cat-filter" class="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="ALL" ${state.categoryFilter === 'ALL' ? 'selected' : ''}>Tutte le causali</option>
                <option value="FERIE" ${state.categoryFilter === 'FERIE' ? 'selected' : ''}>Solo Ferie</option>
                <option value="FESTIVITA_SOPPRESSE" ${state.categoryFilter === 'FESTIVITA_SOPPRESSE' ? 'selected' : ''}>Solo Fest. Soppresse</option>
                <option value="PERMESSI_PERSONALI" ${state.categoryFilter === 'PERMESSI_PERSONALI' ? 'selected' : ''}>Solo Permessi Personali</option>
                <option value="VISITA_SPECIALISTICA" ${state.categoryFilter === 'VISITA_SPECIALISTICA' ? 'selected' : ''}>Solo Visita Specialistica</option>
                <option value="MONTE_ORE" ${state.categoryFilter === 'MONTE_ORE' ? 'selected' : ''}>Solo Monte Ore (+/-)</option>
              </select>

              <button type="button" data-action="toggle-only-sy" class="px-3 py-2.5 rounded-xl border text-xs font-bold transition ${
                state.onlyCurrentSY
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200'
              }">
                ${state.onlyCurrentSY ? `Solo A.S. ${state.settings.activeSchoolYear}` : 'Tutti gli A.S.'}
              </button>
            </div>
          </div>

          ${
            filteredEvents.length === 0
              ? `
            <div class="py-12 text-center space-y-2">
              <p class="text-sm font-bold text-slate-700">Nessun evento registrato trovato</p>
              <p class="text-xs text-slate-400 max-w-md mx-auto">Tocca qualsiasi giorno nella griglia settimanale o usa il pulsante "+ Nuovo Evento" per registrare ferie, permessi o straordinari.</p>
            </div>
          `
              : `
            <div class="divide-y divide-slate-200/70">
              ${filteredEvents
                .map((ev) => {
                  const style = getEventStyleMeta(ev.category, ev.monteOreOp);
                  const dateObj = parseISODate(ev.date);
                  const formattedDate = dateObj.toLocaleDateString('it-IT', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  });

                  return `
                  <div class="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/60 rounded-2xl px-2 transition">
                    <div class="flex items-start gap-3">
                      <div class="mt-1 w-3.5 h-10 rounded-full shrink-0 bg-gradient-to-b ${style.accentGradient}"></div>
                      <div>
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${style.badgeBg} ${style.badgeText}">${style.label}</span>
                          <span class="text-xs font-bold text-slate-800 capitalize">${formattedDate}</span>
                        </div>
                        <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span class="font-medium">${
                            ev.isFullDay
                              ? `Giornata Intera (${ev.startTime} - ${ev.endTime})`
                              : `${ev.startTime} – ${ev.endTime}`
                          }</span>
                          <span class="font-bold text-slate-900">${
                            ev.isFullDay
                              ? `1 Giorno (${formatHoursToReadable(dailyHours)})`
                              : `${formatHoursToReadable(
                                  ev.category === 'MONTE_ORE' && ev.monteOreOp === 'SUBTRACT'
                                    ? -ev.durationHours
                                    : ev.durationHours,
                                  ev.category === 'MONTE_ORE'
                                )} (${formatDaysDecimal(ev.durationHours / dailyHours)} gg)`
                          }</span>
                        </div>
                        ${
                          ev.notes
                            ? `<p class="mt-1 text-xs text-slate-500">${escapeHtml(ev.notes)}</p>`
                            : ''
                        }
                      </div>
                    </div>

                    <div class="flex items-center justify-end gap-2 shrink-0">
                      <button type="button" data-action="edit-event" data-id="${ev.id}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-xs font-bold transition">
                        ${ICONS.edit} Modifica
                      </button>
                      <button type="button" data-action="delete-event" data-id="${ev.id}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/70 text-xs font-bold transition">
                        ${ICONS.trash} Elimina
                      </button>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  function renderSettingsModal() {
    if (!state.isSettingsOpen) return '';
    const f = state.settingsForm;
    const years = getAvailableSchoolYears();
    const dailyHours = getDailyHours(f.scheduleType);
    const ferieDays = f.hasThreeYearsSeniority ? 32 : 30;
    const ferieHours = Number((ferieDays * dailyHours).toFixed(1));
    const presets = f.scheduleType === '6_days' ? PRESETS_6_DAYS : PRESETS_5_DAYS;

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
        <div class="modal-animate relative w-full max-w-2xl my-auto rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
          <div class="px-6 py-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-2xl bg-white/20 border border-white/30">${ICONS.sparkles}</div>
              <div>
                <h2 class="text-lg sm:text-xl font-bold tracking-tight">
                  ${state.settings.onboarded ? 'Configurazione Orario & Profilo ATA' : 'Benvenuto in ATA Planner'}
                </h2>
                <p class="text-xs sm:text-sm text-indigo-100">Configura il tuo piano orario per l'Anno Scolastico (1 Settembre – 31 Agosto)</p>
              </div>
            </div>
            ${
              state.settings.onboarded
                ? `<button type="button" data-action="close-settings" class="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition">${ICONS.close}</button>`
                : ''
            }
          </div>

          <div class="p-5 sm:p-6 space-y-5 overflow-y-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Profilo / Qualifica ATA</label>
                <select data-change="sf-profile" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800">
                  ${[
                    'Assistente Amministrativo',
                    'Assistente Tecnico',
                    'Collaboratore Scolastico',
                    'DSGA / Funzionario EQ',
                    'Personale ATA',
                  ]
                    .map(
                      (p) =>
                        `<option value="${p}" ${f.profileName === p ? 'selected' : ''}>${p}</option>`
                    )
                    .join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Anno Scolastico (1 Set – 31 Ago)</label>
                <select data-change="sf-sy" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-indigo-950">
                  ${years
                    .map(
                      (sy) =>
                        `<option value="${sy}" ${
                          f.activeSchoolYear === sy ? 'selected' : ''
                        }>A.S. ${sy} (01/09/${sy.split('/')[0]} - 31/08/${sy.split('/')[1]})</option>`
                    )
                    .join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">1. Articolazione Orario Settimanale (36 ore Full-Time)</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" data-action="sf-schedule-type" data-type="6_days" class="flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                  f.scheduleType === '6_days'
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white'
                }">
                  <div class="mt-0.5 p-2 rounded-xl ${
                    f.scheduleType === '6_days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }">${ICONS.clock}</div>
                  <div class="flex-1">
                    <div class="font-bold text-slate-900">6 Giorni a settimana</div>
                    <p class="text-xs text-slate-600 mt-0.5"><strong>6 ore</strong> al giorno (Lun – Sab)</p>
                    <span class="inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">1 Giorno = 6h 00m</span>
                  </div>
                </button>

                <button type="button" data-action="sf-schedule-type" data-type="5_days" class="flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                  f.scheduleType === '5_days'
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white'
                }">
                  <div class="mt-0.5 p-2 rounded-xl ${
                    f.scheduleType === '5_days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }">${ICONS.clock}</div>
                  <div class="flex-1">
                    <div class="font-bold text-slate-900">5 Giorni a settimana</div>
                    <p class="text-xs text-slate-600 mt-0.5"><strong>7 ore e 12 min</strong> al giorno (7,2h • Lun – Ven)</p>
                    <span class="inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">1 Giorno = 7h 12m (7,2h)</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">2. Anzianità nel Profilo ATA (Calcolo Ferie Annuali)</label>
              <div data-action="sf-toggle-seniority" class="cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                f.hasThreeYearsSeniority
                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/15'
                  : 'bg-white/70 border-slate-200/90 hover:bg-white'
              }">
                <div class="flex items-start gap-3">
                  <div class="p-2.5 rounded-xl mt-0.5 ${
                    f.hasThreeYearsSeniority ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }">${ICONS.award}</div>
                  <div>
                    <p class="font-bold text-sm text-slate-900">Lavoro nello stesso profilo ATA da almeno 3 anni</p>
                    <p class="text-xs text-slate-600 mt-0.5">
                      ${
                        f.hasThreeYearsSeniority
                          ? `Spettanza ferie: <strong>32 giorni</strong> annuali (pari a <strong>${formatHoursToReadable(ferieHours)}</strong>)`
                          : `Non flaggato: spettanza base di <strong>30 giorni</strong> annuali (pari a <strong>${formatHoursToReadable(ferieHours)}</strong>)`
                      }
                    </p>
                  </div>
                </div>
                <input type="checkbox" ${
                  f.hasThreeYearsSeniority ? 'checked' : ''
                } class="w-5 h-5 accent-emerald-600 rounded pointer-events-none shrink-0" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">3. Fascia Oraria di Base (Full-Time)</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                ${presets
                  .map((preset) => {
                    const active = f.shiftPreset === preset.id;
                    return `
                    <button type="button" data-action="sf-preset" data-id="${preset.id}" data-start="${preset.start}" data-end="${preset.end}" class="p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-white/75 text-slate-700 border-slate-200/80 hover:bg-white'
                    }">
                      <div class="font-bold text-sm">${preset.label}</div>
                      <div class="text-[11px] mt-0.5 ${active ? 'text-indigo-100' : 'text-slate-500'}">${preset.desc}</div>
                    </button>
                  `;
                  })
                  .join('')}
              </div>

              <div class="mt-3 p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                <div class="text-xs text-slate-600">
                  <span class="font-semibold text-slate-800">Fascia turno giornaliero:</span> usata per pre-compilare gli eventi.
                </div>
                <div class="flex items-center gap-2">
                  <div>
                    <label class="block text-[10px] font-semibold uppercase text-slate-500">Inizio</label>
                    <input type="time" data-change="sf-shift-start" value="${f.shiftStart}" class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800" />
                  </div>
                  <span class="text-slate-400 font-bold mt-3">→</span>
                  <div>
                    <label class="block text-[10px] font-semibold uppercase text-slate-500">Fine</label>
                    <input type="time" data-change="sf-shift-end" value="${f.shiftEnd}" class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800" />
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/90 to-emerald-50/90 border border-indigo-100 text-xs text-slate-700">
              <span class="font-bold text-indigo-950">Dotazione A.S. ${f.activeSchoolYear}:</span>
              Ferie <strong>${ferieDays} gg</strong> (${formatHoursToReadable(ferieHours)}) • Fest. Soppresse <strong>4 gg</strong> • Permessi <strong>18h</strong> • Visite Spec. <strong>18h</strong>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              ${
                state.settings.onboarded
                  ? `<button type="button" data-action="close-settings" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">Annulla</button>`
                  : ''
              }
              <button type="button" data-action="save-settings" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition">
                ${state.settings.onboarded ? 'Salva Impostazioni' : 'Inizia a usare ATA Planner'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEventModal() {
    if (!state.eventModalOpen) return '';
    const ef = state.eventForm;
    const dailyHours = getDailyHours(state.settings.scheduleType);

    const isFullDayEvent =
      ef.category === 'FESTIVITA_SOPPRESSE' ||
      (ef.category === 'FERIE' && ef.ferieMode === 'FULL_DAY');

    let computedHours = dailyHours;
    if (!isFullDayEvent) {
      if (ef.inputMode === 'TIME_RANGE') {
        computedHours = calculateDurationHours(ef.startTime, ef.endTime);
      } else {
        computedHours = Math.max(0, Number(ef.directHours) || 0);
      }
    }

    const styleMeta = getEventStyleMeta(
      ef.category,
      ef.category === 'MONTE_ORE' ? ef.monteOreOp : undefined
    );

    let impactText = '';
    if (ef.category === 'FERIE') {
      impactText =
        ef.ferieMode === 'FULL_DAY'
          ? `-1 Giorno (${formatHoursToReadable(dailyHours)})`
          : `-${formatHoursToReadable(computedHours)} (${formatDaysDecimal(computedHours / dailyHours)} gg)`;
    } else if (ef.category === 'FESTIVITA_SOPPRESSE') {
      impactText = `-1 Giorno (${formatHoursToReadable(dailyHours)})`;
    } else if (ef.category === 'PERMESSI_PERSONALI' || ef.category === 'VISITA_SPECIALISTICA') {
      impactText = `-${formatHoursToReadable(computedHours)} su 18h`;
    } else if (ef.category === 'MONTE_ORE') {
      impactText =
        ef.monteOreOp === 'ADD'
          ? `+${formatHoursToReadable(computedHours)} (Straordinario)`
          : `-${formatHoursToReadable(computedHours)} (Recupero)`;
    }

    return `
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-md">
        <div class="modal-animate w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
          <div class="px-5 py-4 bg-gradient-to-r ${styleMeta.accentGradient} text-white flex items-center justify-between shrink-0">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider opacity-90">
                ${state.editingEventId ? 'Modifica Registrazione' : 'Nuova Registrazione ATA'}
              </span>
              <h3 class="text-lg font-extrabold tracking-tight">${styleMeta.label}</h3>
            </div>
            <button type="button" data-action="close-event-modal" class="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition">
              ${ICONS.close}
            </button>
          </div>

          <div class="p-5 space-y-4 overflow-y-auto">
            ${
              ef.errorMsg
                ? `<div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">${escapeHtml(ef.errorMsg)}</div>`
                : ''
            }

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Data dell'evento</label>
              <input type="date" data-change="ef-date" value="${ef.date}" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Causale</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${CATEGORIES.map((cat) => {
                  const active = ef.category === cat.id;
                  const catStyle = getEventStyleMeta(
                    cat.id,
                    cat.id === 'MONTE_ORE' ? ef.monteOreOp : undefined
                  );
                  return `
                    <button type="button" data-action="ef-category" data-cat="${cat.id}" class="p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white/80 text-slate-700 border-slate-200/90 hover:bg-white'
                  }">
                      <span class="w-3 h-3 rounded-full shrink-0 ${catStyle.dotColor}"></span>
                      <div class="min-w-0">
                        <div class="text-xs font-bold truncate">${cat.label}</div>
                        <div class="text-[10px] truncate ${active ? 'text-slate-300' : 'text-slate-400'}">${cat.desc}</div>
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            ${
              ef.category === 'FERIE'
                ? `
              <div class="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-emerald-800">Modalità fruizione Ferie</label>
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" data-action="ef-ferie-mode" data-mode="FULL_DAY" class="py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    ef.ferieMode === 'FULL_DAY'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-emerald-800 border-emerald-200'
                  }">Giornata Intera (-1 gg)</button>
                  <button type="button" data-action="ef-ferie-mode" data-mode="HOURLY" class="py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    ef.ferieMode === 'HOURLY'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-emerald-800 border-emerald-200'
                  }">Ferie ad Ore</button>
                </div>
              </div>
            `
                : ''
            }

            ${
              ef.category === 'FESTIVITA_SOPPRESSE'
                ? `
              <div class="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <div><strong>Fruibile solo a giornata intera:</strong> scala <strong>1 giorno</strong> dal contatore Festività Soppresse (${formatHoursToReadable(dailyHours)}).</div>
                <span class="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold shrink-0">-1 Giorno</span>
              </div>
            `
                : ''
            }

            ${
              ef.category === 'MONTE_ORE'
                ? `
              <div class="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Tipo Operazione Monte Ore</label>
                <div class="grid grid-cols-2 gap-2.5">
                  <button type="button" data-action="ef-monte-op" data-op="ADD" class="p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    ef.monteOreOp === 'ADD'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/20'
                      : 'bg-white text-slate-700 border-slate-200'
                  }">
                    ${ICONS.plusCircle}
                    <div>
                      <div class="text-xs font-extrabold">+ Straordinario</div>
                      <div class="text-[10px] ${ef.monteOreOp === 'ADD' ? 'text-sky-100' : 'text-slate-400'}">Aggiunge ore al Monte</div>
                    </div>
                  </button>
                  <button type="button" data-action="ef-monte-op" data-op="SUBTRACT" class="p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    ef.monteOreOp === 'SUBTRACT'
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                      : 'bg-white text-slate-700 border-slate-200'
                  }">
                    ${ICONS.minusCircle}
                    <div>
                      <div class="text-xs font-extrabold">- Recupero / Uscita</div>
                      <div class="text-[10px] ${ef.monteOreOp === 'SUBTRACT' ? 'text-orange-100' : 'text-slate-400'}">Scala ore dal Monte</div>
                    </div>
                  </button>
                </div>
              </div>
            `
                : ''
            }

            ${
              !isFullDayEvent
                ? `
              <div class="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Fascia Oraria o Durata</label>
                  <div class="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] font-semibold">
                    <button type="button" data-action="ef-input-mode" data-mode="TIME_RANGE" class="px-2.5 py-1 rounded-md transition ${
                      ef.inputMode === 'TIME_RANGE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }">Da Ora a Ora</button>
                    <button type="button" data-action="ef-input-mode" data-mode="DIRECT_HOURS" class="px-2.5 py-1 rounded-md transition ${
                      ef.inputMode === 'DIRECT_HOURS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }">N° Ore</button>
                  </div>
                </div>

                ${
                  ef.inputMode === 'TIME_RANGE'
                    ? `
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-semibold text-slate-500 mb-1">Ora Inizio</label>
                      <input type="time" data-change="ef-start-time" value="${ef.startTime}" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-800" />
                    </div>
                    <div>
                      <label class="block text-[11px] font-semibold text-slate-500 mb-1">Ora Fine</label>
                      <input type="time" data-change="ef-end-time" value="${ef.endTime}" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-800" />
                    </div>
                  </div>
                `
                    : `
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-semibold text-slate-500 mb-1">Quantità Ore (es. 1.5 = 1h 30m)</label>
                      <input type="number" step="0.25" min="0.25" max="12" data-change="ef-direct-hours" value="${ef.directHours}" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-800" />
                    </div>
                    <div>
                      <label class="block text-[11px] font-semibold text-slate-500 mb-1">Colloca dalle ore</label>
                      <input type="time" data-change="ef-start-time" value="${ef.startTime}" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-800" />
                    </div>
                  </div>
                `
                }

                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="text-[11px] text-slate-400 mr-1">Scelta rapida:</span>
                  ${[0.5, 1, 1.5, 2, 3, 4, dailyHours]
                    .map(
                      (h) => `
                    <button type="button" data-action="ef-quick-hours" data-hours="${h}" class="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-[11px] font-bold text-slate-700 transition">
                      ${formatHoursToReadable(h)}
                    </button>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `
                : ''
            }

            <div class="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-600">Impatto sul contatore:</span>
              <span class="font-extrabold text-indigo-950">${impactText}</span>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Note personali (opzionale)</label>
              <textarea rows="2" data-input="ef-notes" placeholder="Es. Protocollo richiesta, sostituzione collega, corso formazione..." class="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">${escapeHtml(
                ef.notes
              )}</textarea>
            </div>

            <div class="flex items-center justify-between gap-3 pt-2">
              ${
                state.editingEventId
                  ? `<button type="button" data-action="delete-event-modal" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition">${ICONS.trash} Elimina</button>`
                  : `<div></div>`
              }
              <div class="flex items-center gap-2">
                <button type="button" data-action="close-event-modal" class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Annulla</button>
                <button type="button" data-action="save-event" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition">
                  ${ICONS.check} ${state.editingEventId ? 'Aggiorna Evento' : 'Salva nel Calendario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderMobileBottomNav() {
    return `
      <nav aria-label="Navigazione Mobile" class="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/85 backdrop-blur-2xl border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg">
        <button type="button" data-action="switch-tab" data-tab="calendar" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition ${
          state.activeTab === 'calendar' ? 'text-indigo-600' : 'text-slate-500'
        }">
          ${ICONS.calendar}
          <span>Settimana</span>
        </button>

        <button type="button" data-action="open-new-event" class="flex items-center justify-center w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-lg shadow-indigo-500/30 border-4 border-white" aria-label="Registra nuovo evento">
          ${ICONS.plus}
        </button>

        <button type="button" data-action="switch-tab" data-tab="history" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-bold transition ${
          state.activeTab === 'history' ? 'text-indigo-600' : 'text-slate-500'
        }">
          ${ICONS.listTodo}
          <span>Storico (${state.events.length})</span>
        </button>
      </nav>
    `;
  }

  function render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const counters = calculateCounters(state.events, state.settings);

    appEl.innerHTML = `
      <div class="min-h-screen relative overflow-x-hidden pb-24 sm:pb-10">
        <!-- Sfondo decorativo Frosted Glass -->
        <div class="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-slate-50 to-sky-100"></div>
        <div class="fixed -top-28 -left-28 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl -z-10 pointer-events-none"></div>
        <div class="fixed top-1/3 -right-28 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl -z-10 pointer-events-none"></div>
        <div class="fixed -bottom-28 left-1/4 w-96 h-96 rounded-full bg-emerald-400/15 blur-3xl -z-10 pointer-events-none"></div>

        ${renderHeader()}

        <main class="max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-5">
          ${renderCounters(counters)}
          ${state.activeTab === 'calendar' ? renderWeeklySchedule() : renderHistoryList()}
        </main>

        ${renderMobileBottomNav()}
        ${renderSettingsModal()}
        ${renderEventModal()}
      </div>
    `;
  }

  // ============================================================================
  // EVENT DELEGATION GLOBALE (Click, Change, Input)
  // ============================================================================
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');

    switch (action) {
      case 'switch-tab': {
        state.activeTab = target.getAttribute('data-tab') || 'calendar';
        render();
        break;
      }
      case 'set-layout': {
        state.layoutMode = target.getAttribute('data-layout') || 'timeline';
        render();
        break;
      }
      case 'prev-week': {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() - 7);
        state.currentDate = d;
        render();
        break;
      }
      case 'next-week': {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() + 7);
        state.currentDate = d;
        render();
        break;
      }
      case 'today-week': {
        state.currentDate = new Date();
        render();
        break;
      }
      case 'open-settings': {
        openSettingsModal();
        break;
      }
      case 'close-settings': {
        state.isSettingsOpen = false;
        render();
        break;
      }
      case 'sf-schedule-type': {
        const type = target.getAttribute('data-type');
        state.settingsForm.scheduleType = type;
        if (type === '6_days') {
          state.settingsForm.shiftPreset = '6d_0800_1400';
          state.settingsForm.shiftStart = '08:00';
          state.settingsForm.shiftEnd = '14:00';
        } else {
          state.settingsForm.shiftPreset = '5d_0745_1442';
          state.settingsForm.shiftStart = '07:45';
          state.settingsForm.shiftEnd = '14:42';
        }
        render();
        break;
      }
      case 'sf-toggle-seniority': {
        state.settingsForm.hasThreeYearsSeniority = !state.settingsForm.hasThreeYearsSeniority;
        render();
        break;
      }
      case 'sf-preset': {
        const id = target.getAttribute('data-id');
        state.settingsForm.shiftPreset = id;
        if (id !== 'custom') {
          state.settingsForm.shiftStart = target.getAttribute('data-start');
          state.settingsForm.shiftEnd = target.getAttribute('data-end');
        }
        render();
        break;
      }
      case 'save-settings': {
        state.settings = {
          ...state.settingsForm,
          onboarded: true,
        };
        saveSettings(state.settings);
        state.isSettingsOpen = false;
        render();
        break;
      }
      case 'open-new-event': {
        openNewEventModal();
        break;
      }
      case 'quick-add-cat': {
        const cat = target.getAttribute('data-category');
        openNewEventModal(undefined, undefined, cat);
        break;
      }
      case 'slot-click': {
        e.stopPropagation();
        const dateStr = target.getAttribute('data-date');
        const timeStr = target.getAttribute('data-time') || undefined;
        openNewEventModal(dateStr, timeStr);
        break;
      }
      case 'edit-event': {
        e.stopPropagation();
        const id = target.getAttribute('data-id');
        openEditEventModal(id);
        break;
      }
      case 'delete-event': {
        e.stopPropagation();
        const id = target.getAttribute('data-id');
        state.events = state.events.filter((ev) => ev.id !== id);
        saveEvents(state.events);
        render();
        break;
      }
      case 'close-event-modal': {
        state.eventModalOpen = false;
        render();
        break;
      }
      case 'ef-category': {
        state.eventForm.category = target.getAttribute('data-cat');
        state.eventForm.errorMsg = null;
        render();
        break;
      }
      case 'ef-ferie-mode': {
        state.eventForm.ferieMode = target.getAttribute('data-mode');
        render();
        break;
      }
      case 'ef-monte-op': {
        state.eventForm.monteOreOp = target.getAttribute('data-op');
        render();
        break;
      }
      case 'ef-input-mode': {
        state.eventForm.inputMode = target.getAttribute('data-mode');
        render();
        break;
      }
      case 'ef-quick-hours': {
        const h = parseFloat(target.getAttribute('data-hours')) || 1;
        state.eventForm.directHours = h;
        const startMin = timeToMinutes(state.eventForm.startTime);
        state.eventForm.endTime = minutesToTime(startMin + Math.round(h * 60));
        render();
        break;
      }
      case 'delete-event-modal': {
        if (state.editingEventId) {
          state.events = state.events.filter((ev) => ev.id !== state.editingEventId);
          saveEvents(state.events);
        }
        state.eventModalOpen = false;
        render();
        break;
      }
      case 'save-event': {
        const ef = state.eventForm;
        const dailyHours = getDailyHours(state.settings.scheduleType);
        const isFullDay =
          ef.category === 'FESTIVITA_SOPPRESSE' ||
          (ef.category === 'FERIE' && ef.ferieMode === 'FULL_DAY');

        let computedHours = dailyHours;
        let effectiveStart = state.settings.shiftStart;
        let effectiveEnd = state.settings.shiftEnd;

        if (!isFullDay) {
          if (ef.inputMode === 'TIME_RANGE') {
            computedHours = calculateDurationHours(ef.startTime, ef.endTime);
            effectiveStart = ef.startTime;
            effectiveEnd = ef.endTime;
          } else {
            computedHours = Math.max(0, Number(ef.directHours) || 0);
            effectiveStart = ef.startTime;
            effectiveEnd = minutesToTime(
              timeToMinutes(ef.startTime) + Math.round(computedHours * 60)
            );
          }
        }

        if (!ef.date) {
          state.eventForm.errorMsg = 'Seleziona una data valida.';
          render();
          return;
        }
        if (!isFullDay && computedHours <= 0) {
          state.eventForm.errorMsg =
            "La durata dell'evento deve essere maggiore di zero (controlla Ora Inizio e Ora Fine).";
          render();
          return;
        }

        const payload = {
          date: ef.date,
          category: ef.category,
          ferieMode: ef.category === 'FERIE' ? ef.ferieMode : undefined,
          monteOreOp: ef.category === 'MONTE_ORE' ? ef.monteOreOp : undefined,
          isFullDay,
          startTime: effectiveStart,
          endTime: effectiveEnd,
          durationHours: isFullDay ? dailyHours : Number(computedHours.toFixed(4)),
          notes: (ef.notes || '').trim() || undefined,
        };

        if (state.editingEventId) {
          state.events = state.events.map((ev) =>
            ev.id === state.editingEventId ? { ...ev, ...payload } : ev
          );
        } else {
          state.events.push({
            ...payload,
            id: `ata_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
          });
        }

        saveEvents(state.events);
        state.eventModalOpen = false;
        render();
        break;
      }
      case 'export-json': {
        exportBackupJSON();
        break;
      }
      case 'export-csv': {
        exportEventsCSV(getFilteredHistoryEvents());
        break;
      }
      case 'trigger-import-json': {
        const fileInput = document.getElementById('backup-file-input');
        if (fileInput) fileInput.click();
        break;
      }
      case 'clear-import-status': {
        state.importStatus = null;
        render();
        break;
      }
      case 'toggle-only-sy': {
        state.onlyCurrentSY = !state.onlyCurrentSY;
        render();
        break;
      }
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target;
    const changeType = target.getAttribute('data-change');
    if (!changeType) return;

    switch (changeType) {
      case 'active-sy': {
        state.settings.activeSchoolYear = target.value;
        saveSettings(state.settings);
        render();
        break;
      }
      case 'sf-profile': {
        state.settingsForm.profileName = target.value;
        break;
      }
      case 'sf-sy': {
        state.settingsForm.activeSchoolYear = target.value;
        render();
        break;
      }
      case 'sf-shift-start': {
        state.settingsForm.shiftPreset = 'custom';
        state.settingsForm.shiftStart = target.value;
        render();
        break;
      }
      case 'sf-shift-end': {
        state.settingsForm.shiftPreset = 'custom';
        state.settingsForm.shiftEnd = target.value;
        render();
        break;
      }
      case 'ef-date': {
        state.eventForm.date = target.value;
        break;
      }
      case 'ef-start-time': {
        state.eventForm.startTime = target.value;
        if (state.eventForm.inputMode === 'DIRECT_HOURS') {
          const startMin = timeToMinutes(target.value);
          state.eventForm.endTime = minutesToTime(
            startMin + Math.round((Number(state.eventForm.directHours) || 1) * 60)
          );
        }
        render();
        break;
      }
      case 'ef-end-time': {
        state.eventForm.endTime = target.value;
        render();
        break;
      }
      case 'ef-direct-hours': {
        const h = parseFloat(target.value) || 0;
        state.eventForm.directHours = h;
        const startMin = timeToMinutes(state.eventForm.startTime);
        state.eventForm.endTime = minutesToTime(startMin + Math.round(h * 60));
        render();
        break;
      }
      case 'history-cat-filter': {
        state.categoryFilter = target.value;
        render();
        break;
      }
    }
  });

  document.addEventListener('input', (e) => {
    const target = e.target;
    const inputType = target.getAttribute('data-input');
    if (!inputType) return;

    if (inputType === 'ef-notes') {
      state.eventForm.notes = target.value;
    } else if (inputType === 'history-search') {
      state.searchQuery = target.value;
      const pos = target.selectionStart;
      render();
      const newSearchInput = document.querySelector('[data-input="history-search"]');
      if (newSearchInput) {
        newSearchInput.focus();
        newSearchInput.setSelectionRange(pos, pos);
      }
    }
  });

  // Gestione file upload per il ripristino Backup JSON
  const backupInput = document.getElementById('backup-file-input');
  if (backupInput) {
    backupInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && Array.isArray(parsed.events) && parsed.settings) {
            state.settings = { ...parsed.settings, onboarded: true };
            state.events = parsed.events;
            saveSettings(state.settings);
            saveEvents(state.events);
            state.importStatus = {
              type: 'success',
              message: `Backup importato correttamente (${parsed.events.length} eventi caricati).`,
            };
          } else {
            state.importStatus = {
              type: 'error',
              message: 'File JSON non valido. Seleziona un backup generato da ATA Planner.',
            };
          }
        } catch {
          state.importStatus = {
            type: 'error',
            message: 'Errore nella lettura del file JSON.',
          };
        }
        render();
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  window.addEventListener('online', () => {
    state.isOnline = true;
    render();
  });
  window.addEventListener('offline', () => {
    state.isOnline = false;
    render();
  });

  // Primo avvio
  render();
})();
