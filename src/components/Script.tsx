import * as React from "react";

interface IProps {
    src: string;
    onLoad?: () => void;
    onError?: (error: any) => void;
}

export class Script extends React.Component<IProps, any> {
    private instance: any;

    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
        const parent = this.instance.parentElement;
        if (this.instance) {
            this.instance.remove();
        }
        if (parent && this.props.src) {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = this.props.src;
            s.addEventListener('load', () => {
                if (this.props.onLoad) {
                    this.props.onLoad();
                }
            });
            s.addEventListener('error', error => {
                console.log('error: ', error);
                if (this.props.onError) {
                    this.props.onError(error);
                }
            });
            s.addEventListener('abort', () => {
                const error = 'Script loading aborted.'
                console.log('error: ', error);
                if (this.props.onError) {
                    this.props.onError(error);
                }
            });
            parent.appendChild(s);
        }
    }

    render() {
        return <script ref={el => (this.instance = el)}/>;
    }
}
