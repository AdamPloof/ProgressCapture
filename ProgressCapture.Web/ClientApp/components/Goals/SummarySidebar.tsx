import { JSX } from 'react';
import { ProgressStat } from 'types/entities';
import { GoalSummaryProps } from 'types/props';

interface StatTotal {
    total: number;
    current: number;
}

export default function SummarySidebar(props: GoalSummaryProps): JSX.Element {
    const statRow = (stat: ProgressStat): JSX.Element => {
        const percentComplete = Math.round((stat.current / stat.total) * 100);

        return (
            <li key={`stat_${stat.typeId}`} className="list-group-item d-flex flex-grow-1 flex-row justify-content-between">
                <div className="list-left w-50">{stat.name}:</div>
                <div className="list-center d-flex flex-grow-1 justify-content-start w-30">
                    {`${stat.current}/${stat.total} ${stat.unitOfMeasure}`} 
                </div>
                <div className="list-right d-flex flex-grow-1 justify-content-end w-20">{percentComplete}%</div>
            </li>            
        );
    };

    const totalRow = (): JSX.Element => {
        const totals = props.stats.reduce((total, stat): StatTotal => {
            total.current += stat.current;
            total.total += stat.total;

            return total;
        }, {total: 0.0, current: 0.0});

        const totalPercent = Math.round((totals.current / totals.total) * 100);

        return (
            <li className="list-group-item d-flex flex-grow-1 flex-row justify-content-between">
                <div className="list-left w-50"><strong>Total:</strong></div>
                <div className="list-center d-flex flex-grow-1 justify-content-start w-30"></div>
                <div className="list-right d-flex flex-grow-1 justify-content-end w-20"><strong>{totalPercent}%</strong></div>
            </li>            
        );
    };

    return (
        <div className="summary-sidebar d-flex flex-column border rounded ms-4 flex-grow-1">
            <div className="sidebar-title pt-2 pb-2 ps-3 pe-3 border-bottom"><h4 className="mb-0">Progress</h4></div>
            <div className="sidebar-body flex-grow-1">
                <ul className="list-group list-group-flush">
                    {props.stats.map(s => statRow(s))}
                    {totalRow()}
                </ul>
            </div>
            <div className="sidebar-footer align-self-bottom">
                <div className="links d-flex flex-row justify-content-end pt-2 pb-2 ps-3 pe-3">
                    <a href="#">Edit Goal</a>
                </div>
            </div>
        </div>
    );
}
