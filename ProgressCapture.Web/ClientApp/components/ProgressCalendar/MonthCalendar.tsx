import React, { JSX, useState, useMemo } from 'react';
import DayOfMonth from './DayOfMonth';
import { ProgressControlProps } from 'types/props';
import { ProgressEntry } from 'types/entities';
import { longMonthName, formatDateYmd } from '../../includes/utils';
import { URL_IMAGE_ROOT } from '../../includes/paths';

// TODO: make a color generator that can handle unlimited number of progress types
const MAX_ENTRY_TYPES = 6;

export default function MonthCalendar(props: ProgressControlProps): JSX.Element {
    // currentMonth is 0 indexed: jan == 0, dec == 11
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

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
    }, [props.entries, currentMonth, currentYear]);

    const getDates = (): Date[] => {
        const firstOfMonth = new Date(currentYear, currentMonth, 1);
        const firstOfCalendar = new Date(firstOfMonth);
        firstOfCalendar.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
        console.assert(
            firstOfCalendar.getDay() === 0,
            "First day of calendar should always be a Sunday"
        );

        const dates: Date[] = [firstOfCalendar];
        for (let i = 1; i < 35; i++) {
            const nextDate = new Date(firstOfCalendar);
            nextDate.setDate(nextDate.getDate() + i);
            dates.push(nextDate);
        }

        return dates;
    };

    const monthSelect = (): JSX.Element => {
        return (
            <div className="date-select-control d-flex flex-row flex-shrink-1">
                <button
                    className="btn btn-outline-primary me-4"
                    onClick={(e) => {
                        e.preventDefault();
                        const today = new Date();
                        setCurrentYear(today.getFullYear());
                        setCurrentMonth(today.getMonth());
                    }}
                >
                    Today
                </button>
                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear(currentYear - 1);
                        } else {
                            setCurrentMonth(currentMonth - 1);
                        }
                    }}
                >
                    <img src={`${URL_IMAGE_ROOT}/icons/backward_dark.svg`} alt="Previous month" />
                </button>
                <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear(currentYear + 1);
                        } else {
                            setCurrentMonth(currentMonth + 1);
                        }
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
                {monthSelect()}
                <div className="header-tools d-flex justify-content-end align-items-end">
                    <h4 className='mb-0'>
                        {longMonthName(new Date(currentYear, currentMonth, 1))} {currentYear}
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
                    <div className="calendar-weekdays">
                        <div className="weekday-label">SUN</div>
                        <div className="weekday-label">MON</div>
                        <div className="weekday-label">TUE</div>
                        <div className="weekday-label">WED</div>
                        <div className="weekday-label">THU</div>
                        <div className="weekday-label">FRI</div>
                        <div className="weekday-label">SAT</div>
                    </div>
                    <div className="calendar-body">
                        {getDates().map(
                            d => <DayOfMonth
                                key={d.getTime()}
                                date={d}
                                handleCreate={props.handleCreate}
                                handleView={props.handleView}
                                handleEdit={props.handleEdit}
                                handleDelete={props.handleDelete}
                                progressEntries={dailyEntries.get(formatDateYmd(d)) ?? []}
                                progressColorMap={props.progressColorMap}
                                inCurrentMonth={d.getMonth() === currentMonth}
                            ></DayOfMonth>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
