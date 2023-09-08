type JsonFlatObject = Record<string, string | number | boolean | null>;
type MaybeArray<T> = T | Array<T>;

declare namespace FataMorgana {
    type System = {
        currentPlayer: number;
        finished: boolean;
    } & JsonFlatObject;
    type Surround = {} & JsonFlatObject;
    type Player = {
        isPlaying: boolean;
    } & JsonFlatObject;
    type Chip = {
        id: string;
        kind: string;
        x: number;
        y: number;
    } & JsonFlatObject;
    type State = {
        system: System;
        surround: Surround;
        playerList: Array<Player>;
        chipList: Array<Chip>;
    };
    type Action = {
        kind: string;
    } & JsonFlatObject;
    type Hook = {
        actions?: MaybeArray<string>;
        handler: (args: {
            action: Action;
            state: State;
        }) => {
            actions?: MaybeArray<Action>;
            state: State;
        } | null | Error;
    };
}

export { FataMorgana };
