import React, { JSX } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProgressOptionsProps } from 'types/props';

export default function ProgressOptions(props: ProgressOptionsProps): JSX.Element {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size='sm'>
                Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item
                    href="#/"
                    onClick={() => props.handleEdit(props.entryId)}
                >Edit</Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                    href="#/"
                    bsPrefix='dropdown-item text-danger'
                    onClick={() => props.handleDelete(props.entryId)}
                >Delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
