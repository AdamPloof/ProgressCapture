import React, { JSX } from 'react';
import PaginatedTable from '../PaginatedTable/PaginatedTable';
import TableRowSorter from '../PaginatedTable/TableRowSorter';
import Loader from '../Common/Loader';
import { ProgressControlProps } from 'types/props';
import { ProgressEntryTableRow } from '../../types/entities';

/**
 * The main component for managing the progress entries related to a specific goal.
 */
export default function ProgressTable(props: ProgressControlProps): JSX.Element {
    const DATE_FORMAT_OPS: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    const progressTable = (): JSX.Element => {
        if (props.progressLoading) {
            return <Loader />;
        }

        const rowSorter = new TableRowSorter();

        return (
            <PaginatedTable<ProgressEntryTableRow>
                tableClass='table table-striped'
                fields={['id', 'date', 'type', 'amount', 'notes']}
                values={props.entries.map((e): ProgressEntryTableRow => {
                    return {
                        id: e.id,
                        date: e.date,
                        type: e.progressType.name,
                        amount: e.amount,
                        notes: e.notes
                    };
                })}
                rowSorter={rowSorter}
                defaultSortField={'date'}
                handleView={props.handleView}
                handleEdit={props.handleEdit}
                handleDelete={props.handleDelete}
            ></PaginatedTable>
        );
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
                        onClick={props.handleCreate ? props.handleCreate: () => { console.error('No add handler set'); }}
                    >
                        Add Progress
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="progress-manager container border">
            {widgetHeader()}
            {progressTable()}
        </div>
    );
}
