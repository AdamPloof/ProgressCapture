import { JSX, useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Goal } from '../../types/entities';

export default function Navbar(): JSX.Element {
    const [goals, setGoals] = useState<Goal[]>([]);

    const goalsDropdown = (): JSX.Element => {
        return (
            <NavDropdown title="Goals">
                <NavDropdown.Item>Something</NavDropdown.Item>
            </NavDropdown>
        );
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3">
            <div className="container-fluid">
                <a className="navbar-brand" href='#'>Progress Capture</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">
                        {goalsDropdown()}
                        <li className="nav-item">
                            <a className="nav-link" asp-route="Home">List</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" asp-route="Home">Calendar</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" asp-route="upload-progress">Upload</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
