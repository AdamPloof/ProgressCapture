import { JSX } from 'react';
import { ControlSelectProps, ControlType } from 'types/props';
import { CONTROL_TYPES } from '../../includes/consts';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function ControlSelect(props: ControlSelectProps): JSX.Element {
    const linkClass = (controlType: ControlType): string => {
        if (props.activeControl === controlType) {
            return 'btn btn-outline-secondary active';
        }

        return 'btn btn-outline-secondary';
    };

    return (
        <div
            className="btn-group navbar-nav navbar-center nav-control-btns mb-2 mb-lg-0"
            role="group"
            aria-label="Calendar type and list select buttons"
        >
            <button
                type="button"
                className={linkClass(CONTROL_TYPES.CALENDAR_MONTH)}
                onClick={(e) => {
                        e.preventDefault();
                        props.handleChangeControlType(CONTROL_TYPES.CALENDAR_MONTH);
                    }}
            >
                <img
                    src={`${URL_IMAGE_ROOT}/icons/calendar_month_dark.svg`}
                    className='me-2'
                    alt="Month Calendar Icon"
                />
                Month
            </button>
            <button
                type="button"
                className={linkClass(CONTROL_TYPES.CALENDAR_WEEK)}
                onClick={(e) => {
                        e.preventDefault();
                        props.handleChangeControlType(CONTROL_TYPES.CALENDAR_WEEK);
                    }}
            >
                <img
                    src={`${URL_IMAGE_ROOT}/icons/calendar_week_dark.svg`}
                    className='me-2'
                    alt="Week Calendar Icon"
                />
                Week
            </button>
            <button
                type="button"
                className={linkClass(CONTROL_TYPES.LIST)}
                onClick={(e) => {
                        e.preventDefault();
                        props.handleChangeControlType(CONTROL_TYPES.LIST);
                    }}
            >
                <img
                    src={`${URL_IMAGE_ROOT}/icons/list_dark.svg`}
                    className='me-2'
                    alt="List Icon"
                />
                List
            </button>
        </div>
    );
}
