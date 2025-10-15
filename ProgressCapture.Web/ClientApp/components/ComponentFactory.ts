import { JSX } from 'react';
import GoalManager from './Goals/GoalManager';

export default function ComponentFactory(componentType: string): () => JSX.Element {
    switch (componentType) {
        case 'goalManager':
            return GoalManager;
        default:
            throw new Error("Invalid componentType provided");
    }
}
