import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material'
import { format } from 'date-fns'

import { NoteDetailRespDto } from '../../../services/note/dto/noteDetailRespDto'

export default function NoteInfoDialog({ note, onClose }: { note: NoteDetailRespDto; onClose: () => void }) {
  function createData(field: string, data: any) {
    return { field, data }
  }

  const rows = [
    createData('Modified', format(note.updatedAt, 'MMM d, yyyy, h:mm a')),
    createData('Created', format(note.createdAt, 'MMM d, yyyy, h:mm a')),
    createData('Characters', note.content.trim().length),
    createData('Version', note.version)
  ]

  return (
    <Dialog open onClose={onClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>{'Document'}</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <TableContainer>
          <Table aria-label='document infomation' size='small'>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.field} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row' sx={{ fontWeight: 500 }}>
                    {row.field}
                  </TableCell>
                  <TableCell align='right'>{row.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
