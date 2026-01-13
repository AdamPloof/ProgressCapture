import React, { JSX, useState, useEffect, useMemo } from 'react';
import SummarySidebar from './Common/SummarySidebar';
import ProgressModal from './Common/ProgressModal';
import ConfirmationModal from './Common/ConfirmationModal';
import AlertDismissible from './Common/AlertDismissable';
import { ProgressManagerProps } from 'types/props';
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
    goalTransformer,
    progressEntriesTransformer,
    progressTypeTransformer
} from '../includes/transformers';
import {
    URL_GOAL,
    URL_GOAL_PROGRESS,
    URL_GOAL_PROGRESS_TYPES,
    URL_ADD_PROGRESS,
    URL_UPDATE_PROGRESS,
    URL_DELETE_PROGRESS,
} from '../includes/paths';

/**
 * The main component for managing the progress entries related to a specific goal.
 */
export default function ProgressManager(props: ProgressManagerProps): JSX.Element {
    const DATE_FORMAT_OPS: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    const [goal, setGoal] = useState<Goal | null>(null);
    const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
    const [progressTypes, setProgressTypes] = useState<ProgressType[]>([]);
    const [inputModel, setInputModel] = useState<ProgressEntryInputModel>({
        id: null,
        goalId: null,
        date: null,
        amount: 0,
        notes: null,
        progressTypeId: null
    });

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [deleteConfirmationMsg, setDeleteConfirmationMsg] = useState<string | JSX.Element>('');

    const [goalLoading, setGoalLoading] = useState<boolean>(false);
    const [progressLoading, setprogressLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const stats = useMemo(
        () => calculateProgressStats(progressTypes, progressEntries),
        [progressTypes, progressEntries]
    );

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
    const handleCloseErrorAlert = () => {
        setError(null);
    };

    useEffect(() => {
        fetchGoal();
        fetchProgressEntries();
        fetchProgressTypes();
    }, []);

    const fetchGoal = async (): Promise<void> => {
        setGoalLoading(true);
        try {
            const url = replaceUrlPlaceholders(URL_GOAL, [String(props.goalId)]);
            const goal = await fetchData(url, goalTransformer);
            setGoal(goal);
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
        if (!goal) {
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
        if (!goal) {
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

    const handleAddProgressEntry = (): void => {
        if (!goal) {
            throw new Error('Unable to add new progress entry. Goal is empty');
        }

        setInputModel({
            id: null,
            goalId: goal.id,
            date: null,
            amount: 0,
            notes: null,
            progressTypeId: null
        });
        handleShowModal();
    };

    const handleEditProgressEntry = (entityId: number): void => {
        const selectedEntry = progressEntries.find(e => e.id === entityId);
        if (!selectedEntry) {
            throw new Error(`Unable to edit entry. Could not find entry for id ${entityId}.`);
        }

        setInputModel({
            id: selectedEntry.id,
            goalId: selectedEntry.progressType.goalId,
            date: selectedEntry.date,
            amount: selectedEntry.amount,
            notes: selectedEntry.notes,
            progressTypeId: selectedEntry.progressType.id
        });
        handleShowModal();
    };

    const handleDeleteProgressEntry = (entityId: number): void => {
        const targetEntry = progressEntries.find(p => p.id === entityId);
        if (!targetEntry) {
            throw new Error(`Could not delete progress entry. No progress found for ID: ${entityId}`);
        }

        setInputModel({
            id: entityId,
            goalId: null,
            date: null,
            amount: 0,
            notes: null,
            progressTypeId: null
        });

        const msg = (
            <React.Fragment>
                <p>Are you sure you want to delete this progress?</p>
                <ul>
                    <li>
                        <strong>Date:</strong> {targetEntry.date.toLocaleDateString('en-US', DATE_FORMAT_OPS)}
                    </li>
                    <li>
                        <strong>Type:</strong> {targetEntry.progressType.name}
                    </li>
                    <li>
                        <strong>Amount:</strong> {targetEntry.amount}
                    </li>
                    <li>
                        <strong>Notes:</strong> {targetEntry.notes}
                    </li>
                </ul>
            </React.Fragment>
        );

        setDeleteConfirmationMsg(msg);
        setShowDeleteConfirmation(true);
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

    return (
        <React.Fragment>
            {error ? errorAlert() : null}
            <div className="content-wrapper d-flex flex-row justify-content-between">
                <props.control
                    goal={goal}
                    entries={progressEntries}
                    goalLoading={goalLoading}
                    progressLoading={progressLoading}
                    handleView={null}
                    handleCreate={handleAddProgressEntry}
                    handleEdit={handleEditProgressEntry}
                    handleDelete={handleDeleteProgressEntry}
                ></props.control>
                <SummarySidebar
                    goal={goal}
                    stats={stats}
                ></SummarySidebar>
            </div>
            <ProgressModal
                show={showModal}
                inputModel={inputModel}
                setInputModel={setInputModel}
                progressTypes={progressTypes}
                handleShow={handleShowModal}
                handleClose={handleCloseModal}
                handleSaveProgress={handleSaveProgress}
            ></ProgressModal>
            <ConfirmationModal
                show={showDeleteConfirmation}
                title={'Delete Progress'}
                message={deleteConfirmationMsg}
                confirmBtnText={'Delete'}
                confirmClass={'danger'}
                inputModel={inputModel}
                handleConfirm={deleteProgress}
                handleClose={handleCloseDeleteConfirmation}
            ></ConfirmationModal>
        </React.Fragment>
    );
}
