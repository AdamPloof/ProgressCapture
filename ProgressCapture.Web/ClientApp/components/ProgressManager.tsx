import React, { JSX, useState, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button'
import ProgressTable from './ProgressTable/ProgressTable';
import ProgressCalendar from './ProgressCalendar/ProgressCalendar';
import Navbar from './Common/Navbar';
import SummarySidebar from './Common/SummarySidebar';
import Modal from 'react-bootstrap/Modal';
import ProgressModal from './Common/ProgressModal';
import ViewProgressModalContent from './Common/ViewProgressModalContent';
import EditProgressModalContent from './Common/EditProgressModalContent';
import ConfirmationModalContent from './Common/ConfirmationModalContent';
import AlertDismissible from './Common/AlertDismissable';
import { ControlType, ProgressManagerProps } from 'types/props';
import { CAL_DATE_FORMAT_OPS } from '../includes/consts';
import {
    fetchData,
    replaceUrlPlaceholders,
    calculateProgressStats,
} from '../includes/utils';
import {
    Goal,
    ProgressEntry,
    ProgressType,
    ProgressEntryInputModel,
} from '../types/entities';
import {
    goalsTransformer,
    progressEntriesTransformer,
    progressTypeTransformer
} from '../includes/transformers';
import {
    URL_GOALS,
    URL_GOAL_PROGRESS,
    URL_GOAL_PROGRESS_TYPES,
    URL_ADD_PROGRESS,
    URL_UPDATE_PROGRESS,
    URL_DELETE_PROGRESS,
} from '../includes/paths';

const MODAL_TYPES = {
    VIEW: 'view',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
} as const;
type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];

/**
 * The main component for managing the progress entries related to a specific goal.
 */
export default function ProgressManager(props: ProgressManagerProps): JSX.Element {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<ProgressEntry | null>(null);
    const [progressTypes, setProgressTypes] = useState<ProgressType[]>([]);
    const [inputModel, setInputModel] = useState<ProgressEntryInputModel>({
        id: null,
        goalId: null,
        date: null,
        amount: 0,
        notes: null,
        progressTypeId: null
    });

    const [controlType, setControlType] = useState<ControlType>(props.controlType);
    const [goalLoading, setGoalLoading] = useState<boolean>(false);
    const [progressLoading, setprogressLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>(MODAL_TYPES.CREATE);

    const stats = useMemo(
        () => calculateProgressStats(progressTypes, progressEntries),
        [progressTypes, progressEntries]
    );

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseErrorAlert = () => {
        setError(null);
    };

    useEffect(() => {
        fetchGoals();
        fetchProgressEntries();
        fetchProgressTypes();
    }, []);

    const fetchGoals = async (): Promise<void> => {
        setGoalLoading(true);
        try {
            const url = replaceUrlPlaceholders(URL_GOALS, [String(props.goalId)]);
            const userGoals = await fetchData(url, goalsTransformer);
            setGoals(userGoals);
            if (selectedGoal === null) {
                const defaultGoal: Goal | undefined = userGoals.find(g => g.id === props.goalId);
                if (!defaultGoal) {
                    throw new Error(`Default goal ID ${props.goalId} could not be found in user goals`);
                }

                setSelectedGoal(defaultGoal);
            }

            setGoalLoading(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Unable to load goal. Error: ${err.message}`);
            }
            setGoalLoading(false);
        }
    };

    const fetchProgressEntries = async (): Promise<void> => {
        setprogressLoading(true);
        try {
            const url = replaceUrlPlaceholders(URL_GOAL_PROGRESS, [String(props.goalId)]);
            const entries = await fetchData<ProgressEntry[]>(url, progressEntriesTransformer);
            setProgressEntries([...entries]);
            setprogressLoading(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Unable to load progress entries. Error: ${err.message}`);
            }
            setprogressLoading(false);
        }
    };

    const fetchProgressTypes = async (): Promise<void> => {
        // Background fetch, no loading indicator needed.
        try {
            const url = replaceUrlPlaceholders(URL_GOAL_PROGRESS_TYPES, [String(props.goalId)]);
            const types = await fetchData<ProgressType[]>(url, progressTypeTransformer);
            setProgressTypes([...types]);
        } catch (err) {
            if (err instanceof Error) {
                setError(`Unable to load progress types. Error: ${err.message}`);
            }
        }
    };

    const handleChangeSelectedGoal = (goal: Goal): void => {
        if (selectedGoal && goal.id === selectedGoal.id) {
            return;
        }

        setSelectedGoal(goal);
    }

    const handleChangeControlType = (type: ControlType): void => {
        if (type === controlType) {
            return;
        }

        setControlType(type);
    };

    const handleSaveProgress = async (progressInput: ProgressEntryInputModel): Promise<void> => {
        try {
            if (progressInput.id === null) {
                await addProgress(progressInput).catch(e => { throw e; });
            } else {
                await updateProgress(progressInput).catch(e => { throw e; });
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    const addProgress = async (progressInput: ProgressEntryInputModel): Promise<void> => {
        if (!selectedGoal) {
            throw new Error('Unable to submit progress entry. Goal is undefined');
        }

        if (!progressInput.date) {
            throw new Error('Date for new progress entry is empty');
        }
        
        if (progressInput.progressTypeId === null) {
            throw new Error('Progress Type for new progress entry is empty');
        }

        const entryType: ProgressType | undefined = progressTypes.find(
            t => t.id === progressInput.progressTypeId
        );
        if (!entryType) {
            throw new Error(`Could not find progress type for id: ${progressInput.progressTypeId}`);
        }
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progressInput)
        };
        const res = await fetch(URL_ADD_PROGRESS, params);
        if (!res.ok) {
            throw new Error('Unable to add progress: network error');
        }
        const data = await res.json();
        const entryId: number = Number(data.id);
        const entryDate: Date = progressInput.date
        const newProgress: ProgressEntry = {
            id: entryId,
            date: entryDate,
            amount: progressInput.amount ?? 0,
            notes: progressInput.notes,
            progressType: entryType
        };
        setProgressEntries([newProgress, ...progressEntries]);
        resetInputModel();
    };

    const updateProgress = async (progressInput: ProgressEntryInputModel): Promise<void> => {
        if (!selectedGoal) {
            throw new Error('Unable to submit progress entry. Goal is undefined');
        }

        if (!progressInput.id) {
            throw new Error('Unable to submit progress entry. ID not provided');
        }

        if (!progressInput.date) {
            throw new Error('Date for new progress entry is empty');
        }
        
        if (progressInput.progressTypeId === null) {
            throw new Error('Progress Type for new progress entry is empty');
        }

        const entryType: ProgressType | undefined = progressTypes.find(
            t => t.id === progressInput.progressTypeId
        );
        if (!entryType) {
            throw new Error(`Could not find progress type for id: ${progressInput.progressTypeId}`);
        }

        const url = replaceUrlPlaceholders(URL_UPDATE_PROGRESS, [String(progressInput.id)]);
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progressInput)
        };
        const res = await fetch(url, params);
        if (!res.ok) {
            throw new Error(`Unable to update progress ${[progressInput.id]}. Network error.`);
        }

        const data = await res.json();
        const entryId: number = Number(data.id);
        const entryDate: Date = progressInput.date
        const newEntries = [...progressEntries];
        for (const entry of newEntries) {
            if (entry.id !== entryId) {
                continue;
            }

            entry.date = entryDate;
            entry.amount = progressInput.amount ?? 0;
            entry.progressType = entryType;
            entry.notes = progressInput.notes;
        }

        setProgressEntries(newEntries);
        resetInputModel();
    };

    const deleteProgress = async (progressId: number): Promise<void> => {
        const url = replaceUrlPlaceholders(URL_DELETE_PROGRESS, [String(progressId)]);
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        const res = await fetch(url, params);
        if (!res.ok) {
            setError(`Unable to delete progress ${progressId}. Network error.`);
            resetInputModel();

            return;
        }

        setProgressEntries(progressEntries.filter(p => p.id !== progressId));
        resetInputModel();
    };

    const handleCreate = (): void => {
        if (!selectedGoal) {
            throw new Error('Unable to add new progress entry. Goal is empty');
        }

        setSelectedEntry(null);
        setInputModel({
            id: null,
            goalId: selectedGoal.id,
            date: null,
            amount: 0,
            notes: null,
            progressTypeId: null
        });
        setModalType(MODAL_TYPES.CREATE);
        handleShowModal();
    };

    const handleEdit = (entityId: number): void => {
        const target = progressEntries.find(e => e.id === entityId);
        if (!target) {
            throw new Error(`Unable to edit entry. Could not find entry for id ${entityId}.`);
        }

        setSelectedEntry({...target});
        setInputModel({
            id: target.id,
            goalId: target.progressType.goalId,
            date: target.date,
            amount: target.amount,
            notes: target.notes,
            progressTypeId: target.progressType.id
        });
        setModalType(MODAL_TYPES.EDIT);
        handleShowModal();
    };

    const handleView = (entityId: number): void => {
        const target = progressEntries.find(e => e.id === entityId);
        if (!target) {
            throw new Error(`Unable to edit entry. Could not find entry for id ${entityId}.`);
        }
        setSelectedEntry({...target});
        setInputModel({
            id: target.id,
            goalId: target.progressType.goalId,
            date: target.date,
            amount: target.amount,
            notes: target.notes,
            progressTypeId: target.progressType.id
        });
        setModalType(MODAL_TYPES.VIEW);
        handleShowModal();
    };

    const handleDelete = (entityId: number): void => {
        const target = progressEntries.find(p => p.id === entityId);
        if (!target) {
            throw new Error(`Could not delete progress entry. No progress found for ID: ${entityId}`);
        }

        setSelectedEntry({...target});
        setModalType(MODAL_TYPES.DELETE);
        setInputModel({
            id: entityId,
            goalId: null,
            date: null,
            amount: 0,
            notes: null,
            progressTypeId: null
        });
        handleShowModal();
    };

    const deleteProgressMessage = (): JSX.Element => {
        if (!selectedEntry) {
            return (
                <p className='text-danger'>Oops! Something went wrong. No progress has been selected.</p>
            );
        }

        return (
            <React.Fragment>
                <p>Are you sure you want to delete this progress?</p>
                <ul>
                    <li>
                        <strong>Date:</strong> {selectedEntry.date.toLocaleDateString('en-US', CAL_DATE_FORMAT_OPS)}
                    </li>
                    <li>
                        <strong>Type:</strong> {selectedEntry.progressType.name}
                    </li>
                    <li>
                        <strong>Amount:</strong> {selectedEntry.amount}
                    </li>
                    <li>
                        <strong>Notes:</strong> {selectedEntry.notes}
                    </li>
                </ul>
            </React.Fragment>
        );
    };

    const getModalContent = (): JSX.Element => {
        if (modalType !== MODAL_TYPES.CREATE && !selectedEntry) {
            throw new Error(`Unable to edit entry. No entry selected`);
        }

        let content: JSX.Element;
        switch (modalType) {
            case MODAL_TYPES.VIEW:
                content = (
                    <ViewProgressModalContent
                        show={showModal}
                        entry={selectedEntry!}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleShow={handleShowModal}
                        handleClose={handleCloseModal}
                    ></ViewProgressModalContent>
                );
                break;
            case MODAL_TYPES.CREATE:
                content = (
                    <EditProgressModalContent
                        show={showModal}
                        inputModel={inputModel}
                        progressTypes={progressTypes}
                        setInputModel={setInputModel}
                        handleShow={handleShowModal}
                        handleClose={handleCloseModal}
                        handleSaveProgress={handleSaveProgress}
                    ></EditProgressModalContent>
                );
                break;
            case MODAL_TYPES.EDIT:
                content = (
                    <EditProgressModalContent
                        show={showModal}
                        inputModel={inputModel}
                        progressTypes={progressTypes}
                        setInputModel={setInputModel}
                        handleShow={handleShowModal}
                        handleClose={handleCloseModal}
                        handleSaveProgress={handleSaveProgress}
                    ></EditProgressModalContent>
                );
                break;
            case MODAL_TYPES.DELETE:
                content = (
                    <ConfirmationModalContent
                        show={showModal}
                        title={'Delete Progress'}
                        message={deleteProgressMessage()}
                        confirmClass={'danger'}
                        confirmBtnText={'Delete'}
                        inputModel={inputModel}
                        handleConfirm={deleteProgress}
                        handleClose={handleCloseModal}
                    ></ConfirmationModalContent>
                );
                break;
            default:
                content = (
                    <React.Fragment>
                        <Modal.Header closeButton>
                            <Modal.Title className="d-flex flex-row justify-content-between">
                                No Progress Selected
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-danger">Oops! It looks like something has gone wrong.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            (<Button variant='secondary' onClick={handleCloseModal}>Close</Button>)
                        </Modal.Footer>
                    </React.Fragment>
                );
        }

        return content;
    };

    const resetInputModel = (): void => {
        setInputModel({
            id: null,
            goalId: null,
            date: null,
            amount: 0,
            notes: null,
            progressTypeId: null
        });
    };

    const errorAlert = (): JSX.Element => {
        return (
            <AlertDismissible
                title={null}
                message={error ?? ''}
                type={'danger'}
                handleClose={handleCloseErrorAlert}
            ></AlertDismissible>
        );
    };

    const progressControl = (): JSX.Element => {
        switch (controlType) {
            case 'list':
                return (
                    <ProgressTable
                        goal={selectedGoal}
                        entries={progressEntries}
                        goalLoading={goalLoading}
                        progressLoading={progressLoading}
                        handleView={handleView}
                        handleCreate={handleCreate}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    ></ProgressTable>
                );
            case 'calendar':
                return (
                    <ProgressCalendar
                        goal={selectedGoal}
                        entries={progressEntries}
                        goalLoading={goalLoading}
                        progressLoading={progressLoading}
                        handleView={handleView}
                        handleCreate={handleCreate}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    ></ProgressCalendar>
                );
            default:
                throw new Error(`Invalid controlType. Expected 'calendar' or 'list', got: ${controlType}`);
        }
    };

    return (
        <div className="app-layout">
            <header>
                <Navbar
                    goals={goals}
                    activeControl={controlType}
                    handleChangeControlType={handleChangeControlType}
                    handleChangeGoal={handleChangeSelectedGoal}
                ></Navbar>
            </header>

            <div className="container-fluid d-flex flex-column flex-grow-1">
                {/* Flash Message */}

                <main role="main" className="d-flex flex-column flex-grow-1 pb-3">
                    {error ? errorAlert() : null}
                    <div className="content-wrapper d-flex flex-row justify-content-between">
                        {progressControl()}
                        <SummarySidebar
                            goal={selectedGoal}
                            stats={stats}
                        ></SummarySidebar>
                    </div>
                </main>
            </div>

            <footer className="border-top footer text-muted">
                <div className="container">
                    &copy; 2025 - ProgressCapture.Web - <a asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
                </div>
            </footer>

            <ProgressModal
                show={showModal}
                handleShow={handleShowModal}
                handleClose={handleCloseModal}
                content={getModalContent()}
            ></ProgressModal>
        </div>
    );
}
