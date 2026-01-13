import React, { JSX, useState, useMemo } from 'react';
import { Pagination } from 'react-bootstrap';
import TableRowOptions from './TableRowOptions';
import { PaginatedTableProps, SortOrder, Identifiable } from 'types/props';
import { titleCase } from '../../includes/utils';
import { DEFAULT_PAGE_SIZE } from '../../includes/consts';

interface Page {
    key: string;
    active: boolean;
    pageNum: number;
}

/**
 * PaginatedTable is a generic table view for a collection of data. It provides ready-to-go filtering
 * and sorting by columns and for paginated data.
 * 
 * @param props 
 */
export default function PaginatedTable<T extends Identifiable>(
    props: PaginatedTableProps<T>
): JSX.Element {
    const DATE_FORMAT_OPS: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    const [currentPage, setCurrentPage] = useState<number>(0); // 0 indexed
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [sortField, setSortField] = useState<keyof T | null>(() => {
        if (props.defaultSortField !== null) {
            return props.defaultSortField;
        }

        return props.fields.length > 0 ? props.fields[0] : null;
    });

    const sortValues = (): T[] => {
        if (sortField === null) {
            return [...props.values];
        }

        return props.rowSorter.sortValues(props.values, sortField, sortOrder);
    };

    const handleSort = (field: keyof T) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const sortedValues: T[] = useMemo(
        () => sortValues(),
        [sortField, sortOrder]
    );

    const tableHeaders = (): JSX.Element => {
        const hasOptions = props.handleView !== null
            || props.handleEdit !== null
            || props.handleDelete !== null;

        return (
            <tr>
                {props.fields.map(f => {
                    const headerClass = f === sortField ? `col-sort-${sortOrder}` : '';

                    return (
                        <th
                            key={`th_${String(f)}`}
                            scope="col"
                            className={headerClass}
                        >
                            <a
                                href="#"
                                className="col-sort-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSort(f);
                                }}
                            >
                                {titleCase(String(f))}
                            </a>
                        </th>
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
            <tr key={`tr_${idx}`}>
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

    const paginator = (): JSX.Element => {
        const pageCount = Math.ceil(props.values.length / pageSize);
        // restrict page options to current page +-2
        const visiblePageNums: number[] = [
            currentPage - 2,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            currentPage + 2
        ];
        const pages: Page[] = [];
        let hasLowEllipses = false;
        let hasHighEllipses = false;
        for (let i = 0; i < pageCount; i++) {
            if (visiblePageNums.includes(i)) {
                pages.push({
                    key: `page_${i}`,
                    pageNum: i,
                    active: i === currentPage
                });
            } else if (i < visiblePageNums[0] && !hasLowEllipses) {
                hasLowEllipses = true;
                pages.push({
                    key: `ellipses_${i}`,
                    pageNum: i,
                    active: false
                });
            } else if (i > visiblePageNums[0] && !hasHighEllipses) {
                hasHighEllipses = true;
                pages.push({
                    key: `ellipses_${i}`,
                    pageNum: i,
                    active: false
                });
            }
        }

        return (
            <Pagination>
                <Pagination.First
                    disabled={currentPage === 0}
                    onClick={() => {
                        if (currentPage > 0) {
                            setCurrentPage(0);
                        }
                    }}
                />
                <Pagination.Prev
                    disabled={currentPage === 0}
                    onClick={() => {
                        if (currentPage - 1 >= 0) {
                            setCurrentPage(currentPage - 1);
                        }
                    }}
                />

                {pages.map(p => {
                    if (p.key.startsWith('ellipses')) {
                        return (
                            <Pagination.Ellipsis />
                        );
                    }

                    return (
                        <Pagination.Item
                            key={p.key}
                            active={p.active}
                            onClick={() => {
                                if (!p.active) {
                                    setCurrentPage(p.pageNum);
                                }
                            }}
                        >{p.pageNum + 1}</Pagination.Item>
                    );
                })}

                <Pagination.Next
                    disabled={currentPage === pageCount - 1}
                    onClick={() => {
                        if (currentPage + 1 <= pageCount - 1) {
                            setCurrentPage(currentPage + 1);
                        }
                    }}
                />
                <Pagination.Last
                    disabled={currentPage === pageCount - 1}
                    onClick={() => {
                        if (currentPage < pageCount - 1) {
                            setCurrentPage(pageCount - 1);
                        }
                    }}
                />
            </Pagination>
        );
    };

    const pageStart = currentPage * pageSize;
    const pageEnd = pageStart + pageSize;

    return (
        <div className="paginated-table-container d-flex flex-column">
            <table className={props.tableClass ? props.tableClass : "table"}>
                <thead>
                    {tableHeaders()}
                </thead>
                <tbody>
                    {sortedValues.slice(pageStart, pageEnd).map(tableRow)}
                </tbody>
            </table>
            <div className="page-control-footer d-flex flex-row justify-content-center align-items-center">
                {paginator()}
            </div>
        </div>
    );
}
