import {PartialStore} from "../../../src";

export interface UserStore extends PartialStore {
    test: string;
    login: (userName: string, password: string) => Partial<UserStore>;
    clientUser?: object;
}


const login: (userName: string, password: string) => Partial<UserStore> = (userName: string, password: string) => {
    return {
        clientUser: {
            userName: "Admin"
        }
    };
};

const userStore: UserStore = {
    setState: () => console.log("setState"),
    login: login,
    test: "InitialValue",
    clientUser: {
        userName: "Not logged in"
    }
};

export {
    userStore
};
