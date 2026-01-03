import React, { JSX } from 'react';
import TableRowOptions from './TableRowOptions';
import { PaginatedTableProps } from 'types/props';
import { titleCase } from '../../includes/utils';

/**
 * PaginatedTable is a generic table view for a collection of data. It provides ready-to-go filtering
 * and sorting by columns and for paginated data.
 * 
 * @param props 
 */
export default function PaginatedTable<T extends object>(
    props: PaginatedTableProps<T>
): JSX.Element {
    const DATE_FORMAT_OPS: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    const tableHeaders = (): JSX.Element => {
        const hasOptions = props.handleView !== null
            || props.handleEdit !== null
            || props.handleDelete !== null;

        return (
            <tr>
                {props.fields.map(f => {
                    return (
                        <th key={`th_${String(f)}`} scope="col">{titleCase(String(f))}</th>
                    );
                })}
                {hasOptions ? (<th scope="col">Options</th>) : null}
            </tr>
        );
    };

    const tableRow = (data: T, idx: number): JSX.Element => {
        const hasOptions = props.handleView !== null
            || props.handleEdit !== null
            || props.handleDelete !== null;

        return (
            <tr>
                {props.fields.map(f => {
                    return (
                        // TODO: use custom converters if provided
                        <td key={`${String(f)}_${idx}`}>{valToString(data[f])}</td>
                    );
                })}
                {hasOptions ? <td>{rowOptions(data, idx)}</td> : null}
            </tr>
        );
    };

    const rowOptions = (data: T, idx: number): JSX.Element => {
        return (
            <TableRowOptions
                entity={data}
                rowIndex={idx}
                handleView={props.handleView}
                handleEdit={props.handleEdit}
                handleDelete={props.handleDelete}
            ></TableRowOptions>
        );
    };

    const valToString = (val: unknown): string => {
        if (val === null) {
            return '';
        } else if (val instanceof Date) {
            return val.toLocaleDateString('en-US', DATE_FORMAT_OPS);
        } else if (typeof val === 'boolean') {
            return val ? 'True' : 'False';
        } else {
            return `${val}`;
        }
    }

    return (
        <table className={props.tableClass ? props.tableClass : "table"}>
            <thead>
                {tableHeaders()}
            </thead>
            <tbody>
                {props.values.map(tableRow)}
            </tbody>
        </table>
    );
}
