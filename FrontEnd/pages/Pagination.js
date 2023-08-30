import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

const PaginationApp = () => {
  const [data, setData] = useState([]);
  const [choice, setChoice] = useState(null);

  const fetchTopMovies = async (choice) => {
    try {
      const response = await fetch('http://localhost:8003/pagination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ choice })
      });
      const data = await response.json();
      setData(data);
      setChoice(choice);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderTable = () => {
    if (data.length === 0) {
      return null;
    }

    const totalTableHeight = 30 + data.length * 30 + 1;

    return (
      <div style={{ marginTop: '20px', border: '1px solid #ccc', textAlign: 'center', color: '#178582' }}>
        <Table
          width={1200}
          height={totalTableHeight}
          headerHeight={30}
          rowHeight={50}
          rowCount={data.length}
          rowGetter={({ index }) => data[index]}
          headerClassName="table-header"
          rowClassName={({ index }) => index % 2 === 0 ? 'even-row' : 'odd-row'}
        >
          <Column label="Rank" dataKey="rank" width={80} />
          <Column label="Title" dataKey="title" width={250} />
          <Column label={getColumnName()} dataKey={getColumnKey()} width={120} cellRenderer={renderRatingCell} />
          <Column label="" dataKey="empty" width={30} />
          <Column label="Genres" dataKey="genre" width={300} />
          <Column label="Release Date" dataKey="release_date" width={120} />
        </Table>
      </div>
    );
  };

  const renderColumns = () => {
    if (choice === 'profits') {
      return 'Profit';
    } else if (choice === 'rating') {
      return 'Rating';
    } else if (choice === 'revenue') {
      return 'Revenue';
    }
  };

  const getColumnName = () => {
    return choice === 'rating' ? ' Rating' : renderColumns();
  };

  const getColumnKey = () => {
    return choice === 'rating' ? 'rating' : renderColumns().toLowerCase();
  };

  const renderRatingCell = ({ cellData }) => {
    return choice === 'rating' ? parseFloat(cellData).toFixed(3) : cellData;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" onClick={() => fetchTopMovies('profits')}>
            Profits
          </Button>
          <Button variant="contained" color="primary" onClick={() => fetchTopMovies('rating')}>
            Ratings
          </Button>
          <Button variant="contained" color="primary" onClick={() => fetchTopMovies('revenue')}>
            Revenue
          </Button>
        </Stack>
      </div>
      {/* Conditionally render the table */}
      {renderTable()}
    </div>
  );
}

export default PaginationApp;