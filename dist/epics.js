"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pusher = require("pusher-js");
var rxjs_1 = require("rxjs");
var redux_observable_1 = require("redux-observable");
var utils_1 = require("./utils");
var actions_1 = require("./actions");
/**
 * An epic to create a connection to Pusher
 *
 * @param action$
 * @param store
 */
exports.connectToPusher = function (action$, store) {
    return action$.ofType(actions_1.PUSHER_CONNECT)
        .mergeMap(function (action) { return rxjs_1.Observable.create(function (observer) {
        exports.pusherClient = new Pusher(action.key, action.options);
        exports.pusherClient.connection.bind('connected', function (result) {
            observer.next({ type: actions_1.PUSHER_CONNECTION_SUCCESS, result: result });
        });
        exports.pusherClient.connection.bind('error', function (error) {
            observer.next({ type: actions_1.PUSHER_CONNECTION_ERROR, error: error });
        });
    }); });
};
/**
 * An epic to disconnect from Pusher
 *
 * @param action$
 * @param store
 */
exports.disconnectFromPusher = function (action$, store) {
    return action$.ofType(actions_1.PUSHER_DISCONNECT)
        .mergeMap(function (action) { return rxjs_1.Observable.create(function (observer) {
        exports.pusherClient.disconnect();
    }); });
};
/**
 * An epic to subscribe to a channel
 *
 * @param action$
 * @param store
 */
exports.subscribeToChannel = function (action$, store) {
    return action$.ofType(actions_1.PUSHER_SUBSCRIBE_CHANNEL)
        .mergeMap(function (action) { return rxjs_1.Observable.create(function (observer) {
        var channel = exports.pusherClient.subscribe(utils_1.formatChannelName(action.channel));
        action.events.forEach(function (e) {
            channel.bind(e, function (message) {
                observer.next({ type: actions_1.PUSHER_MESSAGE_RECEIVED, message: message, channel: action.channel });
            });
        });
    }); });
};
/**
 * An epic to unsubscribe from a channel
 *
 * @param action$
 * @param store
 */
exports.unsubscribeFromChannel = function (action$, store) {
    return action$.ofType(actions_1.PUSHER_UNSUBSCRIBE_CHANNEL)
        .mergeMap(function (action) { return rxjs_1.Observable.create(function (observer) {
        var channel = exports.pusherClient.channels.channels[action.channel];
        if (channel)
            channel.unsubscribe();
    }); });
};
/**
 * Combine all the epics into a single pusher epic
 */
exports.pusherEpic = redux_observable_1.combineEpics(exports.connectToPusher, exports.disconnectFromPusher, exports.subscribeToChannel, exports.unsubscribeFromChannel);
//# sourceMappingURL=epics.js.map