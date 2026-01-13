import React, { JSX, useState } from 'react';
import { ProgressControlProps } from 'types/props';
import DayOfMonth from './DayOfMonth';

export default function ProgressCalendar(props: ProgressControlProps): JSX.Element {
    // currentMonth is 0 indexed: jan == 0, dec == 11
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    const getDates = (): Date[] => {
        const firstOfMonth = new Date(currentYear, currentMonth, 1);
        const firstOfCalendar = new Date(firstOfMonth);
        firstOfCalendar.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
        console.assert(
            firstOfCalendar.getDay() === 0,
            "First day of calendar should always be a Sunday"
        );

        const dates: Date[] = [firstOfMonth];
        for (let i = 1; i < 35; i++) {
            const nextDate = new Date(firstOfMonth);
            nextDate.setDate(nextDate.getDate() + i);
            dates.push(nextDate);
        }

        return dates;
    };

    const widgetHeader = (): JSX.Element => {
        if (props.goalLoading) {
            return (
                <div className="goal-manager-header d-flex flex-row justify-content-between border-bottom p-4">
                    <div className="header-info"><h2>{props.goal ? props.goal.name : '...'}</h2></div>
                </div>
            );
        }

        return (
            <div className="goal-manager-header d-flex flex-row justify-content-between border-bottom p-4">
                <div className="header-info"><h2>{props.goal ? props.goal.name : '...'}</h2></div>
                <div className="header-tools d-flex justify-content-end">
                    <button
                        className='btn btn-primary'
                        onClick={props.handleCreate ? props.handleCreate : () => { console.error('No add handler set'); }}
                    >
                        Add Progress
                    </button>
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
                            d => <DayOfMonth key={d.getTime()} date={d} progressEntries={[]}></DayOfMonth>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
