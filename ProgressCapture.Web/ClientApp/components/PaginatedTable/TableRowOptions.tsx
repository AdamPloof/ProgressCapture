import React, { JSX } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { TableRowOptionsProps } from 'types/props';

export default function TableRowOptions<T>(props: TableRowOptionsProps<T>): JSX.Element {
    const items: JSX.Element[] = [];
    if (props.handleView !== null) {
        items.push(
            <Dropdown.Item
                href="#"
                key={`${props.rowIndex}_view`}
                onClick={(e) => {
                    e.preventDefault();
                    props.handleView!(props.entity);
                }}
            >View</Dropdown.Item>
        );
    }

    if (props.handleEdit !== null) {
        items.push(
            <Dropdown.Item
                href="#"
                key={`${props.rowIndex}_edit`}
                onClick={(e) => {
                    e.preventDefault();
                    props.handleEdit!(props.entity);
                }}
            >Edit</Dropdown.Item>
        );
    }

    if (props.handleDelete !== null) {
        items.push(
            <React.Fragment>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                    href="#"
                    key={`${props.rowIndex}_delete`}
                    bsPrefix='dropdown-item text-danger'
                    onClick={(e) => {
                        e.preventDefault();
                        props.handleDelete!(props.entity);
                    }}
                >Delete</Dropdown.Item>
            </React.Fragment>
        );
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size='sm'>
                Options
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {items.map(i => i)}
            </Dropdown.Menu>
        </Dropdown>
    );
}
