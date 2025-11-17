import { JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ConfirmationModalProps } from 'types/props';

export default function ConfirmationModal(props: ConfirmationModalProps): JSX.Element {
    const confirmClass = props.confirmClass ?? 'primary';

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.handleClose}>Cancel</Button>
                <Button variant={confirmClass} onClick={() => {
                    if (props.inputModel.id === null) {
                        throw new Error('Unable to delete progress entry. Progress ID is null.');
                    }

                    props.handleConfirm(props.inputModel.id);
                    props.handleClose();
                }}>{props.confirmBtnText ?? 'Save'}</Button>
            </Modal.Footer>
        </Modal>
    );
}
