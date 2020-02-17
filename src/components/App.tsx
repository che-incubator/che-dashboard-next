import * as React from 'react';
import {useSelector} from 'react-redux';

function App() {
    const workspaces = useSelector((state: { workspaces: che.IWorkspace[]}) => state.workspaces);

    return <div><h1>API test</h1><p>CHE workspaces:</p>
        {workspaces.map(workspace => {
            return <p key={workspace.id}>
                <span><b>{workspace.devfile.metadata.name}</b>&nbsp;{workspace.devfile.metadata.name}</span>
            </p>
        })}
    </div>;
}

export default App;
