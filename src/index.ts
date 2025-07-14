import { Grid9x9, ModifyGrid, RangeUnion } from "utils";
import { CompleteSudoku, ValidSudoku } from "validator";

type Solve<A extends Grid9x9> =
    CompleteSudoku<A> extends true
        ? A
        : {
              [X in RangeUnion<9>]: {
                  [Y in RangeUnion<9>]: A[X][Y] extends 0
                      ? {
                            [Z in Exclude<RangeUnion<10>, 0>]: ValidSudoku<
                                ModifyGrid<A, X, Y, Z>
                            > extends true
                                ? Solve<ModifyGrid<A, X, Y, Z>>
                                : never;
                        }[Exclude<RangeUnion<10>, 0>]
                      : never;
              }[RangeUnion<9>];
          }[RangeUnion<9>];

type Board = [
    [0, 0, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 0, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 0, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

type Result = Solve<Board>;
