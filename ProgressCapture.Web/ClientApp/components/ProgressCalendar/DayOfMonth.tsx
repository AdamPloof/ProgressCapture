import { JSX } from 'react';
import { ProgressEntry } from 'types/entities';
import { CalendarDayProps } from 'types/props';
import { trimText } from '../../includes/utils';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function DayOfMonth(props: CalendarDayProps): JSX.Element {
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

    const addBtn = (): JSX.Element => {
        return (
            <button
                className='calendar-add-btn'
                onClick={e => {
                    e.preventDefault();
                    props.handleCreate(props.date);
                }}
            >
                <img src={`${URL_IMAGE_ROOT}/icons/add_dark.svg`} alt="Add progress" />
            </button>
        );
    };

    const entryRow = (entry: ProgressEntry, idx: number): JSX.Element => {
        const colorIdx = props.progressTypeColorMap.get(entry.progressType.id);
        if (!colorIdx) {
            throw new Error(`No color index for progress entry type: ${entry.progressType.id}`);
        }

        return (
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
        );
    };

    return (
        <div className="monthly-calendar-day">
            <div className="d-flex justify-content-center label-row">
                {addBtn()}
                <div className={labelClass}>
                    {props.date.getDate()}
                </div>
            </div>
            <div className="calendar-day-body d-flex flex-column align-items-start justify-content-end flex-grow-1">
                {props.progressEntries.map(entryRow)}
            </div>
        </div>
    );
}
