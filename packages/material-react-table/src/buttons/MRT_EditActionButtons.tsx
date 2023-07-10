import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { type MRT_Row, type MRT_TableInstance } from '../types';

interface Props<TData extends Record<string, any> = {}> {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
  onValueChange?: (name: string, value: string) => void;
}

export const MRT_EditActionButtons = <TData extends Record<string, any> = {}>({
  row,
  table,
  variant = 'icon',
  onValueChange,
}: Props<TData>) => {
  const {
    getState,
    options: {
      icons: { CancelIcon, SaveIcon, DismissIcon, MergeIcon },
      localization,
      onEditingRowSave,
      onEditingRowCancel,
      onEditingRowMerge,
      onEditingRowDismiss,
    },
    refs: { editInputRefs },
    setEditingRow,
    setIsEditInConflict,
  } = table;
  const { editingRow } = getState();
  const { isEditInConflict } = getState();
  const { isEditWithErrors } = getState();

  const handleCancel = () => {
    onEditingRowCancel?.({ row, table });
    setEditingRow(null);
  };
  const handleDismiss = () => {
    onEditingRowDismiss?.({ row, table });
    setIsEditInConflict(false);
    //setEditingRow(null);
  };
  const handleSave = () => {
    //look for auto-filled input values
    Object.values(editInputRefs?.current)?.forEach((input) => {
      if (
        input.value !== undefined &&
        Object.hasOwn(editingRow?._valuesCache as object, input.name)
      ) {
        // @ts-ignore
        editingRow._valuesCache[input.name] = input.value;
      }
    });
    onEditingRowSave?.({
      exitEditingMode: () => setEditingRow(null),
      row: editingRow ?? row,
      table,
      values: editingRow?._valuesCache ?? { ...row.original },
    });
  };

  const handleMerge = async () => {
    //look for auto-filled input values
    Object.values(editInputRefs?.current)?.forEach((input) => {
      if (
        input.value !== undefined &&
        Object.hasOwn(editingRow?._valuesCache as object, input.name)
      ) {
        // @ts-ignore
        //console.log("Setting editingRow._valuesCache: ", input.name, " value: ", editingRow._valuesCache[input.name]);
        // @ts-ignore
        editingRow._valuesCache[input.name] = input.value;
      }
    });
    //console.log("beforeOnEditRowMerge");
    await onEditingRowMerge?.({
      row: editingRow ?? row,
      table,
      values: editingRow?._valuesCache ?? { ...row.original },
    }) ;
    //console.log("afterOnEditRowMerge");
    Object.values(editInputRefs?.current)?.forEach((input) => {
      if(editingRow) {
        // @ts-ignore
        const n= input.name? input.name:input.node?.name;
        // @ts-ignore
        const v = editingRow._valuesCache[n];
        if(onValueChange){
        onValueChange(n, v);
        //console.log("Setting input value: ", n, " value: ", v);
        }
        
        
      }
    });
    //setIsEditInConflict(false);
  };
  //console.log(`MRTEditActionButtons, isInError: ${isEditWithErrors}`)
  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{ display: 'flex', gap: '0.75rem' }}
    >
      {variant === 'icon' ? (
        <>
        { isEditInConflict &&
          <>
        <Tooltip arrow title={localization.merge}>
            <IconButton
              aria-label={localization.merge}
              color="info"
              onClick={handleMerge}
            >
              <MergeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={localization.dismiss}>
            <IconButton
              aria-label={localization.dismiss}
              color="info"
              onClick={handleDismiss}
            >
              <DismissIcon />
            </IconButton>
          </Tooltip>
          </>
        }
          <Tooltip arrow title={!isEditInConflict? localization.cancel:"Accept Remote"}>
            <IconButton aria-label={localization.cancel} onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        { !(isEditWithErrors || isEditInConflict) &&
          <Tooltip arrow title={localization.save}>
            <IconButton
              aria-label={localization.save}
              color="info"
              onClick={handleSave}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        } 
        </>
      ) : (
        <>
        { isEditInConflict &&
        <>
          <Button onClick={handleMerge} variant="contained" >{localization.merge}</Button>
          <Button onClick={handleDismiss} variant="contained" >{localization.dismiss}</Button>
        </>
        }
          <Button onClick={handleCancel}>{!isEditInConflict? localization.cancel:"Accept Remote"}</Button>
        { !(isEditWithErrors || isEditInConflict) &&
          <Button onClick={handleSave} variant="contained"> {localization.save}</Button>
        }
        </>
      )}
    </Box>
  );
};
