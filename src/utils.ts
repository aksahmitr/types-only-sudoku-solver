export type Greater<
    A extends number,
    B extends number,
    N extends any[] = [],
> = N["length"] extends A
    ? false
    : N["length"] extends B
      ? true
      : Greater<A, B, [...N, any]>;

export type Lesser<A extends number, B extends number> = Greater<B, A>;

export type InRange<
    A extends number,
    L extends number,
    R extends number,
> = A extends L
    ? true
    : A extends R
      ? true
      : Greater<A, L> extends true
        ? Lesser<A, R> extends true
            ? true
            : false
        : false;

export type NumericKeys<A extends unknown[]> = Extract<keyof A, `${number}`>;

export type AllInRange<
    A extends number[],
    L extends number,
    R extends number,
> = {
    [K in NumericKeys<A>]: InRange<A[K] & number, L, R> extends true
        ? never
        : false;
}[NumericKeys<A>] extends never
    ? true
    : false;

export type Tuple<
    N extends number,
    T = unknown,
    S extends T[] = [],
> = S["length"] extends N ? S : Tuple<N, T, [...S, T]>;

export type RangeUnion<
    N extends number,
    T extends any[] = [],
> = T["length"] extends N ? never : T["length"] | RangeUnion<N, [...T, any]>;

export type Grid<N extends number, T = unknown> = Tuple<N, Tuple<N, T>>;

export type Add<A extends number, B extends number> = [
    ...Tuple<A>,
    ...Tuple<B>,
]["length"];

export type Sum<A extends number[]> = A extends [
    infer S extends number,
    ...infer T extends number[],
]
    ? Add<S, Sum<T>>
    : 0;

export type Multiply<
    A extends number,
    B extends number,
    T extends any[] = [],
> = T["length"] extends B ? 0 : Add<A, number & Multiply<A, B, [...T, any]>>;

export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;

export type Exists<A, B extends unknown[]> = {
    [K in NumericKeys<B>]: Equal<A, B[K]> extends true ? true : never;
}[NumericKeys<B>] extends never
    ? false
    : true;

export type Unique<A extends unknown[]> = {
    [S in NumericKeys<A>]: {
        [T in NumericKeys<A>]: Equal<S, T> extends true
            ? never
            : Equal<A[S], A[T]> extends true
              ? false
              : never;
    }[NumericKeys<A>];
}[NumericKeys<A>] extends never
    ? true
    : false;

export type Grid9x9 = Grid<9, number>;

export type Transpose<
    A extends Grid9x9,
    T extends any[] = [],
> = T["length"] extends 9
    ? []
    : [
          {
              [K in keyof A]: A[K][T["length"]];
          },
          ...Transpose<A, [...T, any]>,
      ];

export type Row = Tuple<9, number>;

export type ModifyRow<
    A extends Row,
    X extends number,
    V extends number,
    T extends number[] = [],
> = T["length"] extends 9
    ? T
    : ModifyRow<A, X, V, [...T, T["length"] extends X ? V : A[T["length"]]]>;

export type ModifyGrid<
    A extends Grid9x9,
    X extends number,
    Y extends number,
    V extends number,
    T extends number[][] = [],
> = T["length"] extends 9
    ? T
    : ModifyGrid<
          A,
          X,
          Y,
          V,
          [
              ...T,
              T["length"] extends Y
                  ? ModifyRow<A[T["length"]], X, V>
                  : A[T["length"]],
          ]
      >;
