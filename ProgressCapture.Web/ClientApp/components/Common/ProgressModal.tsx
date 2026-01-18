import { JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ProgressModalProps } from 'types/props';

export default function ProgressModal(props: ProgressModalProps): JSX.Element {
    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop='static' size='lg'>
            {props.content}
        </Modal>
    );
}
