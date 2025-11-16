import React, { JSX } from 'react';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function Loader(): JSX.Element {
    return (
        <div className="loader">
            <img src={`${URL_IMAGE_ROOT}/loader.svg`} alt="Loading..." />
        </div>
    );
}
