import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { type MRT_Row, type MRT_TableInstance } from '../types';

interface Props<TData extends Record<string, any> = {}> {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

export const MRT_EditActionButtons = <TData extends Record<string, any> = {}>({
  row,
  table,
  variant = 'icon',
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

  const handleMerge = () => {
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
    onEditingRowMerge?.({
      exitEditingMode: () => setEditingRow(null),
      row: editingRow ?? row,
      table,
      values: editingRow?._valuesCache ?? { ...row.original },
    });
  };
console.log(`MRTEditActionButtons, isInError: ${isEditWithErrors}`)
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
          <Tooltip arrow title={localization.cancel}>
            <IconButton aria-label={localization.cancel} onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        { !isEditWithErrors &&
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
          <Button onClick={handleCancel}>{localization.cancel}</Button>
        { !isEditWithErrors &&
          <Button onClick={handleSave} variant="contained"> {localization.save}</Button>
        }
        </>
      )}
    </Box>
  );
};
