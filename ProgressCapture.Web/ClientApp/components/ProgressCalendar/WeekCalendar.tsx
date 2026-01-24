import { JSX, useState, useMemo } from 'react';
import DayOfWeek from './DayOfWeek';
import { ProgressEntry } from 'types/entities';
import { ProgressControlProps } from 'types/props';
import { getSundayOfCurrentWeek, formatDateYmd, longMonthName } from '../../includes/utils';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function WeekCalendar(props: ProgressControlProps): JSX.Element {
    const MIN_EMPTY_CELLS = 1;
    const MAX_EMPTY_CELLS = 5;

    const [startOfWeek, setStartOfWeek] = useState<Date>(() => getSundayOfCurrentWeek());

    /**
     * Map of progress type ID to calendar item color index
     * 
     * @todo: move to manager
     */
    const progressTypeColorMap: Map<number, number> = useMemo(() => {
        const colorMap = new Map<number, number>();
        let currentIdx = 1;
        for (const entry of props.entries) {
            if (!colorMap.has(entry.progressType.id)) {
                colorMap.set(entry.progressType.id, currentIdx);
                if (currentIdx === 6) {
                    currentIdx = 1;
                } else {
                    currentIdx++;
                }
            }
        }

        return colorMap;
    }, [props.entries])

    /**
     * Map of date string (yyyy-mm-dd) to the progress entries
     * associated with that day.
     */
    const dailyEntries: Map<string, ProgressEntry[]> = useMemo(() => {
        const entryMap = new Map<string, ProgressEntry[]>();
        for (const e of props.entries) {
            const dateStr = formatDateYmd(e.date);
            if (!entryMap.has(dateStr)) {
                entryMap.set(dateStr, []);
            }

            entryMap.get(dateStr)?.push(e);
        }

        return entryMap;
    }, [props.entries, startOfWeek]);

    const getDates = (): Date[] => {
        console.assert(
            startOfWeek.getDay() === 0,
            "First day of calendar should always be a Sunday"
        );

        const dates: Date[] = [startOfWeek];
        for (let i = 1; i < 7; i++) {
            const nextDate = new Date(startOfWeek);
            nextDate.setDate(nextDate.getDate() + i);
            dates.push(nextDate);
        }

        return dates;
    };

    const weekSelect = (): JSX.Element => {
        return (
            <div className="date-select-control d-flex flex-row flex-shrink-1">
                <button
                    className="btn btn-outline-primary me-4"
                    onClick={(e) => {
                        e.preventDefault();
                        const today = new Date();
                        setStartOfWeek(getSundayOfCurrentWeek());
                    }}
                >
                    Today
                </button>
                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={(e) => {
                        e.preventDefault();
                        const prevSunday = new Date(startOfWeek);
                        prevSunday.setDate(startOfWeek.getDate() - 7);
                        setStartOfWeek(prevSunday);
                    }}
                >
                    <img src={`${URL_IMAGE_ROOT}/icons/backward_dark.svg`} alt="Previous month" />
                </button>
                <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        const nextSunday = new Date(startOfWeek);
                        nextSunday.setDate(startOfWeek.getDate() + 7);
                        setStartOfWeek(nextSunday);
                    }}
                >
                    <img src={`${URL_IMAGE_ROOT}/icons/forward_dark.svg`} alt="Next month" />
                </button>
            </div>
        );
    };

    const widgetHeader = (): JSX.Element => {
        if (props.goalLoading) {
            return (
                <div className="progress-calendar-header d-flex flex-row justify-content-between border-bottom p-3">
                    <div className="header-info d-flex align-items-end">
                        <h3 className='mb-0'>{props.goal ? props.goal.name : '...'}</h3>
                    </div>
                </div>
            );
        }

        return (
            <div className="progress-calendar-header d-flex flex-row justify-content-between border-bottom p-3">
                <div className="header-info d-flex align-items-end">
                    <h3 className='mb-0'>{props.goal ? props.goal.name : '...'}</h3>
                </div>
                {weekSelect()}
                <div className="header-tools d-flex justify-content-end align-items-end">
                    <h4 className='mb-0'>
                        {longMonthName(new Date(startOfWeek))} {startOfWeek.getFullYear()}
                    </h4>
                </div>
            </div>
        );
    }

    return (
        <div className="progress-manager d-flex flex-column flex-1 container border pb-2">
            {widgetHeader()}
            <div className="calendar-wrapper">
                <div className="progress-calendar">
                    <div className="week-calendar-body">
                        {getDates().map(
                            d => <DayOfWeek
                                key={d.getTime()}
                                date={d}
                                handleCreate={props.handleCreate}
                                handleView={props.handleView}
                                handleEdit={props.handleEdit}
                                handleDelete={props.handleDelete}
                                progressEntries={dailyEntries.get(formatDateYmd(d)) ?? []}
                                progressTypeColorMap={progressTypeColorMap}
                                inCurrentMonth={true}
                            ></DayOfWeek> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
