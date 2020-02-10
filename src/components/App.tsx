import * as React from "react";

interface IProps {
    workspaces: Array<{ devfile: { metadata: { name: string } }, attributes: { stackName: string } }>
}

export class App extends React.Component<IProps, any> {
    render() {
        return <div><h1>API test</h1><p>CHE workspaces:</p>
            {this.props.workspaces.map((workspace: { devfile: { metadata: { name: string } }, attributes: { stackName: string } }) => {
                return <p><span><b>{workspace.devfile.metadata.name}</b>&nbsp;{workspace.devfile.metadata.name}</span>
                </p>
            })}
        </div>;
    }
}
