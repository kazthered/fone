import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Collapse } from '@mui/material';
import SectionHeader from './SectionHeader';

function ResultsContainer({ children }) {
  return(<TableContainer>{children}</TableContainer>);
}

function RaceResults() {
  const [raceResults, setRaceResults] = useState([]);
  const [raceVenue, setRaceVenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRaceResults = async () => {
      setError(null);
      try {
        const data = await fetch('https://api.jolpi.ca/ergast/f1/2026/results/');
        const jsonData = await data.json();
        if (jsonData.MRData.RaceTable.Races.length > 0) {
          setRaceResults(jsonData.MRData.RaceTable.Races[0].Results);
          setRaceVenue(jsonData.MRData.RaceTable.Races[0].Circuit.circuitName);
        } else {
          setError('There are no race results available at this time.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRaceResults();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  } else if (error) {
    return(
    <ResultsContainer>
      <SectionHeader title={`Previous Race Standings (Unknown Venue)`} onClick={() => setOpen(!open)}/>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table table-layout="fixed">
          <TableHead>
            <TableRow >
              <TableCell>Error Fetching - {error} - The season just started or a network error occurred, probably.</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Collapse>
    </ResultsContainer>
    );
  } else {
    return (
    <ResultsContainer>
      <SectionHeader title={`Previous Race Standings (${typeof(raceVenue) !== 'undefined' ? raceVenue : 'Unknown Venue'})`} onClick={() => setOpen(!open)}/>
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
            {raceResults.map((result, number) => (
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

export default RaceResults;
