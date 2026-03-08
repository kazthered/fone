import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Collapse } from '@mui/material';
import SectionHeader from './SectionHeader';

function DriverStandingsContainer({ children }) {
  return(<TableContainer>{children}</TableContainer>);
}

function DriverStandings() {
  const [driverStandings, setDriverStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetch('https://api.jolpi.ca/ergast/f1/2026/driverstandings');
        const jsonData = await data.json();
        if (jsonData.MRData.StandingsTable === undefined) {
          setDriverStandings(jsonData.MRData.StandingsTable.StandingsLists[0].Driver);
        } else {
          setError('There are no driver standings available at this time.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDriverStandings();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error fetching: {error} - The season just started or a network error occurred, probably.</div>;
  }

  return (
    <DriverStandingsContainer>
      <SectionHeader title="Drivers' Point Rankings" onClick={() => setOpen(!open)} open={open} />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {driverStandings.map((driver, driverId) => (
                <TableRow key={driverId}>
                  <TableCell>{driver.position}</TableCell>
                  <TableCell>{driver.Driver.givenName} {driver.Driver.familyName}</TableCell>
                  <TableCell>{driver.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </DriverStandingsContainer>
  );
}

export default DriverStandings;
