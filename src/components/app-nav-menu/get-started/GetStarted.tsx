import * as React from 'react';
import {connect} from 'react-redux';
import {
    Card,
    CardBody,
    Gallery,
    GalleryItem,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";

const GetStarted = () => (
    <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
            <TextContent>
                <Text component='h1'>Main title</Text>
                <Text component='p'>
                    Body text should be Overpass Regular at 16px. It should have
                    leading of 24px because <br/>
                    of it’s relative line height of 1.5.
                </Text>
            </TextContent>
        </PageSection>
        <PageSection>
            <Gallery gutter='md'>
                {Array.apply(0, Array(10)).map((x, i) => (
                    <GalleryItem key={i}>
                        <Card>
                            <CardBody>This is a card</CardBody>
                        </Card>
                    </GalleryItem>
                ))}
            </Gallery>
        </PageSection>
    </React.Fragment>
);

export default connect()(GetStarted);
