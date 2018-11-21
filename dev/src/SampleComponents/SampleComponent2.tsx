import * as React from "react";
import {AttachPartsOfStore} from "../../../src";
import {MyStore} from "../Stores/MyStore";
import {Typography} from "@material-ui/core/es";
import {Button} from "@material-ui/core";

interface Props {
    test: string;
}

interface StoreProps {
    clientUser: any;
    loginWithPromise: (userName: string, password: string) => Promise<any>;
}

class SampleComponent2 extends React.Component<Props & StoreProps> {

    render() {
        console.log("render SampleComponents Component");
        return (
            <div>
                <Typography variant={"body2"} style={{marginBottom: "1em"}}>
                    Current User: {this.props.clientUser.userName}
                </Typography>
                <Button
                    onClick={() => this.props.loginWithPromise("admin", "admin")}
                    color={"primary"}
                        >
                        loginWithPromise
                </Button>
            </div>
        );
    }
}

const mapStoreToProps: any  = (store: MyStore) => {
    return {
        clientUser: store.userStore.clientUser,
        loginWithPromise: store.userStore.login
    };
};

// In JS use this one, no typing problems
// export default AttachPartsOfStore(mapStoreToProps)(SampleComponent2);

/**
 * We ran into the problem, that webstorm complains the missing store attribute if SampleComponent is used in JSX
 */
export default AttachPartsOfStore<Props>(mapStoreToProps)(SampleComponent2);
