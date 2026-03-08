import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Collapse } from '@mui/material';
import SectionHeader from './SectionHeader';

function StandingsContainer({ children }) {
  return(<TableContainer>{children}</TableContainer>);
}

function ConstructorStandings() {
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchConstructorStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetch('https://api.jolpi.ca/ergast/f1/2026/constructorstandings');
        const jsonData = await data.json();
        if (jsonData.MRData.StandingsTable === undefined) {
          setConstructorStandings(jsonData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
        } else {
          setError('There are no constructor standings available at this time.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConstructorStandings();
  }, []);

    if (isLoading) {
      return <CircularProgress />;
    }
  
    if (error) {
      return <div>Error fetching: {error} - The season just started or a network error occurred, probably.</div>;
    }

  return (
    <StandingsContainer>
      <SectionHeader title="Constructors' Point Rankings" onClick={() => setOpen(!open)} />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Constructor</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {constructorStandings.map((constructor, constructorId) => (
                <TableRow key={constructorId}>
                  <TableCell>{constructor.position}</TableCell>
                  <TableCell>{constructor.Constructor.name}</TableCell>
                  <TableCell>{constructor.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </StandingsContainer>
  );
}

export default ConstructorStandings;
