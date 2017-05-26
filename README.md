# pusher-redux-observable
redux-observable epic for Pusher

This project brings Pusher, rxjs Observables, and Redux together into one single flow. At the core of this flow is the [redux-observable](https://redux-observable.js.org) package which allows you to listen and respond to streams of redux actions asynchronously using [rxjs Observables](http://reactivex.io/rxjs/manual/index.html).

###Installation

```
npm i pusher-redux-observable -D
```

All the functionality in this project has been combined into a top level 'pusherEpic' which can be added in to your redux-observable middleware:

```
import { pusherEpic } from 'pusher-redux-observable'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const rootEpic = combineEpics(pusherEpic, ...myOtherEpics)

const store = createStore(
    combineReducers(...myReducers),
    applyMiddleware(
        createEpicMiddleware(rootEpic)
    )
)
```

After you have added the pusherEpic to your middleware chain, you can then start controlling Pusher by dispatching redux actions. The only way to interact with this package is by dispatching actions - actions in, actions out.

###Create a connection

To create a new connection dispatch a `PUSHER_CONNECT` action:

```
import {PUSHER_CONNECT} from 'pusher-redux-observable'

dispatch({
    type: PUSHER_CONNECT,
    key: 'my_pusher_key'
    options: {
        cluster: 'eu'
    }
})
```

This will get picked up by the epic and a new connection will be created, which will result in a  `PUSHER_CONNECTION_SUCCESS` or `PUSHER_CONNECTION_ERROR` action being dispatched. 

To end the connection dispatch a `PUSHER_DISCONNECT` action

###Subscribe to a channel

To subscribe to a channel dispatch a `PUSHER_SUBSCRIBE_CHANNEL` action

```
import {PUSHER_SUBSCRIBE_CHANNEL} from 'pusher-redux-observable'

dispatch({
    type: PUSHER_SUBSCRIBE_CHANNEL,
    channel: 'foo'
})
```

Similarly, to unsubscribe from a channel dispatch a `PUSHER_SUBSCRIBE_CHANNEL` with the name of the channel.

###Receiving messages
When messages are received a `PUSHER_MESSAGE_RECEIVED` action will be emitted. This action has the following interface:

```
{
    type: PUSHER_MESSAGE_RECEIVED
    channel: string
    message: any
}
```

Since we are using redux-observable you may wish to write some other epics that respond to these actions and dispatch further actions.


