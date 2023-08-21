import React from 'react';
import {Paper,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow} from '@material-ui/core';

const PreferredEquipmentsTable = ({ response }) => {
    // Assuming response is an object with a "res" array property
    const resArray = response?.res || [];
  
    // Extracting total reliability from the last element
    const totalReliability = resArray[resArray.length - 1] || '';
  
    // Extracting preferred equipment details (excluding the last element)
    const preferredEquipments = resArray.slice(0, resArray.length - 1);
  
    // Parse the preferred equipment data into an array of objects
    const parsedData = preferredEquipments.map(item => {
      // Extract phase and preferred equipment from each item
      const matches = item.match(/For (phase \d+) and group \d+, preferred equipments are (\[.*?\])/);
      if (matches && matches.length === 3) {
        const phase = matches[1];
        const preferredEquipment = JSON.parse(matches[2].replace(/'/g, '"'));
        return { phase, preferredEquipment };
      }
      return null;
    }).filter(Boolean);
  
    // Group preferred equipment by phase
    const groupedData = parsedData.reduce((acc, item) => {
      if (!acc[item.phase]) {
        acc[item.phase] = [];
      }
      acc[item.phase] = acc[item.phase].concat(item.preferredEquipment);
      return acc;
    }, {});

    console.log(groupedData)
    return (
      <div>
        <Paper elevation={3} style={{ padding: '20px', margin: '80px' }}>
          <Typography variant="h6">Preferred Equipments</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#56bcec', color: 'white' }}>Phase</TableCell>
                  <TableCell style={{ backgroundColor: '#56bcec', color: 'white' }}>Preferred Equipment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([phase, preferredEquipment], index) => (
                  <TableRow key={index}>
                    <TableCell>{phase}</TableCell>
                    <TableCell>{preferredEquipment.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Display total reliability */}
          <Typography>{totalReliability}</Typography>
        </Paper>
      </div>
    );
  };
  
  export default PreferredEquipmentsTable;  
  
  
  
  
  