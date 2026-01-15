import React, { JSX } from 'react';
import { getDayOfWeekName } from '../../includes/utils';
import { ProgressEntry } from 'types/entities';
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

    let labelClass = isToday ? 'calendar-day-label today' : 'calendar-day-label';
    if (!props.inCurrentMonth) {
        labelClass += ' outside-month-day';
    }

    const entryRow = (entry: ProgressEntry): JSX.Element => {
        return (
            <div key={`cal_entry_${entry.id}`} className="calendar-progress-entry">
                <a href="#" className="progress-entry">
                    {entry.progressType.name}: {entry.amount} {entry.progressType.unitOfMeasure.shortName}
                </a>
            </div>
        );
    };

    return (
        <div className="monthly-calendar-day">
            <div className="d-flex justify-content-center">
                <div className={labelClass}>
                    {props.date.getDate()}
                </div>
            </div>
            <div className="calendar-day-body">
                {props.progressEntries.map(entryRow)}
            </div>
        </div>
    );
}
