import * as effector from 'effector';

type MaybeArray<T> = T | Array<T>;

interface SurroundField {
    name: string;
    valueInitial: string | number;
    valueValidator?: (value: string | number) => boolean;
}
interface Player {
    id: string;
    state: 'in-game' | 'won' | 'lost';
}
interface PlayerField {
}
interface ChipField<Value extends boolean | number | string = any> {
    name: string;
    valueInitial: Value;
    valueValidator?: (value: Value) => boolean;
}
interface ChipKind {
    kind: string;
    fields?: Array<ChipField>;
}
interface Chip<FieldMap extends Record<string, ChipField> = {}> {
    id: string;
    kind: ChipKind['kind'];
    x: number;
    y: number;
    fields?: FieldMap;
}
interface GameState {
    system: {};
    surround: {};
    chips: Array<Chip>;
}
interface ActionKind {
    kind: string;
    payloadValidator?: (payload: {}) => boolean;
}
interface Action {
    id: string;
    kind: ActionKind['kind'];
    payload?: {};
}
type ActionHandler = (state: GameState, action: Action) => {
    state?: GameState;
    actions?: MaybeArray<Action>;
} | null;

declare const createController: (options: {
    chipKinds: Array<ChipKind>;
    actionKinds: Array<ActionKind>;
}) => {
    state: effector.Store<GameState>;
    queue: effector.Store<Action[]>;
    queuePush: effector.Event<Action>;
    queueDispatch: effector.Event<Action>;
};

interface PluginMeta {
    name: string;
    version: string;
}
interface PluginRequirements {
    plugins?: Array<string>;
    surroundFields?: Array<SurroundField['name']>;
    chipFields?: Array<ChipField['name']>;
    chipKinds?: Array<ChipKind['kind']>;
    actionKinds?: Array<ActionKind['kind']>;
}
type PluginFactory = (pluginApi: PluginFactoryApi) => void;
interface PluginFactoryApi {
    findSurroundField: (name: string) => SurroundField | undefined;
    findChipField: (name: string) => ChipField | undefined;
    findChipKind: (name: string) => ChipKind | undefined;
    findActionKind: (name: string) => ActionKind | undefined;
    createSurroundField: (surroundField: SurroundField) => SurroundField;
    createChipField: (chipField: ChipField) => ChipField;
    createChipKind: (chipKind: ChipKind) => ChipKind;
    createActionKind: (actionKind: ActionKind) => ActionKind;
    handleAction: (actionKind: ActionKind, handler: ActionHandler) => void;
}

export { Action, ActionHandler, ActionKind, Chip, ChipField, ChipKind, GameState, Player, PlayerField, PluginFactory, PluginFactoryApi, PluginMeta, PluginRequirements, SurroundField, createController };
