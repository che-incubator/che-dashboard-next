import * as React from 'react';
import {
    Progress,
    ProgressMeasureLocation,
    ProgressSize
} from '@patternfly/react-core';

import './progress.styl';

class CheProgress extends React.PureComponent<{ isLoading: boolean }, { progressVal: number }> {
    private intervalId: number | undefined;
    private readonly onProgressInc: () => void;

    constructor(props: any) {
        super(props);

        this.state = {progressVal: 0};

        this.onProgressInc = () => {
            const progressVal = this.state.progressVal < 100 ? this.state.progressVal + 10 : 0;
            this.setState({progressVal});
        };
    }

    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.intervalId = setInterval(() => {
            if (!this.props.isLoading && this.state.progressVal === 0) {
                return;
            }
            this.onProgressInc();
        }, 100);
    }

    // This method is called when the component is removed from the document
    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    public render() {
        const {progressVal} = this.state;

        return (
            <span className='progress-line'>
                 {this.props.isLoading || this.state.progressVal !== 0 ?
                     (<Progress value={progressVal}
                                size={ProgressSize.sm}
                                measureLocation={ProgressMeasureLocation.none}/>) : ''}</span>
        );
    }

}

export default CheProgress;
