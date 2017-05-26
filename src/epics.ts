import * as Pusher from 'pusher-js'
import { Pusher as PusherInterface } from 'pusher-js'
import { Observable } from 'rxjs'
import { combineEpics, ActionsObservable } from 'redux-observable'
import { Store } from 'redux'
import { formatChannelName } from './utils'
import {
    PUSHER_CONNECT,
    PUSHER_DISCONNECT,
    PUSHER_CONNECTION_SUCCESS,
    PUSHER_CONNECTION_ERROR,
    PUSHER_SUBSCRIBE_CHANNEL,
    PUSHER_UNSUBSCRIBE_CHANNEL,
    PUSHER_MESSAGE_RECEIVED,
    PusherAction,
    PusherConnectAction,
    PusherDisconnectAction,
    PusherSubscribeChannelAction,
} from './actions'

/**
 * A reference to the pusher connection
 */
export let pusherClient: PusherInterface

/**
 * An epic to create a connection to Pusher
 * 
 * @param action$ 
 * @param store 
 */
export const connectToPusher =
    (action$: ActionsObservable<PusherConnectAction>, store: Store<any>): Observable<PusherAction> =>
        action$.ofType(PUSHER_CONNECT)
            .mergeMap((action: PusherConnectAction) => Observable.create((observer: any) => {
                pusherClient = new Pusher(action.key, action.options)

                pusherClient.connection.bind('connected', function(result: any) {
                    observer.next({ type: PUSHER_CONNECTION_SUCCESS, result })
                });

                pusherClient.connection.bind('error', (error: any) => {
                    observer.next({ type: PUSHER_CONNECTION_ERROR, error })
                });
            }))

/**
 * An epic to disconnect from Pusher
 * 
 * @param action$ 
 * @param store 
 */
export const disconnectFromPusher =
    (action$: ActionsObservable<PusherDisconnectAction>, store: Store<any>): Observable<PusherAction> =>
        action$.ofType(PUSHER_DISCONNECT)
            .mergeMap((action: PusherDisconnectAction) => Observable.create((observer: any) => {
                pusherClient.disconnect()
            }))

/**
 * An epic to subscribe to a channel
 * 
 * @param action$ 
 * @param store 
 */
export const subscribeToChannel =
    (action$: ActionsObservable<PusherSubscribeChannelAction>, store: Store<any>): Observable<PusherAction> =>
        action$.ofType(PUSHER_SUBSCRIBE_CHANNEL)
            .mergeMap((action: PusherSubscribeChannelAction) => Observable.create((observer: any) => {
                const channel = pusherClient.subscribe(formatChannelName(action.channel))
                action.events.forEach(e => {
                    channel.bind(e, (message: any) => {
                        observer.next({ type: PUSHER_MESSAGE_RECEIVED, message, channel: action.channel })
                    })
                })
            }))

/**
 * An epic to unsubscribe from a channel
 * 
 * @param action$ 
 * @param store 
 */
export const unsubscribeFromChannel =
    (action$: ActionsObservable<PusherSubscribeChannelAction>, store: Store<any>): Observable<PusherAction> =>
        action$.ofType(PUSHER_UNSUBSCRIBE_CHANNEL)
            .mergeMap((action: PusherSubscribeChannelAction) => Observable.create((observer: any) => {
                const channel = pusherClient.channels.channels[action.channel]
                if (channel) channel.unsubscribe()
            }))

/**
 * Combine all the epics into a single pusher epic
 */
export const pusherEpic = combineEpics(
    connectToPusher,
    disconnectFromPusher,
    subscribeToChannel,
    unsubscribeFromChannel
)