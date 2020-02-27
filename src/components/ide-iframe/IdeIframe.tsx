import * as React from 'react';
import {connect, useSelector} from 'react-redux';
import {RouteComponentProps} from 'react-router';

const IdeIframe = (props: RouteComponentProps<{ namespace: string, workspaceName: string }>) => {
    const randVal = Math.floor((Math.random() * 1000000) + 1);
    const {namespace, workspaceName} = props.match.params;
    const user = useSelector((state: { user: { user: { user: che.IUser }}}) => state.user);
    const targetLink = user.user.user.links.find(link => link.rel === 'self');
    const host = targetLink ? new URL(targetLink.href).origin : '';

    return (
        <React.Fragment>
            <iframe className='ide-page-frame'
                    src={`${host}/workspace-loader/${namespace}/${workspaceName}?uid=${randVal}`}/>
        </React.Fragment>)
};

export default connect()(IdeIframe);
