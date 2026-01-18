import React, { JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ViewProgressModalProps } from 'types/props';
import { LONG_DATE_FORMAT_OPS } from '../../includes/consts';

export default function ViewProgressModalContent(props: ViewProgressModalProps): JSX.Element {
    const body = (): JSX.Element => {
        return (
            <React.Fragment>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="view-info-top">
                            <h6>Type</h6>
                            <p className='mb-0'>{props.entry.progressType.name}</p>
                        </div>
                        <div className="view-controls d-flex flex-row justify-content-end pb-3">
                            <a
                                href="#"
                                className='btn btn-primary'
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.handleEdit(props.entry.id);
                                }}
                            >Edit</a>
                            <a
                                href="#"
                                className='ms-2 btn btn-danger'
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.handleDelete(props.entry.id);
                                }}
                            >Delete</a>
                        </div>
                    </div>
                    <div className="view-info-bottom">
                        <h6 className='mt-3'>{props.entry.progressType.unitOfMeasure.name}</h6>
                        <p className='mb-0'>{props.entry.amount}</p>
                        <h6 className='mt-3'>Notes</h6>
                        <p className='mb-0'>{props.entry.notes}</p>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    const footer = (): JSX.Element => {
        return (<Button variant='secondary' onClick={props.handleClose}>Close</Button>);
    };

    return (
        <React.Fragment>
            <Modal.Header closeButton>
                <Modal.Title className="d-flex flex-row justify-content-between">
                    {props.entry.date.toLocaleDateString('en-US', LONG_DATE_FORMAT_OPS)}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body()}
            </Modal.Body>
            <Modal.Footer>
                {footer()}
            </Modal.Footer>
        </React.Fragment>
    );
}
