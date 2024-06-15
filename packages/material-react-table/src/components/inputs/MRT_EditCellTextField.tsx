import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  useState,
} from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { type TextFieldProps } from '@mui/material/TextField';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';

export interface MRT_EditCellTextFieldProps<TData extends MRT_RowData>
  extends TextFieldProps<'standard'> {
  cell: MRT_Cell<TData>;
  rangeFilterIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_EditCellTextField = <TData extends MRT_RowData>({
  cell,
  rangeFilterIndex,
  table,
  ...rest
}: MRT_EditCellTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      muiEditTextFieldProps,
      muiEditDatePickerProps,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  //const [value, setValue] = useState(() => cell.getValue<any>());
  const [value, setValue] = useState(() => cell.getValue() ?? '');

  const textFieldProps: TextFieldProps = {
    ...parseFromValuesOrFunc(muiEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  const args = { cell, column, rangeFilterIndex, row, table };

  const datePickerProps = {
    ...parseFromValuesOrFunc(muiEditDatePickerProps, args),
    ...parseFromValuesOrFunc(columnDef.muiEditDatePickerProps, args),
  } as any;

  const isSelectEdit = editVariant === 'select' || textFieldProps?.select;
  const isDatePicker = editVariant === 'datePicker';

  const saveInputValueToRowCache = (newValue: any) => {
    //@ts-ignore
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    textFieldProps.onChange?.(event);
    setValue(event.target.value);
    if (isSelectEdit) {
      saveInputValueToRowCache(event.target.value);
    }
  };

  const handleDateChange = (newValue: any, context: any) => {
    if (context.validationError == null && newValue !== value) {
      datePickerProps.onChange?.(newValue, context);
      setValue(newValue);
      //saveInputValueToRowCache(newValue.valueOf().toString());
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textFieldProps.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key === 'Enter' && !event.shiftKey) {
      editInputRefs.current[column.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  const commonDatePickerProps = {
    onChange: handleDateChange,
    value: value ?? null,
    //value: value || null,
  };

  const commonTextFieldProps: TextFieldProps = {
    FormHelperTextProps: {
      sx: {
        fontSize: '0.75rem',
        lineHeight: '0.8rem',
        whiteSpace: 'nowrap',
      },
    },
    /*InputProps: endAdornment //hack because mui looks for presence of endAdornment key instead of undefined
            ? { endAdornment, startAdornment }
            : { startAdornment },*/
    fullWidth: true,
    /*helperText: showChangeModeButton ? (
            <label>
              {localization.filterMode.replace(
                '{filterType}',
                // @ts-ignore
                localization[
                  `filter${
                    currentFilterOption?.charAt(0)?.toUpperCase() +
                    currentFilterOption?.slice(1)
                  }`
                ],
              )}
            </label>
          ) : null,*/
    inputProps: {
      //'aria-label': filterPlaceholder,
      //autoComplete: 'new-password', // disable autocomplete and autofill
      //disabled: !!filterChipLabel,
      /*sx: {
              textOverflow: 'ellipsis',
              width: filterChipLabel ? 0 : undefined,
            },*/
      //title: filterPlaceholder,
      name: columnDef.accessorKey,
      title: columnDef.header,
    },
    /*inputRef: (inputRef) => {
            filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] =
              inputRef;
            if (textFieldProps.inputRef) {
              textFieldProps.inputRef = inputRef;
            }
          },*/
    margin: 'none',
    /*placeholder:
            filterChipLabel || isSelectFilter || isMultiSelectFilter
              ? undefined
              : filterPlaceholder,*/
    variant: 'standard',
    ...textFieldProps,
    sx: (theme) => ({
      minWidth: '160px',
      /*minWidth: isDateFilter
              ? '160px'
              : enableColumnFilterModes && rangeFilterIndex === 0
                ? '110px'
                : isRangeFilter
                  ? '100px'
                  : !filterChipLabel
                    ? '120px'
                    : 'auto',*/
      mx: '-2px',
      p: 0,
      width: 'calc(100% + 4px)',
      ...(parseFromValuesOrFunc(textFieldProps?.sx, theme) as any),
    }),
  };

  const handleClear = () => {
    /*if (isMultiSelectFilter) {
            setFilterValue([]);
            column.setFilterValue([]);
          } else if (isRangeFilter) {
            setFilterValue('');
            column.setFilterValue((old: [string | undefined, string | undefined]) => {
              const newFilterValues = (Array.isArray(old) && old) || ['', ''];
              newFilterValues[rangeFilterIndex as number] = undefined;
              return newFilterValues;
            });
          } else {*/
    setValue('');
    //column.setFilterValue(undefined);
    //}
  };
  /*const textFieldPropsFinal:MRT_EditCellTextFieldProps<TData> = {...textFieldProps, 
          onBlur:handleBlur,
          disabled: columnDef.enableEditing?!columnDef.enableEditing:false,
          label: columnDef.header,
          //key: col.accessorKey,
          name: columnDef.accessorKey,
          size: "small"
          //size: 'small' as TextFieldPropsSizeOverrides,
        } as MRT_EditCellTextFieldProps<TData>;*/

  const handleAccept = (event: any) => {
    //textFieldProps.onBlur?.(event);
    datePickerProps.onAccept?.(event);
    saveInputValueToRowCache(event);
    //console.log("DatePicker handleAccept(event), value: ", value, " event: ", event);
    //setEditingCell(null);
  };

  return isDatePicker ? (
    <DatePicker
      key={columnDef.accessorKey}
      displayWeekNumber={true}
      showDaysOutsideCurrentMonth={true}
      openTo="year"
      views={['year', 'month', 'day']}
      //onChange={handleDateChange}
      onAccept={handleAccept}
      yearsPerRow={3}
      {...commonDatePickerProps}
      {...datePickerProps}
      //slotProps={{ textField: textFieldPropsFinal }}
      slotProps={{
        field: {
          clearable: true,
          onClear: () => handleClear(),
          ...datePickerProps?.slotProps?.field,
        },
        textField: {
          ...commonTextFieldProps,
          ...datePickerProps?.slotProps?.textField,
        },
      }}
    />
  ) : (
    <TextField
      disabled={parseFromValuesOrFunc(columnDef.enableEditing, row) === false}
      fullWidth
      inputRef={(inputRef) => {
        if (inputRef) {
          editInputRefs.current[column.id] = inputRef;
          if (textFieldProps.inputRef) {
            textFieldProps.inputRef = inputRef;
          }
        }
      }}
      label={
        ['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string,
        )
          ? columnDef.header
          : undefined
      }
      margin="none"
      name={column.id}
      placeholder={
        !['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string,
        )
          ? columnDef.header
          : undefined
      }
      select={isSelectEdit}
      size="small"
      value={value ?? ''}
      variant="standard"
      {...textFieldProps}
      InputProps={{
        ...(textFieldProps.variant !== 'outlined'
          ? { disableUnderline: editDisplayMode === 'table' }
          : {}),
        ...textFieldProps.InputProps,
        sx: (theme) => ({
          mb: 0,
          ...(parseFromValuesOrFunc(
            textFieldProps?.InputProps?.sx,
            theme,
          ) as any),
        }),
      }}
      SelectProps={{
        MenuProps: { disableScrollLock: true },
      }}
      inputProps={{
        autoComplete: 'new-password', //disable autocomplete and autofill
        ...textFieldProps.inputProps,
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={(e) => {
        e.stopPropagation();
        textFieldProps?.onClick?.(e);
      }}
      onKeyDown={handleEnterKeyDown}
    >
      {textFieldProps.children ??
        selectOptions?.map((option) => {
          const { label, value } = getValueAndLabel(option);
          return (
            <MenuItem
              key={value}
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: '0.5rem',
                m: 0,
              }}
              value={value}
            >
              {label}
            </MenuItem>
          );
        })}
    </TextField>
  );
};
