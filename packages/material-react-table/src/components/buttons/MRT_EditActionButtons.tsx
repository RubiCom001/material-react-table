import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_EditActionButtonsProps<TData extends MRT_RowData>
  extends BoxProps {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

export const MRT_EditActionButtons = <TData extends MRT_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: MRT_EditActionButtonsProps<TData>) => {
  const {
    getState,
    options: {
      icons: { CancelIcon, SaveIcon, DismissIcon, MergeIcon },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
      onEditingRowMerge,
      onEditingRowDismiss,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
    setIsEditInConflict,
  } = table;
  const { creatingRow, editingRow, isSaving } = getState();
  const { isEditInConflict } = getState();
  const { isEditWithErrors } = getState();
  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  };

  const handleDismiss = () => {
    onEditingRowDismiss?.({ row, table });
    setIsEditInConflict(false);
    //setEditingRow(null);
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
      row: editingRow ?? row,
      table,
      values: editingRow?._valuesCache ?? { ...row.original },
    });
    setIsEditInConflict(false);
  };
//console.log(`MRTEditActionButtons, isInError: ${isEditWithErrors}`);

  const handleSubmitRow = () => {
    //look for auto-filled input values
    Object.values(editInputRefs?.current)
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          // @ts-ignore
          row._valuesCache[input.name] = input.value;
        }
      });
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        display: 'flex',
        gap: '0.75rem',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
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




          <Tooltip title={!isEditInConflict? localization.cancel:"Accept Remote"}>
            <IconButton aria-label={localization.cancel} onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && !(isEditWithErrors || isEditInConflict) && (
            <Tooltip title={localization.save}>
              <IconButton
                aria-label={localization.save}
                color="info"
                disabled={isSaving}
                onClick={handleSubmitRow}
              >
                {isSaving ? <CircularProgress size={18} /> : <SaveIcon />}
              </IconButton>
            </Tooltip>
          
          )}
        </>
      ) : (
        <>



        { isEditInConflict &&
        <>
          <Button onClick={handleMerge} 
              variant="contained"
              sx={{ minWidth: '100px' }}>
              {localization.merge}
          </Button>
          <Button
              //disabled={isSaving}
              onClick={handleDismiss}
              sx={{ minWidth: '100px' }}
              variant="contained"
            >
            {localization.dismiss}
          </Button>
        </>
        }
          <Button onClick={handleCancel} sx={{ minWidth: '100px' }}>
            {!isEditInConflict? localization.cancel:"Accept Remote"}
          </Button>
          { !(isEditWithErrors || isEditInConflict) &&
          <Button
            disabled={isSaving}
            onClick={handleSubmitRow}
            sx={{ minWidth: '100px' }}
            variant="contained"
          >
            {isSaving && <CircularProgress color="inherit" size={18} />}
            {localization.save}
          </Button>
          }
        </>
      )}
    </Box>
  );
};
