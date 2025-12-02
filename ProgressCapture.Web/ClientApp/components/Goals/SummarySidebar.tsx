import { JSX } from 'react';
import { ProgressStat } from 'types/entities';
import { GoalSummaryProps } from 'types/props';
import { ProgressBar } from 'react-bootstrap';
import { URL_IMAGE_ROOT, URL_EDIT_GOAL } from '../../includes/paths';
import { replaceUrlPlaceholders } from '../../includes/utils';

interface StatTotal {
    total: number;
    current: number;
}

export default function SummarySidebar(props: GoalSummaryProps): JSX.Element {
    const statRow = (stat: ProgressStat): JSX.Element => {
        const percentComplete = Math.round((stat.current / stat.total) * 100);

        return (
            <li key={`stat_${stat.typeId}`} className="list-group-item d-flex flex-column">
                <div className="d-flex flex-row justify-content-between flex-grow-1">
                    <div className="list-left w-50">{stat.name}</div>
                    <div className="list-center d-flex flex-grow-1 justify-content-start w-30">
                        <small className="text-muted">
                            {`${stat.current}/${stat.total} ${stat.unitOfMeasure.toLocaleLowerCase()}`} 
                        </small>
                    </div>
                    <div className="list-right d-flex flex-grow-1 justify-content-end w-20">{percentComplete}%</div>
                </div>
                <div className="mt-2">
                    <ProgressBar now={percentComplete}></ProgressBar>
                </div>
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
            <li className="list-group-item d-flex flex-column rounded-bottom pb-4">
                <div className="d-flex  flex-grow-1 flex-row justify-content-between">
                    <div className="list-left w-50"><strong>Total:</strong></div>
                    <div className="list-center d-flex flex-grow-1 justify-content-start w-30"></div>
                    <div className="list-right d-flex flex-grow-1 justify-content-end w-20"><strong>{totalPercent}%</strong></div>
                </div>
                <div className="mt-2">
                    <ProgressBar now={totalPercent}></ProgressBar>
                </div>
            </li>            
        );
    };

    const goalSettingsIcon = (): JSX.Element => {
        let disabled = false;
        let href = '#';
        if (props.goal === null) {
            disabled = true;
        } else {
            href = replaceUrlPlaceholders(URL_EDIT_GOAL, [props.goal.id]);
        }

        return (
            <a
                className={disabled ? 'disabled' : ''}
                aria-disabled={disabled}
                href={href}
            >
                <img
                    src={`${URL_IMAGE_ROOT}/icons/settings_dark.svg`}
                    alt="Edit goal settings"
                    title="Edit goal settings"
                />
            </a>
        );
    };

    return (
        <div className="summary-sidebar d-flex flex-column border rounded ms-4 flex-grow-1">
            <div className="pt-2 pb-2 ps-3 pe-3 border-bottom d-flex flex-row justify-content-between">
                <div className="sidebar-title">
                    <h4 className="mb-0">Progress</h4>
                </div>
                <div className="sidebar-settings d-flex align-items-center">
                    {goalSettingsIcon()}
                </div>
            </div>
            <div className="sidebar-body flex-grow-1">
                <ul className="list-group list-group-flush">
                    {props.stats.map(s => statRow(s))}
                    {totalRow()}
                </ul>
            </div>
            <div className="sidebar-footer align-self-bottom">

            </div>
        </div>
    );
}
