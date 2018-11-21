import * as React from "react";
import {StoreConsumer} from "./Provider";

export {
    AttachStore
};

/**
 * Attaches the full store to the passed Compoment
 * TODO: Change Component type to React.ComponentClass<any, any> causes errors on getDerivedStateFromProps
 * @param Component React Component to attach
 */
function AttachStore<Props>(Component: any): (props: Props) => React.ReactElement<Props> | null {
    // Since the Components should have props that are not added via this function
    // We have to use any as generic in this sfc.
    const AttachedStore: React.SFC<Props> = (props: Props) => {
        return ( <StoreConsumer>
            {(store) => {
                return <Component {...props} store={store} />;
            }}
        </StoreConsumer>);
    };

    return AttachedStore;
}
