import {Pusher as PusherInterface} from 'pusher-js'
import { Observable } from 'rxjs'
import { ActionsObservable } from 'redux-observable'
import { Store } from 'redux'

export const PUSHER_CONNECT: string
export const PUSHER_DISCONNECT: string
export const PUSHER_CONNECTION_SUCCESS: string
export const PUSHER_CONNECTION_ERROR: string
export const PUSHER_SUBSCRIBE_CHANNEL: string
export const PUSHER_UNSUBSCRIBE_CHANNEL: string
export const PUSHER_MESSAGE_RECEIVED: string

interface BasePusherAction {
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
    message: any
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
 * A reference to the pusher connection
 */
export let pusherClient: PusherInterface

/**
 * An epic to create a connection to Pusher
 * 
 * @param action$ 
 * @param store 
 */
export const connectToPusher: 
    (action$: ActionsObservable<PusherConnectAction>, store: Store<any>) => Observable<PusherAction>

/**
 * An epic to disconnect from Pusher
 * 
 * @param action$ 
 * @param store 
 */
export const disconnectFromPusher: 
    (action$: ActionsObservable<PusherDisconnectAction>, store: Store<any>) =>  Observable<PusherAction>

/**
 * An epic to subscribe to a channel
 * 
 * @param action$ 
 * @param store 
 */
export const subscribeToChannel: 
    (action$: ActionsObservable<PusherSubscribeChannelAction>, store: Store<any>) => Observable<PusherAction> =>

/**
 * An epic to unsubscribe from a channel
 * 
 * @param action$ 
 * @param store 
 */
export const unsubscribeFromChannel:
    (action$: ActionsObservable<PusherSubscribeChannelAction>, store: Store<any>) => Observable<PusherAction> =>

/**
 * Combine all the epics into a single pusher epic
 */
export const pusherEpic: any


