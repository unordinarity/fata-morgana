import { createStore, createEvent, sample } from 'effector';

// region game instance
const createController = (options) => {
    const state = createStore({
        system: {},
        surround: {},
        chips: [],
    });
    const queue = createStore([]);
    const queuePush = createEvent();
    const queueUnstash = createEvent();
    const queueDispatch = createEvent();
    const queueDispatchSingle = createEvent();
    sample({
        clock: queueDispatch,
        source: queue,
        filter: (queue, dispatch) => queue.length > 0,
        fn: (queue, dispatch) => queue[0],
        target: queueDispatchSingle,
    });
    sample({
        clock: queueDispatchSingle,
        source: queue,
        filter: (queue, dispatch) => queue.length > 0,
        fn: (queue, dispatch) => queue[0],
        target: queueDispatchSingle,
    });
    sample({
        clock: queueDispatchSingle,
        target: queueUnstash,
    });
    state.on(queueDispatchSingle, state => { });
    return {
        state,
        queue,
        queuePush,
        queueDispatch,
    };
};
// endregion game instance

export { createController };
