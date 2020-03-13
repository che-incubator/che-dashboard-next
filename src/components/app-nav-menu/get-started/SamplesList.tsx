import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import * as DevfilesRegistryStore from '../../../store/DevfilesRegistry';
import * as WorkspacesStore from '../../../store/Workspaces';
import {Gallery, PageSection, PageSectionVariants, Text, TextContent} from '@patternfly/react-core';

import './samples-list.styl';


// At runtime, Redux will merge together...
type DevfilesRegistryProps =
    { devfilesRegistry: DevfilesRegistryStore.DevfilesState }// ... state we've requested from the Redux store
    & WorkspacesStore.IActionCreators
    & { history: any }; // ... plus action creators we've requested

export class SamplesList extends React.PureComponent<DevfilesRegistryProps> {

    public render() {
        const data = this.props.devfilesRegistry.data && this.props.devfilesRegistry.data[0] ? this.props.devfilesRegistry.data[0] : {};
        const registryUrl = (data as any).registryUrl || '';
        const devfiles: [] = (data as any).devfiles || [];

        const createWorkspace = (devfile: che.IDevfileMetaData) => {
            if (!devfile.links || !devfile.links.self) {
                return;
            }
            const devfileUrl = registryUrl + devfile.links.self;
            // TODO It was the fastest way to organize Debouncing. Rework it.
            const timeLabel = Math.round(new Date().getTime() / 5000);
            const promise = this.props.createWorkspace(devfileUrl, {stackName: devfile.displayName}, timeLabel);
            promise.then((workspace: che.IWorkspace) => {
                this.props.history.push(`/ide/${workspace.namespace}/${workspace.devfile.metadata.name}`);
            })
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
                <PageSection>
                    <Gallery gutter='md'>
                        {devfiles.map((devfile: che.IDevfileMetaData, i) => (
                            <div className='pf-c-card pf-m-hoverable pf-m-compact pf-m-selectable get-started-template'
                                 tabIndex={-1} key={i} onClick={() => createWorkspace(devfile)}>
                                <div className='pf-c-card__head'>
                                    <img src={registryUrl + devfile.icon}/>
                                </div>
                                <div className='pf-c-card__header pf-c-title pf-m-md'>
                                    <b>{devfile.displayName}</b>
                                </div>
                                <div className='pf-c-card__body'>
                                    {devfile.description}
                                </div>
                            </div>
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

)(SamplesList as any);
