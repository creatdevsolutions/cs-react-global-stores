import * as React from "react";
import { StoreProvider} from "../../src";
import myStore from "./Stores/MyStore";
import SampleComponent2 from "./SampleComponents/SampleComponent2";
import SampleComponent from "./SampleComponents/SampleComponent";
import {Grid} from "@material-ui/core";
import StoreMonitor from "./Components/Monitor/StoreMonitor";
import StoreInfo from "./Components/Monitor/StoreInfo";


class App extends React.Component {
    render() {
        return (
            <StoreProvider value={myStore}>
                <Grid container={true} spacing={24}>
                    <Grid item xs={4}>
                        <StoreMonitor title={"SampleComponent"}>
                            <SampleComponent2 test={"test"}/>
                        </StoreMonitor>
                    </Grid>
                    <Grid item xs={4}>
                        <StoreMonitor title={"SampleComponent2"}>
                            <SampleComponent />
                        </StoreMonitor>
                    </Grid>
                    <Grid item xs={4}>
                        <StoreMonitor title={"StoreInfo"}>
                            <StoreInfo />
                        </StoreMonitor>
                    </Grid>
                </Grid>
            </StoreProvider>
        );
    }
}

export default App;

