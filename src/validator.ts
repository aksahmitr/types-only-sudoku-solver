import {
    AllInRange,
    Unique,
    Grid9x9,
    Row,
    Transpose,
    Add,
    Multiply,
    NumericKeys,
    Equal,
    RangeUnion,
} from "utils";

export type Filter<A extends unknown[], B extends unknown> = A extends [
    infer S,
    ...infer T,
]
    ? Equal<S, B> extends true
        ? [...Filter<T, B>]
        : [S, ...Filter<T, B>]
    : [];

export type ValidRow<A extends Row> =
    AllInRange<A, 0, 9> extends true
        ? Unique<Filter<A, 0>> extends true
            ? true
            : false
        : false;

export type AllValidRows<A extends Grid9x9> = {
    [K in NumericKeys<A>]: ValidRow<A[K]> extends true ? never : false;
}[NumericKeys<A>] extends never
    ? true
    : false;

export type AllValidColumns<A extends Grid9x9> = AllValidRows<Transpose<A>>;

export type Box<
    A extends Grid9x9,
    X extends number,
    Y extends number,
    T extends any[] = [],
    S extends any[] = [],
> = T["length"] extends 3
    ? []
    : S["length"] extends 3
      ? Box<A, X, Y, [...T, any], []>
      : [
            A[number & Add<Y, T["length"]>][number & Add<X, S["length"]>],
            ...Box<A, X, Y, T, [...S, any]>,
        ];

export type Boxes<
    A extends Grid9x9,
    T extends any[] = [],
    S extends any[] = [],
> = T["length"] extends 3
    ? []
    : S["length"] extends 3
      ? Boxes<A, [...T, any], []>
      : [
            Box<
                A,
                number & Multiply<3, T["length"]>,
                number & Multiply<3, S["length"]>
            >,
            ...Boxes<A, T, [...S, any]>,
        ];

export type AllValidBoxes<A extends Grid9x9> = AllValidRows<Boxes<A>>;

export type ValidSudoku<A extends Grid9x9> =
    AllValidRows<A> extends true
        ? AllValidColumns<A> extends true
            ? AllValidBoxes<A>
            : false
        : false;

export type CompleteSudoku<A extends Grid9x9> = {
    [X in RangeUnion<9>]: {
        [Y in RangeUnion<9>]: A[X][Y] extends 0 ? false : never;
    }[RangeUnion<9>];
}[RangeUnion<9>] extends never
    ? true
    : false;
