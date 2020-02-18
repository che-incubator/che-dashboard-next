import * as React from 'react';
import { connect } from 'react-redux';
import {RouteComponentProps} from "react-router";
import {Gallery, PageSection, Text, TextContent} from "@patternfly/react-core";

const WorkspaceDetails = (props: RouteComponentProps<{ namespace: string, workspaceName: string }>) => (
    <React.Fragment>
        <PageSection>
            <TextContent>
                <Text component='h1'>WorkspaceDetails title</Text>
            </TextContent>
        </PageSection>
        <PageSection>
            <Gallery gutter='md'>
                <p>Workspace Namespace: <b>{props.match.params.namespace}</b></p>
                <p>Workspace Name: <b>{props.match.params.workspaceName}</b></p>
            </Gallery>
        </PageSection>
    </React.Fragment>
);

export default connect()(WorkspaceDetails);
