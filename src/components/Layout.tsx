import * as React from 'react';
import {NavMenu} from './NavMenu';
import {useSelector,} from 'react-redux';
import {AppState} from '../store';
import Loader from './Loader';

export const Layout = (props: { items: { to: string; label?: string }[], children?: React.ReactNode }) => {
    const {user, isLogged} = useSelector((state: AppState) => state.user);
    const workspaces = useSelector((state: AppState) => state.workspaces);

    return (
        <React.Fragment>
            {!isLogged ? (<Loader/>) : (<NavMenu user={user.user}
                                                 workspaces={workspaces}
                                                 items={props.items}
                                                 children={props.children}/>)}
        </React.Fragment>);
};
