import React, { JSX } from 'react';
import { URL_IMAGE_ROOT } from '../../includes/paths';

export default function Loader(): JSX.Element {
    return (
        <div className="loader d-flex justify-content-center align-items-center p-4">
            <img src={`${URL_IMAGE_ROOT}/loader.svg`} alt="Loading..." width="50px" />
        </div>
    );
}
