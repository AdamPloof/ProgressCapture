import { useState, JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AddProgressModalProps } from 'types/props';
import { formatDateYmd } from '../../includes/utils';
import { ProgressType, ProgressEntry } from 'types/entities';

export default function AddProgressModal(props: AddProgressModalProps): JSX.Element {
    const [progressType, setProgressType] = useState<ProgressType | null>(null);
    const [progressDate, setProgressDate] = useState<Date | null>(null);
    const [units, setUnits] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handleSave = (): void => {
        setIsSubmitted(true);
        if (submissionIsValid()) {
            const progress: ProgressEntry = {
                id: -1,
                date: progressDate!,
                amount: units,
                notes: notes,
                progressType: progressType!
            };
            props.addProgress(progress);
            props.handleClose();
        }
    };

    const handleChangeProgressType = (progressTypeId: number) => {
        const type = props.progressTypes.find(t => t.id == progressTypeId);
        if (type !== undefined) {
            setProgressType(type);
        }
    };

    const submissionIsValid = (): boolean => {
        let isValid = true;
        if (progressType === null) {
            isValid = false;
        } else if (units <= 0) {
            isValid = false;
        } else if (progressDate === null) {
            isValid = false;
        }

        return isValid;
    };

    const unitOfMeasureName = (): string => {
        if (!progressType) {
            return 'units';
        }

        return progressType.unitOfMeasure.name.toLocaleLowerCase();
    };

    const progressTypeClass = (): string => {
        if (!isSubmitted) {
            return 'form-select';
        } else if (progressType !== null) {
            return 'form-select';
        }

        return 'form-select is-invalid';
    };

    const unitsClass = (): string => {
        if (!isSubmitted) {
            return 'form-control';
        } else if (units > 0) {
            return 'form-control';
        }

        return 'form-control is-invalid';
    };

    const progressDateClass = (): string => {
        if (!isSubmitted) {
            return 'form-control';
        } else if (progressDate !== null) {
            return 'form-control';
        }

        return 'form-control is-invalid';
    };

    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop='static' size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Add Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="progress-form-wrapper">
                    <div className="mb-3">
                        <label htmlFor="progress-type">Type</label>
                        <select
                            name="progress-type"
                            id="progress-type"
                            className={progressTypeClass()}
                            value={progressType ? progressType.id : ''}
                            onChange={e => {
                                handleChangeProgressType(Number(e.target.value));
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
                                value={progressDate ? formatDateYmd(progressDate) : ''}
                                onChange={e => {
                                    setProgressDate(new Date(e.target.value));
                                }}
                            />
                            <div className="invalid-feedback">Please select a valid date</div>
                        </div>
                        <div className="col">
                            <label htmlFor="progress-units">Hours</label>
                            <input
                                name='progress-units'
                                type="number"
                                className={unitsClass()}
                                value={units}
                                onChange={e => {
                                    setUnits(Number(e.target.value));
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
                            value={notes}
                            onChange={e => {
                                setNotes(e.target.value);
                            }}
                        ></textarea>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.handleClose}>Cancel</Button>
                <Button variant='primary' onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}
