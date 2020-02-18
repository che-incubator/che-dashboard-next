import * as React from 'react';
import {Route} from 'react-router';
import {ConnectedRouter as Router} from 'connected-react-router';

import {Layout} from './Layout';
import './app.styl';

import Dashboard from './Dashboard';
import GetStarted from './GetStarted';
import WorkspacesList from './WorkspacesList';
import Administration from './Administration';
import WorkspaceDetails from './WorkspaceDetails';


type Item = {
    to: string,
    component: React.FunctionComponent<any>,
    label?: string
};

const items: Item[] = [
    {to: '/', component: Dashboard, label: 'Dashboard'},
    {to: '/getstarted', component: GetStarted, label: 'Get Started'},
    {to: '/workspaces', component: WorkspacesList, label: 'Workspaces'},
    {to: '/administration', component: Administration, label: 'Administration'},
    {to: '/workspace/:namespace/:workspaceName', component: WorkspaceDetails},
];

export default (props: { history: any }) => (
    <Router history={props.history}>
        <Layout items={items.map(item => ({to: item.to, label: item.label}))}>
            {items.map((item: Item, index: number) => (
                <Route key={`app_route_item_${index + 1}`}
                       path={item.to}
                       exact
                       component={item.component}/>
            ))}
        </Layout>
    </Router>
);
