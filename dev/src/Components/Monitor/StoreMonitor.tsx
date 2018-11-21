import * as React from "react";
import {Card, CardContent, Typography} from "@material-ui/core/es";
import {CardHeader} from "@material-ui/core/es";
// @ts-ignore
import style from "./StoreMonitor.css";
import {MyStore} from "../../Stores/MyStore";
import {AttachStore} from "../../../../src";

interface Props {
    title: string;
}

interface StoreProps {
    store: MyStore;
}

interface State {
    renderCount: number;
}

class StoreMonitor extends React.Component<Props & StoreProps, State> {

    constructor(props: Props & StoreProps) {
        super(props);

        this.state = {
            renderCount: 0
        };
    }

    static getDerivedStateFromProps(nextProps: Props & StoreProps, prevState: State) {
        return {
            renderCount: prevState.renderCount + 1
        };
    }

    render() {

        return (
            <Card>
                <CardHeader title={this.props.title}/>
                <CardContent className={style.StoreMonitorTable}>
                    <div className={style.StoreMonitorTableRow}>
                        <Typography variant={"body2"}>
                            Count renders:
                        </Typography>
                        <Typography variant={"body2"}>
                            {this.state.renderCount}
                        </Typography>
                    </div>
                    {this.props.children}
                </CardContent>
            </Card>
        );
    }
}

export default AttachStore<Props>(StoreMonitor);
