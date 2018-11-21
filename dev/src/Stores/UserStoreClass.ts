import {PartialStoreClass} from "../../../src/Store/Store";

export class UserStoreClass extends PartialStoreClass {

    clientUser: any = {
        userName: "Not logged in..."
    };

    login(userName: string, password: string) {
        const user: any = {
            userName,
            password
        };
        // TODO: do login here...

        // Update local state triggering the store update
        this.setState({
            clientUser: user
        });
    }

    loginWithPromise(userName: string, password: string) {
        return new Promise((resolve, reject) => {
            const user: any = {
                userName,
                password
            };
            // TODO: do login here...
            const error = false;
            if (error)
                reject(error);

            // Update local state triggering the store update
            this.setState({
                clientUser: user
            }, () => {
                resolve(user);
            });
        });
    }
}
