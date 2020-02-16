import * as React from 'react';

export class App extends React.Component<{ workspaces: Array<che.IWorkspace> }, any> {
    render() {
        return <div><h1>API test</h1><p>CHE workspaces:</p>
            {this.props.workspaces.map(workspace => {
                return <p key={workspace.id}>
                    <span><b>{workspace.devfile.metadata.name}</b>&nbsp;{workspace.devfile.metadata.name}</span>
                </p>
            })}
        </div>;
    }
}
