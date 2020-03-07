import * as React from 'react';
import {connect, useSelector} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {AppState} from '../../../store';
import * as DevfilesRegistryStore from '../../../store/DevfilesRegistry';
import {
    Gallery,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from '@patternfly/react-core';

import './samples-list.styl';


// At runtime, Redux will merge together...
type DevfilesRegistryProps =
    DevfilesRegistryStore.DevfilesState // ... state we've requested from the Redux store
    & typeof DevfilesRegistryStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>
    & { columns: string[], rows: any[] }; // ... plus incoming routing parameters

export class SamplesList extends React.PureComponent<DevfilesRegistryProps> {

    constructor(props: any) {
        super(props);

    }

    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
       // this.ensureDataFetched();
    }

    public render() {
        const data = this.props.data && this.props.data[0] ?  this.props.data[0] : {};
        const registryUrl = (data as any).registryUrl || '';
        const devfiles: [] = (data as any).devfiles || [];

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
                            <div className="pf-c-card pf-m-hoverable pf-m-compact pf-m-selectable get-started-template"
                                 tabIndex={-1} key={i}>
                                <div className="pf-c-card__head">
                                    <img src={registryUrl + devfile.icon}/>
                                </div>
                                <div className="pf-c-card__header pf-c-title pf-m-md">
                                    <b>{devfile.displayName}</b>
                                </div>
                                <div className="pf-c-card__body">
                                    {devfile.description}
                                </div>
                            </div>
                        ))}
                    </Gallery>
                </PageSection>
            </React.Fragment>
        );
    }

    private ensureDataFetched() {
        // TODO It was the fastest way to organize Debouncing(rework it)
        this.props.requestDevfiles(Math.round(new Date().getTime() / 5000));
    }
}


export default connect(
    (state: AppState) => state.devfilesRegistry, // Selects which state properties are merged into the component's props
    DevfilesRegistryStore.actionCreators // Selects which action creators are merged into the component's props
)(SamplesList as any);
