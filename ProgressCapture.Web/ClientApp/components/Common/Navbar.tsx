import { JSX } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ControlSelect from './ControlSelect';
import { NavbarProps } from '../../types/props';
import {
    URL_LOGIN,
    URL_LOGOUT,
    URL_IMPORT_PROGRESS,
    URL_NEW_GOAL
} from '../../includes/paths';
import { titleCase } from '../../includes/utils';

export default function Navbar(props: NavbarProps): JSX.Element {
    const goalsDropdown = (): JSX.Element => {
        return (
            <NavDropdown title="Goals">
                {props.goals.map(g => {
                    return (
                        <NavDropdown.Item
                            key={`nav_itemt_${g.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                props.handleChangeGoal(g);
                            }}
                        >{titleCase(g.name)}</NavDropdown.Item>
                    );
                })}
                <NavDropdown.Divider />
                <NavDropdown.Item href={URL_NEW_GOAL}>
                    New Goal
                </NavDropdown.Item>
            </NavDropdown>
        );
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3">
            <div className="container-fluid">
                <a
                    className="navbar-brand"
                    href='#'
                    onClick={e => { e.preventDefault(); }}
                >Progress Capture</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    {/* Nav left */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {goalsDropdown()}
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href={URL_IMPORT_PROGRESS}
                            >Upload</a>
                        </li>
                    </ul>
                    {/* Nav middle */}
                    <ControlSelect
                        activeControl={props.activeControl}
                        handleChangeControlType={props.handleChangeControlType}
                    ></ControlSelect>
                    {/* Nav right */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a href={URL_LOGIN} className='nav-link'>Login</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
