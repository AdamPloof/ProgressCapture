import { useState, JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AddProgressModalProps } from 'types/props';

export default function AddProgressModal(props: AddProgressModalProps): JSX.Element {
    const [progressType, setProgressType] = useState<string>('');
    const [progressDate, setProgressDate] = useState<Date | null>(null);
    const [hours, setHours] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');

    const handleChangeProgressType = (pt: string) => setProgressType(pt);

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
                            className='form-select'
                            onChange={e => {
                                handleChangeProgressType(e.target.value);
                            }}
                        >
                            <option value="flight-time">Solo flight time</option>
                            <option value="flight-time">Instructor flight time</option>
                        </select>
                    </div>
                    <div className="mb-3 d-flex flex-row">
                        <div className="col me-3">
                            <label htmlFor="progress-date">Date</label>
                            <input
                                name='progress-date'
                                type="date"
                                className='form-control'
                                value={progressDate ? progressDate.toDateString() : ''}
                                onChange={e => {
                                    setProgressDate(new Date(e.target.value));
                                }}
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="progress-hours">Hours</label>
                            <input
                                name='progress-hours'
                                type="number"
                                className='form-control'
                                value={hours}
                                onChange={e => {
                                    setHours(Number(e.target.value));
                                }}
                            />
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
                <Button variant='primary' onClick={props.handleClose}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}
