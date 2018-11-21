# Global-Stores - A lightweight, dynamic React Context 

## Introduction
With this library, we want to provide a lightweigt, dynamic global store using the react context api. The idea is to combine partial stores into one global store and pass the global store (or only parts of it) down to react components using decorators. 

## Store definition
Start with the definition of your partial stores. A partial store should store any variables that belong to the same topic. Partial Stores can be implemented via js objects or in the more common way via es6 classes.

### Implementing Stores via js objects
Partially stores are defined as interfaces for the types and a js object defining the default value. These partial stores have to extend the interface PartialStore. Additionally, you have to create a default value for this store.

```jsx 
interface UserStore extends PartialStore {
    userName: string;
}

const userStore: UserStore = {
    userName: "InitialValue",        
};
```

After defining all your partial stores, create one global store interface, which has all partial stores as members. This interface has to be exported to use it for the attached components, see later.

```jsx
export interface MyStore extends Store {
    userStore: UserStore;
}

const store: MyStore = {
    userStore: userStore
};
```


### Implementing Stores via es6 classes
To improve the code qualitiy and the implementation of stores, we provide the possibility to implement a partial store via es6 classes. To do so, just extend the abstract class PartialStoreClass.

```jsx
export class UserStore extends PartialStoreClass {
    userName?: string;
}
```

To fill up your global store with a es6 class partial store, just call the constructor of your class to create a new instance of your partial store.

```jsx
export interface MyStore extends Store {
    userStore: UserStore;
}

const store: MyStore = {
    userStore: new UserStore()
};
```

## Providing the Store

If you finished defining all your partial stores and your global store, simply put it into the StoreProvider component.

```jsx
class MyComponent extends React.Component {
    render() {
        return (
            <StoreProvider value={store}>
                <SampleComponent/>
                <SampleComponent2/>
            </StoreProvider>
        );
    }
}

``` 

## Attach Components to Store
We provide 2 ways to attach the global store to react components. You can fully attach the global store to your component and it will receive the whole store object as prop or you can partially attach it to your component and device manually which parts of the store you want to have (analogue to react redux).

Important is the generic argument to our decorators. You have to pass the type of the props that your Component should receive in the tree (not injected by the global store). Consequently, we divided the Props of our Components into the Props that it gets from outside (Props) and the injected store props (StoreProps).

### Fully Attached Components
To fully attach a component to your global store, simply decorate it with the AttachStore decorator.

```jsx
import * as React from "react";
import {MyStore} from "./StoreTest";
import {AttachStore} from "..";

interface Props {
  test: string; // Obviously, any other properties are supported
}

interface StoreProps {
      store: MyStore;
}

class SampleComponent extends React.Component<Props & StoreProps> {

    render() {
        return (
          <p>
            {this.props.store.userStore.userName}
          </p>
        );
    }
}

// Calling the AttachStore decorator and your component will receive the
// global store
//
// By using the generic argument, only the prop test has to be passed
// to SampleComponent
export default AttachStore<Props>(SampleComponent);
```

### Partially Attached Components
If you want to have only parts of your global store available in your component, you can decorate it with the AttachPartsOfStore decorator and pass a function into it, which maps the store down to your props. This is quite similar to react redux, but is easier to use with typescript.

```jsx
import * as React from "react";
import {PartialStore} from "..";
import {MyStore} from "./StoreTest";
import {AttachPartsOfStore} from "../Provider/Provider";

interface Props {

}

interface StoreProps {
  userName: string;
}

class SampleComponent2 extends React.Component<Props & StoreProps> {

  render() {
        return (
          <button>
            {this.props.userName}
          </button>
        );
    }
}

// In this case, only the username is required
const mapStoreToProps: any  = (store: MyStore) => {
  return {
    userName: store.userStore.userName
  };
};

export default AttachPartsOfStore<Props>(mapStoreToProps)(SampleComponent2);

```

## Update Global Store
Updating can also be done in 2 ways, regarding the attachment of your components. You can either call "setState" on a partial store in a fully attached component, or map the setState function to a prop in a partially attached component.

### Fully Attached Components
Since each PartialStore provides a setState Method, you can simply call it on the partial store and it will trigger the state update in the global store.

```jsx
import * as React from "react";
import {MyStore} from "./StoreTest";
import {AttachStore} from "..";

interface Props {
  test: string; // Obviously, any other properties are supported
}

interface StoreProps {
      store: MyStore;
}

class SampleComponent extends React.Component<Props & StoreProps> {

    render() {
        return (
          <button
            onClick={() =>
                this.props.store.userStore.setState({userName: "NewUser"})}
          >
            {this.props.store.userStore.userName}
          </button>
        );
    }
}

export default AttachStore<Props>(SampleComponent);
```

### Partially Attached Components
The second way is to map the setState function of a store to a new prop, which is beneficial if not the whole partial store is required in a component. We recomment highly to use the following type for mapped setState function: "(store: Partial<PartialStore>) => void;", since other types may result in typescript errors

```jsx
import * as React from "react";
import {PartialStore} from "..";
import {MyStore} from "./StoreTest";
import {AttachPartsOfStore} from "../Provider/Provider";


interface Props {

}

interface StoreProps {
  userName: string;
  setUserStoreState: (store: Partial<PartialStore>) => void;
}

class SampleComponent2 extends React.Component<Props & StoreProps> {

  render() {
      console.log("render Sample Component");
        return (
          <button
            onClick={() =>
                this.props.setUserStoreState({userName: "NewUser"})}
          >
            {this.props.userName}
          </button>
        );
    }
}

const mapStoreToProps: any  = (store: MyStore) => {
  return {
    userName: store.userStore.test,
    setUserStoreState: store.userStore.setState
  };
};

export default AttachPartsOfStore<Props>(mapStoreToProps)(SampleComponent2);

```


## Custom Functions in Partial Stores
We define two signatures for custom store functions. You can either have a function that returns parts of your partial store that will be merged into it or return a promise and change the store internally. For the second approach, implementation via es6 classes is required.

### Update store via return value
We allow you to define custom functions on your partial stores to combine complex logic with store updates. The return value of the function will be merged into the partial store after the function is executed. This should be our alternative solution to actions and reducers of redux. 

The signature for a custom function that updates the store with the return value looks like this:
```jsx
func: (any) => Partial<PartialStore> // Insert your partial store type here
``` 

Example:
```jsx
export interface UserStore extends PartialStore {
    login: (userName: string, password: string) => Partial<UserStore>;
    clientUser?: object;
}


const login: (userName: string, password: string) => Partial<UserStore> = (userName: string, password: string) =>  {
    
    // Do login here...                                    
   return {
        clientUser: {
             userName,
             password
        }
    };
};

const userStore: UserStore = {
    login: login,
};
```

### Update store via setState
Partial stores implemented via es6 classes can change the state in custom functions simply calling this.setState. This is analogue to calling dispatch in redux, but we do not support changing the state of another partial store. 

In the following example, we implemented a login method that returns a promise and internally updates the userStore and also waits until the update is finished before resolving:

```jsx

export class UserStore extends PartialStoreClass {
    clientUser?: UserType;

    login(user: IUser, password: string): Promise<UserType> {

        return new Promise ((resolve, reject) => {
            service.login(user, password)
                .then((result: any) => {
                    
                    logger.info("User logged in");
                    this.setState({
                       clientUser: result.user
                    },
                    // Passing a callback as second parameter to setState
                    // To wait until state update finished
                    () => {
                        resolve(clientUser)
                    });
                })
                .catch((error: any[]) => {
                    logger.warn('User session closed.', error);
                    reject(error);
            });
        });
    }
}
```