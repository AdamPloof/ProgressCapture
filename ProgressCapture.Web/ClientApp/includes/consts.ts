/**
 * Collection of constants used throughout the app
 */

import { ControlType } from "types/props";

export const CONTROL_TYPES: {
    CALENDAR_MONTH: ControlType,
    CALENDAR_WEEK: ControlType,
    LIST: ControlType
} =  {
    CALENDAR_MONTH: 'calendar-month',
    CALENDAR_WEEK: 'calendar-week',
    LIST: 'list',
};

export const DEFAULT_PAGE_SIZE: number = 20;
export const CAL_DATE_FORMAT_OPS: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
};
export const LONG_DATE_FORMAT_OPS: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
};
