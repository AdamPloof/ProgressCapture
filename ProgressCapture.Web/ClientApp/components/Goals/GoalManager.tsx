import React, { JSX, useState, useEffect } from 'react';
import AddProgressModal from './AddProgressModal';
import { WidgetProps } from 'types/props';
import { fetchData, replaceUrlPlaceholders } from '../../includes/utils';
import { Goal, ProgressEntry } from '../../types/entities';
import { goalTransformer, progressEntriesTransformer } from '../../includes/transformers';
import { URL_GOAL, URL_GOAL_PROGRESS } from '../../includes/paths';

// TODO: add interface for adding new progress entries

/**
 * The main component for managing the progress entries related to a specific goal.
 */
export default function GoalManager(props: WidgetProps): JSX.Element {
    const [goal, setGoal] = useState<Goal | null>(null);
    const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
    const [goalLoading, setGoalLoading] = useState<boolean>(false);
    const [entryLoading, setEntryLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        fetchProgressEntries();
        fetchGoal();
    }, []);

    const fetchGoal = async (): Promise<void> => {
        setGoalLoading(true);
        try {
            const url = replaceUrlPlaceholders(URL_GOAL, [String(props.entityId)]);
            const goal = await fetchData(url, goalTransformer);
            setGoal(goal);
            setGoalLoading(false);
        } catch (e) {
            console.error(e);
            setError('Unable to fetch Goal info. Please try again.');
            setGoalLoading(false);
        }
    };

    const fetchProgressEntries = async (): Promise<void> => {
        setEntryLoading(true);
        try {
            const url = replaceUrlPlaceholders(URL_GOAL_PROGRESS, [String(props.entityId)]);
            const entries = await fetchData<ProgressEntry[]>(url, progressEntriesTransformer);
            setProgressEntries([...entries]);
            setEntryLoading(false);
        } catch (e) {
            console.error(e);
            setError('Unable to Progress Entries. Please try again.');
            setEntryLoading(false);
        }
    };

    const addProgress = async (progress: ProgressEntry): Promise<void> => {

    };

    const tableRow = (entry: ProgressEntry): JSX.Element => {
        return(
            <tr key={`tr-${entry.id}`}>
                <td>{entry.date.toDateString()}</td>
                <td>{entry.progressType.name}</td>
                <td>{entry.amount}</td>
                <td>{entry.notes}</td>
            </tr>
        );
    }

    const noEntriesRow = (): JSX.Element => {
        return (
            <tr>
                <td colSpan={4}>No progress recorded yet. <a href="#">Add an entry</a> to get started</td>
            </tr>
        );
    }

    const widgetHeader = (): JSX.Element => {
        return (
            <div className="goal-manager-header d-flex flex-row justify-content-between border-bottom p-4">
                <div className="header-info"><h2>{goal ? goal.name : '...'}</h2></div>
                <div className="header-tools d-flex justify-content-end">
                    <button className='btn btn-primary' onClick={handleShowModal}>Add Progress</button>
                </div>
            </div>
        );
    }

    // TODO: handle loading entries, goal details, error
    return (
        <React.Fragment>
            <div className="goal-manager container border">
                {widgetHeader()}
                <table className={progressEntries.length > 1 ? 'table table-striped' : 'table'}>
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Type</th>
                            <th scope="col">Hours</th>
                            <th scope="col">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {progressEntries.length > 0 ? progressEntries.map(e => tableRow(e)): noEntriesRow()}
                    </tbody>
                </table>
            </div>
            <AddProgressModal
                show={showModal}
                handleShow={handleShowModal}
                handleClose={handleCloseModal}
                addProgress={addProgress}
            ></AddProgressModal>
        </React.Fragment>
    );
}
