import * as React from "react";
import * as _ from "lodash";
import {PartialStore, Store} from "..";
import {PartialStoreClass} from "../Store/Store";

const storeContext = React.createContext({

});

const InternalStoreProvider = storeContext.Provider;
const StoreConsumer = storeContext.Consumer;

interface Props {
    value: Store;
}

interface State {
    store: Store;
    /**
     * Problem here: Chaning partial stores in the react context does not trigger rerender on componenents,
     * although they receive the new props. So increment an internal version for each state update
     */
    // __internalVersion: number;
}

class StoreProvider extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        const store = props.value;

        _.forEach(_.keys(store), (key: string) => {
            const partialStore = store[key];
            partialStore.setState = this.setInternalState.bind(this, key);

            /**
             * Here we have to consider both cases, the store as a class implementation or as a simple object
             * since the iterating over functions is different
             */
            if (partialStore instanceof PartialStoreClass) {

                const props = Object.getOwnPropertyNames(partialStore.constructor.prototype);
                /**
                 * Re-Bind all external functions to update local state
                 * Notice: setState is from PartialStoreClass and consequently not included here
                 */
                _.forEach(props, (partialKey: string) => {

                    // Ignore constructors, since they are included in the getOwnPropertyNames
                    if (partialKey !== "constructor" &&  partialStore.constructor.prototype[partialKey] instanceof Function) {
                        partialStore.constructor.prototype[partialKey] = this.mapExternalFunctionToStore.bind(this, key, partialStore.constructor.prototype[partialKey]);
                    }
                });
            }
            else {
                /**
                 * Re-Bind all external functions to update local state
                 */
                _.forEach(_.keys(partialStore), (partialKey: string) => {
                    // Since setState is already binded above, ignore it here
                    if (partialKey !== "setState" &&  partialStore[partialKey] instanceof Function) {
                        partialStore[partialKey] = this.mapExternalFunctionToStore.bind(this, key, partialStore[partialKey]);
                    }
                });
            }
        });

        this.state = {
            store: props.value
        };
    }

    /**
     * This one is pretty awesome. We execute the original function of the partial store, get the result and
     * throw it into setInternalState to trigger state update. With this approach, it's easy to implement custom functions
     * that do stuff and update the global store
     * @param storeName Object key of the partial store
     * @param func Origin function
     * @param args Arguments passed to the origin function
     */
    mapExternalFunctionToStore(storeName: string, func: Function, ...args: any[]) {

        /**
         * This is a bit hacky. For each call, this has to be applied for the function,
         * since we can not distinguish between object and class implementation of stores
         * at this point. But should be fine...
         */
        const partialStoreResult = func.apply(this.state.store[storeName], args);

        /**
         * Only update internal state if an object was returned, since in promise custom functions
         * the state has to be updated manually
         */
        if (!(partialStoreResult instanceof Promise))
            this.setInternalState(storeName, partialStoreResult);

        return partialStoreResult;

    }

    /**
     * Update the content of the partial store matching the given storeName and setState of this component
     * @param storeName Object key of the partial store
     * @param newValues New values of the partial store
     * @param callback Callback after setState of react
     */
    setInternalState(storeName: string, newValues: Partial<PartialStore>, callback?: () => void) {
        const newStore = this.state.store[storeName];
        const store = {...this.state.store}; // Make a new object out of this

        _.forEach(_.keys(newValues), (key: string) => {
            newStore[key] = newValues[key];
        });

        store[storeName] = newStore;
        this.setState({
            store,
        }, callback);
    }

    render() {
        return (
            <InternalStoreProvider value={{ ...this.state.store}}>
                {this.props.children}
            </InternalStoreProvider>
        );
    }
}

export {
    StoreProvider,
    StoreConsumer
};
