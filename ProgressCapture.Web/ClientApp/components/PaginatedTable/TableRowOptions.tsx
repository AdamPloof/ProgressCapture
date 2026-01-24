import React, { JSX } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { TableRowOptionsProps, Identifiable } from 'types/props';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function TableRowOptions<T extends Identifiable>(
    props: TableRowOptionsProps<T>
): JSX.Element {
    const items: JSX.Element[] = [];
    
    if (props.handleView !== null) {
        items.push(
            <Dropdown.Item
                href="#"
                key={`${props.rowIndex}_view`}
                onClick={(e) => {
                    e.preventDefault();
                    props.handleView!(props.entity.id);
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
                    props.handleEdit!(props.entity.id);
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
                        props.handleDelete!(props.entity.id);
                    }}
                >Delete</Dropdown.Item>
            </React.Fragment>
        );
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" size='sm'>
                <img
                    src={`${URL_IMAGE_ROOT}/icons/edit_document_dark.svg`}
                    alt="Progress entry options"
                    title="Progress entry options"
                />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {items.map(i => i)}
            </Dropdown.Menu>
        </Dropdown>
    );
}
