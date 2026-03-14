import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Collapse } from '@mui/material';
import SectionHeader from './SectionHeader';

function ResultsContainer({ children }) {
  return(<TableContainer>{children}</TableContainer>);
}

function SprintResults() {
  const [sprintResults, setSprintResults] = useState([]);
  const [sprintVenue, setSprintVenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSprintResults = async () => {
      setError(null);
      try {
        const data = await fetch('https://api.jolpi.ca/ergast/f1/2026/sprint/');
        const jsonData = await data.json();
        if (typeof(jsonData.MRData.RaceTable) !== 'undefined') {
          setSprintResults(jsonData.MRData.RaceTable.Races.at(0).Results);
          setSprintVenue(jsonData.MRData.RaceTable.Races.at(0).Circuit.circuitName);
        } else {
          setError('There are no sprint results available at this time.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSprintResults();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  } else if (error) {
    return(
    <ResultsContainer>
      <SectionHeader title={`Previous Sprint Standings (Unknown Venue)`} onClick={() => setOpen(!open)}/>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table table-layout="fixed">
          <TableRow >
            <TableCell>Error fetching: {error} - The season just started or a network error occurred, probably.</TableCell>
          </TableRow>
        </Table>
      </Collapse>
    </ResultsContainer>
    );
  } else {
    return (
    <ResultsContainer>
      <SectionHeader title={`Previous Sprint Standings (${typeof(sprintVenue) !== 'undefined' ? sprintVenue : 'Unknown Venue'})`} onClick={() => setOpen(!open)}/>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table table-layout="fixed">
          <TableHead>
            <TableRow >
              <TableCell>Position</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Constructor</TableCell>
              <TableCell>Laps</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sprintResults.map((result, number) => (
              <TableRow key={number}>
                <TableCell>{result.position}</TableCell>
                <TableCell>{result.Driver.givenName} {result.Driver.familyName}</TableCell>
                <TableCell>{result.Constructor.name}</TableCell>
                <TableCell>{result.laps}</TableCell>
                <TableCell>{result.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </ResultsContainer>
  );
  }
}

export default SprintResults;
