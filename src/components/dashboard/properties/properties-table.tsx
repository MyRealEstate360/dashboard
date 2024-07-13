'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Property {
  id: string;
  picture: string;
  pictureHandle: string;
  address: { city: string; state: string; country: string; street: string };
  BuyTime: dayjs.Dayjs;
  BuyPrice: string;
  SellTime: dayjs.Dayjs;
  SellPrice: string;
  externalIds: { channel: string; account: string }[];
}

interface PropertiesTableProps {
  count?: number;
  page?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  rows?: Property[];
  rowsPerPage?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  onDelete?: (properties: Set<string>) => void;
}
interface SelectValues {
  [key: string]: string;
}


export function PropertiesTable({
  count = 0,
  rows = [],
  onDelete = noop,
}: PropertiesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((property) => property.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedAny = (selected?.size ?? 0) > 0;
  const selectedOne = (selected?.size ?? 0) === 1;
  const selectedSome = selectedAny && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPage] = React.useState(5);
  const paginatedProperties = applyPagination(rows, page, rowsPerPage);
  const [selectValues, setSelectValues] = React.useState<SelectValues>(
    rows.reduce((acc, row) => {
      acc[row.id] = 'None';
      return acc;
    }, {} as SelectValues)
  );

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              { selectedAny ? 
              <>
              <TableCell>
              <Typography variant="body2" color="textSecondary">
                {selected?.size} selected
              </Typography>
              </TableCell>
              <TableCell>
              <Stack direction = "row" spacing={3}>
                <Button variant="contained" onClick={() => onDelete(selected)}>
                  Delete
                </Button>
                {selectedOne && 
                  <Button variant="contained"> {/* To Be Implemented */}
                    Edit 
                  </Button>
                }
              </Stack>
              </TableCell>
              </>
              : <>
              <TableCell>Property</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>BuyTime</TableCell>
              <TableCell>BuyPrice</TableCell>
              <TableCell>SellTime</TableCell>
              <TableCell>SellPrice</TableCell>
              <TableCell>External</TableCell>
              </>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProperties.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.pictureHandle} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {row.address.city}, {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell>{dayjs(row.BuyTime.toDate()).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.BuyPrice}</TableCell>
                  <TableCell>{dayjs(row.SellTime.toDate()).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.SellPrice}</TableCell>
                  <TableCell>
                    <Select 
                      variant='standard'
                      defaultValue='None'
                      value = {selectValues[row.id]}
                      sx = {{ m: 1, minWidth: 120}}
                      onChange = {(event) => { setSelectValues({ ...selectValues, [row.id]: event.target.value }); }}
                    >
                    <MenuItem value='None'>
                      <em>None</em>
                    </MenuItem>
                    { 
                      row.externalIds.map((external) => {
                        return <MenuItem key={`${row.id}-${external.channel}`} value = {external.channel}> {external.channel} : {external.account} </MenuItem>
                      }) 
                    }
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={(event, number) => setPage(number)}
        onRowsPerPageChange={(element) => setRowsPage(parseInt(element.target.value))}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

function applyPagination(rows: Property[], page: number, rowsPerPage: number): Property[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

