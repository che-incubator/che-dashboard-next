import * as React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../store';
import {NavMenu} from './NavMenu';

export default (props: { items: { to: string; label?: string }[], children?: React.ReactNode }) => {
    const state = useSelector((state: AppState) => state);
    // TODO state.user.user.user => state.user.user
    return (
        <React.Fragment>
            <NavMenu user={state.user.user.user}
                     logoURL={state.branding.branding.logoURL}
                     workspaces={state.workspaces.workspaces}
                     creationLink={state.branding.branding.workspace.creationLink}
                     items={props.items}
                     children={props.children}/>
        </React.Fragment>);
};
