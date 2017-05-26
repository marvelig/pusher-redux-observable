
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
    events: string[]
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

export const PUSHER_CONNECT = '@@pusher/CONNECT'
export const PUSHER_DISCONNECT = '@@pusher/DISCONNECT'
export const PUSHER_CONNECTION_SUCCESS = '@@pusher/CONNECTION_SUCCESS'
export const PUSHER_CONNECTION_ERROR = '@@pusher/CONNECTION_ERROR'
export const PUSHER_SUBSCRIBE_CHANNEL = '@@pusher/SUBSCRIBE_CHANNEL'
export const PUSHER_UNSUBSCRIBE_CHANNEL = '@@pusher/UNSUBSCRIBE_CHANNEL'
export const PUSHER_MESSAGE_RECEIVED = '@@pusher/MESSAGE_RECEIVED'