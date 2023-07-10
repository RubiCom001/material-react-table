import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { MRT_EditActionButtons } from '../buttons/MRT_EditActionButtons';
import { MRT_EditCellTextField } from '../inputs/MRT_EditCellTextField';
import { type MRT_Row, type MRT_TableInstance } from '../types';
import { useState
 } from 'react';
interface Props<TData extends Record<string, any> = {}> {
  open: boolean;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_EditRowModal = <TData extends Record<string, any> = {}>({
  open,
  row,
  table,
}: Props<TData>) => {
  const {
    options: { localization },
  } = table;
  const [values, setValues] = useState<Record<string, string>>(() => row._valuesCache?row._valuesCache:row.original);

  const handleValueChange = (name:string, value:string) => {
    //console.log("handleValueChange editRowModal");
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{localization.edit}</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              gap: '1.5rem',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              pt: '1rem',
              width: '100%',
            }}
          >
            {row
              .getAllCells()
              .filter((cell) => cell.column.columnDef.columnDefType === 'data')
              .map((cell) => (
                <MRT_EditCellTextField
                  cell={cell as any}
                  key={cell.id}
                  showLabel
                  table={table as any}
                  nValue={values[cell.column.id]}
                  onValueChange={handleValueChange}
                />
              ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <MRT_EditActionButtons row={row} table={table} variant="text" onValueChange={handleValueChange}/>
      </DialogActions>
    </Dialog>
  );
};
