import * as React from 'react';

interface IProps {
    src: string;
}

export class Loader extends React.Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return <div className="main-page-loader">
            <div className="ide-page-loader-content">
                <img src={this.props.src}/>
            </div>
        </div>;
    }
}
