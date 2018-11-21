export interface Store {
    [key: string]: PartialStore;
}

export interface PartialStore {
    setState: (store: Partial<PartialStore>, callback?: () => void) => void;
    [key: string]: any;
}

export abstract class PartialStoreClass {

    [key: string]: any;
    setState(store: Partial<PartialStore>, callback?: () => void) {

    }

}
