import {Store, StoreConsumer} from "../index";
import * as React from "react";

export type AttachParts = (store: Store | null) => any;

/**
 * Attaches parts of the store to the Component via a mapStoreToProps function. Should return at least an empty
 * Object
 * TODO: Change Component type to React.ComponentClass<any, any> causes errors on getDerivedStateFromProps
 * @param attachParts MapStoreToPros function
 */
function AttachPartsOfStore<Props>(attachParts: AttachParts) {

    return (Component: any): (props: Props) => React.ReactElement<Props> | null => {
        // Since the Components should have props that are not added via this function
        // We have to use any as generic in this sfc.
        const AttachedStore: React.SFC<Props> = (props: any) => {
            return (<StoreConsumer>
                {(store: Store) => {
                    const attachedParts = attachParts(store);
                    return <Component {...props} {...attachedParts}  store={store}/>;
                }}
            </StoreConsumer>);
        };

        return AttachedStore;
    };
}

export {
    AttachPartsOfStore
};
