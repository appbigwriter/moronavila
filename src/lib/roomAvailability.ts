import { Language } from '../i18n/types';

export type BaseAvailabilityStatus =
    | 'Disponível'
    | 'Ocupado'
    | 'Indisponível'
    | 'Finalizando reparos'
    | 'Em desocupação até';

export interface ParsedRoomAvailability {
    baseStatus: BaseAvailabilityStatus;
    date: string;
    isForecast: boolean;
    isAvailableNow: boolean;
}

const FORECAST_STATUSES: BaseAvailabilityStatus[] = [
    'Finalizando reparos',
    'Em desocupação até',
];

/**
 * Parses a persisted `availability_status` string (e.g. `"Finalizando reparos|2026-11-25"`)
 * into its base status and optional ISO `YYYY-MM-DD` date.
 */
export function parseRoomAvailability(
    rawStatus?: string | null,
    isBlockedForRepairs?: boolean
): ParsedRoomAvailability {
    const trimmed = (rawStatus || '').trim();
    const pipeIndex = trimmed.indexOf('|');

    let baseRaw = pipeIndex >= 0 ? trimmed.slice(0, pipeIndex).trim() : trimmed;
    const datePart = pipeIndex >= 0 ? trimmed.slice(pipeIndex + 1).trim() : '';

    if (baseRaw === 'Em desocupação') {
        baseRaw = 'Em desocupação até';
    }

    const validStatuses: BaseAvailabilityStatus[] = [
        'Disponível',
        'Ocupado',
        'Indisponível',
        'Finalizando reparos',
        'Em desocupação até',
    ];

    const baseStatus: BaseAvailabilityStatus = validStatuses.includes(baseRaw as BaseAvailabilityStatus)
        ? (baseRaw as BaseAvailabilityStatus)
        : 'Indisponível';

    const isForecast = FORECAST_STATUSES.includes(baseStatus);
    const isAvailableNow = baseStatus === 'Disponível' && !isBlockedForRepairs;

    return {
        baseStatus,
        date: /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : '',
        isForecast,
        isAvailableNow,
    };
}

/**
 * Serializes a base availability status and optional ISO `YYYY-MM-DD` date
 * for storage in the `rooms.availability_status` text column.
 */
export function buildRoomAvailabilityValue(baseStatus: BaseAvailabilityStatus, date?: string): string {
    if (FORECAST_STATUSES.includes(baseStatus) && date && date.trim()) {
        return `${baseStatus}|${date.trim()}`;
    }
    return baseStatus;
}

/**
 * Formats an ISO `YYYY-MM-DD` date string without timezone shift.
 */
export function formatAvailabilityDate(dateStr?: string, lang: Language = 'pt'): string {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
    const [year, month, day] = dateStr.split('-');
    if (lang === 'en') return `${month}/${day}/${year}`;
    return `${day}/${month}/${year}`;
}

/**
 * Returns a localized display label for a room availability status (including forecast dates).
 */
export function getLocalizedAvailabilityLabel(
    rawStatus?: string | null,
    lang: Language = 'pt',
    isBlockedForRepairs?: boolean
): string {
    const parsed = parseRoomAvailability(rawStatus, isBlockedForRepairs);
    const formattedDate = formatAvailabilityDate(parsed.date, lang);

    if (parsed.baseStatus === 'Finalizando reparos') {
        if (lang === 'en') {
            return formattedDate ? `Finishing repairs • Available ${formattedDate}` : 'Finishing repairs';
        }
        if (lang === 'es') {
            return formattedDate ? `Finalizando reparaciones • Liberación ${formattedDate}` : 'Finalizando reparaciones';
        }
        return formattedDate ? `Finalizando reparos • Liberação em ${formattedDate}` : 'Finalizando reparos';
    }

    if (parsed.baseStatus === 'Em desocupação até') {
        if (lang === 'en') {
            return formattedDate ? `Vacating until ${formattedDate}` : 'Vacating soon';
        }
        if (lang === 'es') {
            return formattedDate ? `En desocupación hasta ${formattedDate}` : 'En desocupación';
        }
        return formattedDate ? `Em desocupação até ${formattedDate}` : 'Em desocupação até';
    }

    if (parsed.baseStatus === 'Disponível' && isBlockedForRepairs) {
        return lang === 'en' ? 'Under Maintenance' : lang === 'es' ? 'En Mantenimiento' : 'Em Manutenção';
    }

    if (lang === 'en') {
        if (parsed.baseStatus === 'Disponível') return 'Available';
        if (parsed.baseStatus === 'Ocupado') return 'Occupied';
        return 'Unavailable';
    }
    if (lang === 'es') {
        if (parsed.baseStatus === 'Disponível') return 'Disponible';
        if (parsed.baseStatus === 'Ocupado') return 'Ocupado';
        return 'No disponible';
    }
    return parsed.baseStatus;
}
