import React, { JSX } from 'react';
import { getDayOfWeekName } from '../../includes/utils';
import { DayOfMonthProps } from 'types/props';

export default function DayOfMonth(props: DayOfMonthProps): JSX.Element {
    let isToday = false;
    const today = new Date();
    if (
        today.getFullYear() === props.date.getFullYear()
        && today.getMonth() === props.date.getMonth()
        && today.getDate() === props.date.getDate()
    ) {
        isToday = true;
    }

    const labelClass = isToday ? 'calendar-day-label today' : 'calendar-day-label';

    return (
        <div className="monthly-calendar-day">
            <div className={labelClass}>
                {props.date.getDate()}
            </div>
            <div className="calendar-day-body">

            </div>
        </div>
    );
}
