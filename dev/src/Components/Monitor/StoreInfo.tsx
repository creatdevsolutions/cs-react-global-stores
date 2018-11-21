import * as React from "react";
import {Typography} from "@material-ui/core/es";
import {MyStore} from "../../Stores/MyStore";
import {AttachStore} from "../../../../src";

interface Props {

}

interface StoreProps {
    store: MyStore;
}

interface State {

}

class StoreMonitor extends React.Component<Props & StoreProps, State> {

    constructor(props: Props & StoreProps) {
        super(props);

        this.state = {
            renderCount: 0
        };
    }

    render() {

        return (
            <div>
                <Typography variant={"body2"}>
                    UserStore: {JSON.stringify(this.props.store.userStore)}
                </Typography>
            </div>
        );
    }
}

export default AttachStore<Props>(StoreMonitor);
