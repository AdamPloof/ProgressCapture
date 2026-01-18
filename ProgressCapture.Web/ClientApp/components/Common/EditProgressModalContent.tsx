import React, { useState, JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { EditProgressModalProps } from 'types/props';
import { titleCase } from '../../includes/utils';
import { formatDateYmd } from '../../includes/utils';

export default function EditProgressModalContent(props: EditProgressModalProps): JSX.Element {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const unitOfMeasureName = (): string => {
        if (props.inputModel.progressTypeId === null) {
            return 'units';
        }

        const uomName: string | undefined = props.progressTypes.find(t => {
            return t.id === props.inputModel.progressTypeId;
        })?.unitOfMeasure.name;

        return uomName ?? 'units';
    };

    const handleSave = (): void => {
        setIsSubmitted(true);
        if (submissionIsValid()) {
            props.handleSaveProgress(props.inputModel);
            props.handleClose();
        }
    };

    const submissionIsValid = (): boolean => {
        let isValid = true;
        const amount = props.inputModel.amount ?? 0;
        if (props.inputModel.progressTypeId === null) {
            isValid = false;
        } else if (amount <= 0) {
            isValid = false;
        } else if (props.inputModel.date === null) {
            isValid = false;
        }

        return isValid;
    };

    const progressTypeClass = (): string => {
        if (!isSubmitted) {
            return 'form-select';
        } else if (props.inputModel.progressTypeId !== null) {
            return 'form-select';
        }

        return 'form-select is-invalid';
    };

    const unitsClass = (): string => {
        const amount = props.inputModel.amount ?? 0;
        if (!isSubmitted) {
            return 'form-control';
        } else if (amount > 0) {
            return 'form-control';
        }

        return 'form-control is-invalid';
    };

    const progressDateClass = (): string => {
        if (!isSubmitted) {
            return 'form-control';
        } else if (props.inputModel.date !== null) {
            return 'form-control';
        }

        return 'form-control is-invalid';
    };

    return (
        <React.Fragment>
            <Modal.Header closeButton>
                <Modal.Title>{props.inputModel.id ? 'Edit Progress' : 'Add Progress'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="progress-form-wrapper">
                    <div className="mb-3">
                        <label htmlFor="progress-type">Type</label>
                        <select
                            name="progress-type"
                            id="progress-type"
                            className={progressTypeClass()}
                            value={props.inputModel.progressTypeId ? props.inputModel.progressTypeId : ''}
                            onChange={e => {
                                const newModel = {...props.inputModel};
                                newModel.progressTypeId = Number(e.target.value);
                                props.setInputModel(newModel);
                            }}
                        >
                            <option disabled value="">Select progress type...</option>
                            {props.progressTypes.map(t => {
                                return (
                                    <option
                                        key={`type-opt-${t.id}`}
                                        value={t.id}
                                    >{t.name}</option>
                                );
                            })}
                        </select>
                        <div className="invalid-feedback">Please select a type</div>
                    </div>
                    <div className="mb-3 d-flex flex-row">
                        <div className="col me-3">
                            <label htmlFor="progress-date">Date</label>
                            <input
                                name='progress-date'
                                type="date"
                                className={progressDateClass()}
                                value={props.inputModel.date ? formatDateYmd(props.inputModel.date) : ''}
                                onChange={e => {
                                    const newModel = {...props.inputModel};
                                    newModel.date = new Date(e.target.value);
                                    props.setInputModel(newModel);
                                }}
                            />
                            <div className="invalid-feedback">Please select a valid date</div>
                        </div>
                        <div className="col">
                            <label htmlFor="progress-units">{titleCase(unitOfMeasureName())}</label>
                            <input
                                name='progress-units'
                                type="number"
                                className={unitsClass()}
                                value={props.inputModel.amount ?? ''}
                                onChange={e => {
                                    const newModel = {...props.inputModel};
                                    if (e.target.value === '') {
                                        newModel.amount = null;
                                    } else {
                                        newModel.amount = Number(e.target.value);
                                    }
                                    props.setInputModel(newModel);
                                }}
                            />
                            <div className="invalid-feedback">
                                {`Please enter the number of ${unitOfMeasureName()}`}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="progress-notes">Notes</label>
                        <textarea
                            name="progress-notes"
                            id="progress-notes"
                            className='form-control'
                            rows={3}
                            value={props.inputModel.notes ?? ''}
                            onChange={e => {
                                const newModel = {...props.inputModel};
                                newModel.notes = e.target.value;
                                props.setInputModel(newModel);
                            }}
                        ></textarea>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.handleClose}>Cancel</Button>
                <Button variant='primary' onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </React.Fragment>
    )
}
