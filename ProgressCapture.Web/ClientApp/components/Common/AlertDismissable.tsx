import { JSX } from 'react';
import Alert from 'react-bootstrap/Alert';
import { AlertProps } from '../../types/props';

export default function AlertDismissible(props: AlertProps): JSX.Element {
    return (
        <Alert variant={props.type ?? 'info'} onClose={props.handleClose} dismissible>
            {props.title ? <Alert.Heading>{props.title}</Alert.Heading> : null}
            <p className='mb-0'>{props.message}</p>
        </Alert>
    );
}
