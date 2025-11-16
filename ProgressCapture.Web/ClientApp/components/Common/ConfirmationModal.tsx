import { JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ConfirmationModalProps } from 'types/props';

export default function ConfirmationModal(props: ConfirmationModalProps): JSX.Element {
    const confirmClass = props.confirmClass ?? 'primary';

    return (
        <Modal
            show={props.show}
            onHide={props.handleCancel}
        >
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {props.message}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.handleCancel}>Cancel</Button>
                <Button variant={confirmClass} onClick={props.handleConfirm}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
