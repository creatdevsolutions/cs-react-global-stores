import * as React from "react";
import {MyStore} from "../Stores/MyStore";
import {AttachStore} from "../../../src";
import {Button} from "@material-ui/core";
import {Typography} from "@material-ui/core/es";

interface Props {

}

interface AttachedProps {
    store: MyStore;
}

class SampleComponent extends React.Component<AttachedProps & Props> {

    render() {
        return (
            <div>
                <Typography variant={"body2"} style={{marginBottom: "1em"}}>
                    Current UserName: {this.props.store.userStore.clientUser.userName}
                </Typography>
                  <Button
                    onClick={() => this.props.store.userStore.login("user", "user")}
                    color={"primary"}
                  >
                    login
                  </Button>
            </div>
        );
    }
}

// In JS use this one, no typing problems
// export default AttachStore<Props>(SampleComponent);

/**
 * We ran into the problem, that webstorm complains the missing store attribute if SampleComponent is used in JSX
 */
export default AttachStore<Props>(SampleComponent);
