import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

const PreferredEquipmentsTable = ({ response = [], rel, opsEquipment = [] }) => {
  console.log("TABLE DATA:", response);

  return (
    <div>
      <Paper elevation={3} style={{ padding: '20px', margin: '80px' }}>
        <Typography variant="h5">Preferred Equipments</Typography>
        <TableContainer style={{ margin: '30px 0' }}>
          <Table>
          
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#1976d2', color: 'white' }}>
                  <Typography variant='h6'>Phase</Typography>
                </TableCell>

                <TableCell style={{ backgroundColor: '#1976d2', color: 'white' }}>
                  <Typography variant='h6'>Preferred Equipment</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            
            <TableBody>
              {response.length > 0 ? (
                response.map((phase, index) => (
                  <TableRow key={phase.id || index}>
                    
                    {/* Phase */}
                    <TableCell>
                      {phase.missionType || '-'}
                    </TableCell>

                    {/* Preferred Components */}
                    <TableCell>
                      {Array.isArray(phase.components) && phase.components.length > 0
                        ? phase.components.join(', ')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography style={{ marginTop: '10px', fontWeight: 'bold' }}>
          NON-OPS Equipment: {opsEquipment.length > 0 ? opsEquipment.join(', ') : '-'}
        </Typography>
        <Typography variant='h6'>
          TOTAL RELIABILITY: {rel !== undefined ? rel : '-'}
        </Typography>
      </Paper>
    </div>
  );
};

export default PreferredEquipmentsTable;