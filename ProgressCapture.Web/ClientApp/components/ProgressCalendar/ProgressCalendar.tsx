import React, { JSX, useState, useMemo } from 'react';
import DayOfMonth from './DayOfMonth';
import { ProgressControlProps } from 'types/props';
import { ProgressEntry } from 'types/entities';
import { longMonthName, formatDateYmd } from '../../includes/utils';

export default function ProgressCalendar(props: ProgressControlProps): JSX.Element {
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

    const widgetHeader = (): JSX.Element => {
        if (props.goalLoading) {
            return (
                <div className="goal-manager-header d-flex flex-row justify-content-between border-bottom p-3">
                    <div className="header-info">
                        <h2 className='mb-0'>{props.goal ? props.goal.name : '...'}</h2>
                    </div>
                </div>
            );
        }

        return (
            <div className="goal-manager-header d-flex flex-row justify-content-between border-bottom p-4">
                <div className="header-info"><h2>{props.goal ? props.goal.name : '...'}</h2></div>
                <div className="header-tools d-flex justify-content-end">
                    <h3 className='mb-0'>
                        {longMonthName(new Date(currentYear, currentMonth, 1))} {currentYear}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="progress-manager d-flex flex-column flex-1 container border">
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
                                progressEntries={dailyEntries.get(formatDateYmd(d)) ?? []}
                                inCurrentMonth={d.getMonth() === currentMonth}
                            ></DayOfMonth>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
