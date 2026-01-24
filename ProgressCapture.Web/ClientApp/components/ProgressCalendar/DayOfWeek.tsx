import React, { JSX } from 'react';
import { ProgressEntry } from 'types/entities';
import { CalendarDayProps } from 'types/props';
import { trimText, getDayOfWeekName } from '../../includes/utils';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function DayOfWeek(props: CalendarDayProps): JSX.Element {
    const labelClass = (): string => {
        let isToday = false;
        const today = new Date();
        if (
            today.getFullYear() === props.date.getFullYear()
            && today.getMonth() === props.date.getMonth()
            && today.getDate() === props.date.getDate()
        ) {
            isToday = true;
        }

        return isToday ? 'calendar-day-label today' : 'calendar-day-label';
    }

    const entryRow = (entry: ProgressEntry, idx: number): JSX.Element => {
        const colorIdx = props.progressTypeColorMap.get(entry.progressType.id);
        if (!colorIdx) {
            throw new Error(`No color index for progress entry type: ${entry.progressType.id}`);
        }

        return (
            <React.Fragment>
                <a
                    key={`cal_entry_${entry.id}`}
                    href="#"
                    className={`calendar-entry cal-entry-color-${colorIdx} d-flex flex-column w-100${idx > 0 ? ' mt-1' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        props.handleView(entry.id);
                    }}
                >
                    <div className="entry-type">
                        {trimText(entry.progressType.name)}
                    </div>
                    <div className="entry-amount">
                        {entry.amount} {entry.progressType.unitOfMeasure.shortName}
                    </div>
                </a>
            </React.Fragment>
        );
    };

    const weekdayLabel = (): JSX.Element => {
        return (
            <div className="weekday-label d-flex flex-column justify-content-center align-item-center w-100">
                <div className="label-day-name">{getDayOfWeekName(props.date)}</div>
                <div className="d-flex flex-row justify-content-center w-100">
                    <div className={labelClass()}><h4 className='mb-0'>{props.date.getDate()}</h4></div>
                </div>
            </div>
        );
    };

    const weekdayBody = (): JSX.Element => {
        return (
            <div className='weekday-body'>
                <div className="calendar-day-controls d-flex flex-row justify-content-end">
                    <button
                        className='calendar-add-btn'
                        onClick={e => {
                            e.preventDefault();
                            props.handleCreate();
                        }}
                    >
                        <img src={`${URL_IMAGE_ROOT}/icons/add_dark.svg`} alt="Add progress" />
                    </button>
                </div>
                <div className="calendar-day-cell">
                    {props.progressEntries.map(entryRow)}
                </div>
            </div>
        );
    };

    return (
        <div className="weekday-content">
            {weekdayLabel()}
            {weekdayBody()}
        </div>
    );
}
