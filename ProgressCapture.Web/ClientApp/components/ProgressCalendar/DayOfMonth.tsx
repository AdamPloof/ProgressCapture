import { JSX } from 'react';
import { ProgressEntry } from 'types/entities';
import { DayOfMonthProps } from 'types/props';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function DayOfMonth(props: DayOfMonthProps): JSX.Element {
    const MAX_TITLE_LENGTH = 20;

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

    const trimEntryTitle = (title: string): string => {
        if (title.length <= MAX_TITLE_LENGTH) {
            return title;
        }

        return `${title.substring(0, MAX_TITLE_LENGTH - 3)}...`;
    }

    const addBtn = (): JSX.Element => {
        return (
            <button
                className='calendar-add-btn'
                onClick={e => {
                    e.preventDefault();
                    props.handleCreate();
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
                        {trimEntryTitle(entry.progressType.name)}
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
