import {Store as ImportStore, PartialStore as ImportPartialStore} from "./Store/Store";
import {AttachStore} from "./Provider/AttachStore";
import {AttachPartsOfStore} from "./Provider/AttachPartsOfStore";

import {
    StoreProvider,
    StoreConsumer,
} from "./Provider/Provider";

export {
    StoreProvider,
    StoreConsumer,
    AttachStore,
    AttachPartsOfStore
};

// Because of bug in Babel...
export type Store = ImportStore;
export type PartialStore = ImportPartialStore;