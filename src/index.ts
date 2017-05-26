import * as Pusher from 'pusher-js'
import {Pusher as PusherInterface} from 'pusher-js'
import { Observable } from 'rxjs'
import { combineEpics, ActionsObservable } from 'redux-observable'
import { Store } from 'redux'

export const PUSHER_CONNECT = '@@pusher/CONNECT'
export const PUSHER_DISCONNECT = '@@pusher/DISCONNECT'
export const PUSHER_CONNECTION_SUCCESS = '@@pusher/CONNECTION_SUCCESS'
export const PUSHER_CONNECTION_ERROR = '@@pusher/CONNECTION_ERROR'
export const PUSHER_SUBSCRIBE_CHANNEL = '@@pusher/SUBSCRIBE_CHANNEL'
export const PUSHER_UNSUBSCRIBE_CHANNEL = '@@pusher/UNSUBSCRIBE_CHANNEL'
export const PUSHER_MESSAGE_RECEIVED = '@@pusher/MESSAGE_RECEIVED'

/**
 * A reference to the pusher connection
 */
export let pusherClient: PusherInterface


export interface BasePusherAction {
    channel: string
}

/**
 * Dispatch this action to attempt to create a connection to pusher
 */
export interface PusherConnectAction {
    type: '@@pusher/CONNECT',
    key: string
    options: any
}

/**
 * Dispatch this action to end the connection
 */
export interface PusherDisconnectAction {
    type: '@@pusher/DISCONNECT',
}

/**
 * This action will be emitted when the connection is successful
 */
export interface PusherConnectionSuccessAction {
    type: '@@pusher/CONNECTION_SUCCESS',
    result: any
}

/**
 * This action will be emitted when the connection is not successful
 */
export interface PusherConnectionErrorAction {
    type: '@@pusher/CONNECTION_ERROR',
    error: any
}

/**
 * Dispatch this action to subscribe to a channel
 */
export interface PusherSubscribeChannelAction extends BasePusherAction {
    type: '@@pusher/SUBSCRIBE_CHANNEL'
}

/**
 * Dispatch this action to unsubscribe from a channel
 */
export interface PusherUnubscribeChannelAction extends BasePusherAction {
    type: '@@pusher/UNSUBSCRIBE_CHANNEL'
}

/**
 * This action will be emitted when a message is received
 */
export interface PusherMessageReceivedAction extends BasePusherAction {
    type: '@@pusher/MESSAGE_RECEIVED'
}

/**
 * A union type which represents all or any of the above actions
 * This is very useful if you have a Pusher reducer which handles
 * all the pusher actions in one place
 */
export type PusherAction = 
    PusherConnectAction |
    PusherDisconnectAction |
    PusherConnectionSuccessAction |
    PusherConnectionErrorAction |
    PusherSubscribeChannelAction | 
    PusherUnubscribeChannelAction | 
    PusherMessageReceivedAction

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
                    observer.next({type: PUSHER_CONNECTION_SUCCESS, result})
                });

                pusherClient.connection.bind('error', (error: any) => {
                    observer.next({type: PUSHER_CONNECTION_ERROR, error})
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
        action$.ofType(PUSHER_SUBSCRIBE_CHANNEL)
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
                const channel = pusherClient.subscribe(action.channel)
                channel.bind_all((message: any) => {
                    observer.next({type: PUSHER_MESSAGE_RECEIVED, message, channel: action.channel})
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
        action$.ofType(PUSHER_SUBSCRIBE_CHANNEL)
            .mergeMap((action: PusherSubscribeChannelAction) => Observable.create((observer: any) => {
                const channel = pusherClient.subscribe(action.channel)
                channel.bind_all((e: any) => {
                    observer.next({type: PUSHER_MESSAGE_RECEIVED, message: e, channel: action.channel})
                })
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