import * as React from 'react';
import {Route} from 'react-router';
import {ConnectedRouter as Router} from 'connected-react-router';
import Layout from './Layout';
import Dashboard from './Dashboard';
import GetStarted from './GetStarted';
import WorkspacesList from './WorkspacesList';
import Administration from './Administration';
import WorkspaceDetails from './WorkspaceDetails';
import {useSelector} from 'react-redux';
import {AppState} from '../store';
import Loader from './Loader';

import './app.styl';


type Item = {
    to: string,
    component: React.FunctionComponent<any>,
    label?: string,
    ico?: string
};

const items: Item[] = [
    {to: '/', component: Dashboard, label: 'Dashboard', ico: 'chefont cheico-dashboard'},
    {to: '/getstarted', component: GetStarted, label: 'Get Started', ico: 'fa fa-plus'},
    {to: '/workspaces', component: WorkspacesList, label: 'Workspaces', ico: 'chefont cheico-workspace material-icons'},
    {to: '/administration', component: Administration, label: 'Administration', ico: 'material-design icon-ic_settings_24px material-icons'},
    {to: '/workspace/:namespace/:workspaceName', component: WorkspaceDetails},
];

export default (props: { history: any }) => {
    const {isLogged} = useSelector((state: AppState) => state.user);

    if (!isLogged) {
        return <Loader/>;
    }

    return (<Router history={props.history}>
        <Layout items={items.map(item => ({to: item.to, label: item.label, ico: item.ico}))}>
            {items.map((item: Item, index: number) => (
                <Route key={`app_route_${index + 1}`} path={item.to} exact={item.to === '/'}
                       component={item.component}/>
            ))}
        </Layout>
    </Router>);
};
