import { JSX } from 'react';

export default function SummarySidebar(): JSX.Element {
    return (
        <div className="summary-sidebar d-flex flex-column border rounded ms-4 flex-grow-1">
            <div className="sidebar-title pt-2 pb-2 ps-3 pe-3 border-bottom"><h4 className="mb-0">Progress</h4></div>
            <div className="sidebar-body flex-grow-1">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex flex-row justify-content-between">
                        <div className="list-left">Flight Time (Solo):</div>
                        <div className="list-right">12%</div>
                    </li>
                    <li className="list-group-item d-flex flex-row justify-content-between">
                        <div className="list-left">Flight Time (Instructor):</div>
                        <div className="list-right">32%</div>
                    </li>
                    <li className="list-group-item d-flex flex-row justify-content-between">
                        <div className="list-left"><strong>Total:</strong></div>
                        <div className="list-right"><strong>37%</strong></div>
                    </li>
                </ul>
            </div>
            <div className="sidebar-footer align-self-bottom">
                <div className="links d-flex flex-row justify-content-end pt-2 pb-2 ps-3 pe-3">
                    <a href="#">Goal settings</a>
                </div>
            </div>
        </div>
    );
}
