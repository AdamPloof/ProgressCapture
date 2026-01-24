import { JSX, useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Goal } from '../../types/entities';
import { NavbarProps, ControlType } from '../../types/props';
import { CONTROL_TYPES } from '../../includes/consts';
import { URL_IMPORT_PROGRESS } from '../../includes/paths';
import { titleCase } from '../../includes/utils';

export default function Navbar(props: NavbarProps): JSX.Element {
    const [goals, setGoals] = useState<Goal[]>([]);

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
            </NavDropdown>
        );
    };

    const linkClass = (controlType: ControlType): string => {
        if (props.activeControl === controlType) {
            return 'nav-link active';
        }

        return 'nav-link';
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
                    <ul className="navbar-nav navbar-center mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a
                                className={linkClass(CONTROL_TYPES.CALENDAR_MONTH)}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.handleChangeControlType(CONTROL_TYPES.CALENDAR_MONTH);
                                }}
                            >Month</a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={linkClass(CONTROL_TYPES.CALENDAR_WEEK)}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.handleChangeControlType(CONTROL_TYPES.CALENDAR_WEEK);
                                }}
                            >Week</a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={linkClass(CONTROL_TYPES.LIST)}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.handleChangeControlType(CONTROL_TYPES.LIST);
                                }}
                            >List</a>
                        </li>
                    </ul>
                    {/* Nav right */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a href="#" className='nav-link'>Login</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
