import React, { JSX, useState, useEffect } from 'react';
import { fetchData } from '../../includes/utils';
import { ProgressEntry } from '../../types/entities';
import { ProgressEntriesTransformer } from '../../includes/transformers';
import { URL_GOAL_PROGRESS } from '../../includes/paths';

/**
 * The main component for managing the progress entries related to a specific goal.
 */
export default function GoalManager(): JSX.Element {
    const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // fetchProgressEntries();
        console.log("Fetching progress entries");
    }, []);

    const fetchProgressEntries = async () => {
        setLoading(true);

        try {
            const entries = await fetchData<ProgressEntry[]>(URL_GOAL_PROGRESS, ProgressEntriesTransformer);
            setProgressEntries([...entries]);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setError('Unable to fetch song list. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="goal-manager">
            Hello goals.
        </div>
    );
}
