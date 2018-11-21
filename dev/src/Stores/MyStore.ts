import {Store} from "../../../src";
import {UserStoreClass} from "./UserStoreClass";

export interface MyStore extends Store {
    userStore: UserStoreClass;
}

const myStore: MyStore = {
    userStore: new UserStoreClass()
};

export default myStore;
