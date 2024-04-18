import { type MRT_Cell, type MRT_TableInstance } from '../types';
interface Props<TData extends Record<string, any> = {}> {
    cell: MRT_Cell<TData>;
    table: MRT_TableInstance<TData>;
    showLabel?: boolean;
    nValue?: string;
    onValueChange?: (id: string, value: string) => void;
}
export declare const MRT_EditCellTextField: <TData extends Record<string, any> = {}>({ cell, nValue, onValueChange, showLabel, table, }: Props<TData>) => import("react/jsx-runtime").JSX.Element;
export {};
