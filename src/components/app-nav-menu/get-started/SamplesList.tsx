import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import * as DevfilesRegistryStore from '../../../store/DevfilesRegistry';
import * as WorkspacesStore from '../../../store/Workspaces';
import CheProgress from '../../app-common/progress/progress';
import {Gallery, PageSection, PageSectionVariants, Text, TextContent} from '@patternfly/react-core';

import './samples-list.styl';


// At runtime, Redux will merge together...
type DevfilesRegistryProps =
    {
        devfilesRegistry: DevfilesRegistryStore.DevfilesState,
        workspaces: WorkspacesStore.WorkspacesState
    }// ... state we've requested from the Redux store
    & WorkspacesStore.IActionCreators // ... plus action creators we've requested
    & { history: any };

export class SamplesList extends React.PureComponent<DevfilesRegistryProps> {

    public render() {
        const {data} = this.props.devfilesRegistry;

        const createWorkspace = (registryUrl: string, devfile: che.IDevfileMetaData) => {
            if (!devfile.links || !devfile.links.self) {
                return;
            }
            const devfileUrl = registryUrl + devfile.links.self;
            const attr = {stackName: devfile.displayName};
            this.props.createWorkspace(devfileUrl, attr).then((workspace: che.IWorkspace) => {
                // force start for the new workspace
                this.props.startWorkspace(`${workspace.id}`).then(() => {
                    this.props.history.push(`/ide/${workspace.namespace}/${workspace.devfile.metadata.name}`);
                });
            });
        };

        return (
            <React.Fragment>
                <PageSection variant={PageSectionVariants.light}>
                    <TextContent>
                        <Text component='h1'>Select a Sample</Text>
                        <Text component='p'>
                            Select a sample to create your first workspace.<br/>
                        </Text>
                    </TextContent>
                </PageSection>
                <CheProgress isLoading={this.props.workspaces.isLoading}/>
                <PageSection>
                    <Gallery gutter='md'>
                        {data.map((data: { devfiles: che.IDevfileMetaData[], registryUrl: string }, index: number) => (
                            data.devfiles.map((devfile: che.IDevfileMetaData, key: number) => (
                                <div
                                    className='pf-c-card pf-m-hoverable pf-m-compact get-started-template'
                                    key={`${index}_${key}`}
                                    onClick={() => createWorkspace(data.registryUrl, devfile)}>
                                    <div className='pf-c-card__head'>
                                        <img src={`${data.registryUrl}${devfile.icon}`}/>
                                    </div>
                                    <div className='pf-c-card__header pf-c-title pf-m-md'>
                                        <b>{devfile.displayName}</b>
                                    </div>
                                    <div className='pf-c-card__body'>
                                        {devfile.description}
                                    </div>
                                </div>
                            ))
                        ))}
                    </Gallery>
                </PageSection>
            </React.Fragment>
        );
    }
}

export default connect(
    (state: AppState) => {
        const {devfilesRegistry, workspaces} = state;
        return {devfilesRegistry, workspaces};
    }, // Selects which state properties are merged into the component's props(devfilesRegistry and workspaces)
    WorkspacesStore.actionCreators // Selects which action creators are merged into the component's props

)(SamplesList);
