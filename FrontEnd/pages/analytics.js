// import React, { useState, useEffect } from "react";
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { ThemeProvider, createTheme, Select, MenuItem } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { Container, Typography } from "@mui/material";
// import { Box } from "@mui/material";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";
// import axios from "axios";

import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Button, Dialog, Select, MenuItem, Box, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import { FormControlLabel, Checkbox } from "@mui/material";
import Switch from '@mui/material/Switch';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const dummyBarData = [
  { label: "Page Views", value: 1500 },
  { label: "Clicks", value: 800 },
  { label: "Users", value: 300 },
];

const dummyLineData = [
  { label: "Jan", value: 20 },
  { label: "Feb", value: 35 },
  { label: "Mar", value: 50 },
  { label: "Apr", value: 80 },
  { label: "May", value: 60 },
];

const dummyPieData = [
  { label: "Chrome", value: 45 },
  { label: "Firefox", value: 30 },
  { label: "Safari", value: 15 },
  { label: "Others", value: 10 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];  


function Analytics() {
    const [isBarChartOpen, setIsBarChartOpen] = useState(false);
    const [isLineChartOpen, setIsLineChartOpen] = useState(false);
    const [isPieChartOpen, setIsPieChartOpen] = useState(false);
    const [pieData, setPieData] = useState([]);
    const [selectedAgeRange, setSelectedAgeRange] = useState(null);
    

    const openBarChartDialog = () => {
        setIsBarChartOpen(true);
      };
      
      const closeBarChartDialog = () => {
        setIsBarChartOpen(false);
      };
      
      const openLineChartDialog = () => {
        setIsLineChartOpen(true);
      };
      
      const closeLineChartDialog = () => {
        setIsLineChartOpen(false);
      };
      
      const openPieChartDialog = () => {
        setIsPieChartOpen(true);
      };
      
      const closePieChartDialog = () => {
        setIsPieChartOpen(false);
      };

  useEffect(() => {
    // Fetch pie chart data using Axios from the Flask endpoint
    axios.get("http://localhost:8003/genreDistribution")
      .then((response) => {
        setPieData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pie chart data:", error);
      });
  }, []);

  const handleAgeRangeChange = (event) => {
    setSelectedAgeRange(event.target.value);
    // Make an API call to fetch data based on the selected age range
    axios.get(`http://localhost:8003/genreDistribution?ageRange=${event.target.value}`)
      .then((response) => {
        setPieData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pie chart data:", error);
      });
  };
  const filteredPieData = pieData.filter(entry => entry.count > 0);



  const [barData, setBarData] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showTotalMovies, setShowTotalMovies] = useState(false);
  const [showOnPage, setShowOnPage] = useState(true); 

  useEffect(() => {
    axios.get("http://localhost:8003/meanVotePerGenre")
      .then((response) => {
        setBarData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mean vote data:", error);
      });
  }, []);

  const handleGenreCheckboxChange = (event) => {
    const genre = event.target.value;
    if (event.target.checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre !== genre));
    }
  };

  const toggleShowTotalMovies = () => {
    setShowTotalMovies(!showTotalMovies);
  };

  const toggleBarChartDialog = () => {
    setIsBarChartOpen(!isBarChartOpen);
  };

  const toggleShowOnPage = () => {
    setShowOnPage(!showOnPage);
  };

  const filteredBarData = barData.filter((data) =>
    selectedGenres.includes(data.genre)
  );




const [lineData, setLineData] = useState([]);
const [isTopGenres, setIsTopGenres] = useState(true);
const [activeDataKey, setActiveDataKey] = useState('rating');

const toggleDataKey = () => {
  const newDataKey = activeDataKey === 'rating' ? 'budget' :
                    activeDataKey === 'budget' ? 'revenue' :
                    activeDataKey === 'revenue' ? 'profit' : 'rating';
  setActiveDataKey(newDataKey);
};

useEffect(() => {
  axios.get("http://localhost:8003/topGenresAndCompanies")
    .then((response) => {
      setLineData(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, [activeDataKey]);

let lineChartData = [];

if (lineData) {
  const dataPoints = isTopGenres ? lineData.top_genres : lineData.top_companies;

  if (dataPoints) {
    lineChartData = dataPoints.map((dataPoint) => ({
      label: isTopGenres ? dataPoint.genre : dataPoint.company,
      rating: isTopGenres ? dataPoint.rating : dataPoint[activeDataKey],
      budget: parseFloat(dataPoint.budget.replace(/[$,]/g, '')),
      revenue: parseFloat(dataPoint.revenue.replace(/[$,]/g, '')),
      profit: parseFloat(dataPoint.profit.replace(/[$,]/g, '')),
    }));
  }
}

const toggleChartType = () => {
  setIsTopGenres(!isTopGenres);
};


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "black",
          alignItems: "center",
          width: "900px",
          borderRadius: 8,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#B2B5E0' }}>ANALYTICS</h1>
      </Box>
      <Container
        sx={{
          marginTop: 4,
          display: "flex",
          justifyContent: "space-between",
          borderRadius: 8,
          padding: "20px",
          backgroundColor: "#333",
        }}
      >
      {/* Bar Chart */}
      <div>
          <Typography variant="h6" sx={{ marginBottom: 1, color: "white" }}>
            Bar Chart
          </Typography>
          <BarChart width={300} height={200} data={filteredBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genre" angle={-90} textAnchor="end" interval={0} tickMargin={10} />
            <YAxis />
            <Tooltip formatter={(value, name, props) => [value, props.payload.genre]} />
            <Legend />
            <Bar dataKey={showOnPage ? (showTotalMovies ? "total_movies" : "mean_vote_average") : "mean_vote_average"}>
              {filteredBarData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
          <Button variant="outlined" onClick={toggleBarChartDialog}>
            Open Bar Chart
          </Button>
        </div>

        {/* Dialog */}
        {isBarChartOpen && (
          <Dialog open={isBarChartOpen} onClose={toggleBarChartDialog}>
            <DialogTitle>Bar Chart</DialogTitle>
            <DialogContent>
              {/* Graph content inside dialog */}
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showTotalMovies}
                      onChange={toggleShowTotalMovies}
                      color="primary"
                    />
                  }
                  label="Show Total Movies"
                />
                <div>
                  {barData.map((genreData, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedGenres.includes(genreData.genre)}
                          onChange={handleGenreCheckboxChange}
                          value={genreData.genre}
                        />
                      }
                      label={genreData.genre}
                    />
                  ))}
                </div>
                <BarChart width={600} height={400} data={filteredBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="genre"
                    label={{ value: "Genres", position: "insideBottom", offset: -5 }}
                    angle={-90}
                    textAnchor="end"
                    interval={0}
                    tickMargin={10}
                  />
                  <YAxis
                    label={{
                      value: showTotalMovies ? "Total Movies" : "Avg Rating",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip formatter={(value, name, props) => [value, props.payload.genre]} />
                  <Legend />
                  <Bar dataKey={showTotalMovies ? "total_movies" : "mean_vote_average"}>
                    {filteredBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={toggleBarChartDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        )}

        

        {/* Line Chart */}
        <div>
          <Typography variant="h6" sx={{ marginBottom: 1, color: "white" }}>
            Line Chart
          </Typography>
          <LineChart width={300} height={200} data={lineChartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis
    dataKey="label"
    angle={-45}
    textAnchor="end"
    interval={0}
    tickMargin={10}
  />
  <YAxis
    label={{
      value:
        activeDataKey === "rating"
          ? "Rating"
          : activeDataKey === "budget"
          ? "Budget"
          : activeDataKey === "revenue"
          ? "Revenue"
          : activeDataKey === "profit"
          ? "Profit"
          : "",
      angle: -90,
      position: "insideLeft",
    }}
  />
 <Tooltip
    labelFormatter={(value) => {
      return value; // Use the x-axis label directly as the tooltip label
    }}
    formatter={(value, name, props) => {
      if (activeDataKey === "budget" || activeDataKey === "revenue" || activeDataKey === "profit") {
        // Format the value with dollar signs and commas
        const formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
        return [`${props.payload.label}: ${formattedValue}`];
      } else {
        return [`${props.payload.label}: ${value}`]; // Display only the x-axis label and the value
      }
    }}
  />
  <Legend />
  <Line
    type="monotone"
    dataKey={activeDataKey}
    stroke={COLORS[0]}
    strokeWidth={2}
  />
</LineChart>
          <Dialog open={isLineChartOpen} onClose={closeLineChartDialog}>
            <DialogTitle>Line Chart</DialogTitle>
            <DialogContent>
              <div>
                <div>
                  <Button variant="outlined" onClick={toggleChartType}>
                    Toggle Chart Type
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={toggleDataKey}
                    style={{ marginLeft: 10 }}
                  >
                    Toggle Data Type
                  </Button>
                </div>
              </div>
              <div>
              <LineChart width={600} height={400} data={lineChartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis
    dataKey="label"
    angle={-45}
    textAnchor="end"
    interval={0}
    tickMargin={10}
  />
  <YAxis
    label={{
      value:
        activeDataKey === "rating"
          ? "Rating"
          : activeDataKey === "budget"
          ? "Budget"
          : activeDataKey === "revenue"
          ? "Revenue"
          : activeDataKey === "profit"
          ? "Profit"
          : "",
      angle: -90,
      position: "insideLeft",
    }}
  />
  <Tooltip
    labelFormatter={(value) => {
      return value; // Use the x-axis label directly as the tooltip label
    }}
    formatter={(value, name, props) => {
      if (activeDataKey === "budget" || activeDataKey === "revenue" || activeDataKey === "profit") {
        // Format the value with dollar signs and commas
        const formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
        return [`${props.payload.label}: ${formattedValue}`];
      } else {
        return [`${props.payload.label}: ${value}`]; // Display only the x-axis label and the value
      }
    }}
  />
  <Legend />
  {activeDataKey === "rating" ? (
    <Line
      type="monotone"
      dataKey={activeDataKey}
      stroke={COLORS[0]}
      strokeWidth={2}
    />
  ) : (
    <Line
      type="monotone"
      dataKey={activeDataKey}
      stroke={COLORS[1]} // Use different color for budget, revenue, profit
      strokeWidth={2}
    />
  )}
</LineChart>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeLineChartDialog}>Close</Button>
            </DialogActions>
          </Dialog>
          <div>
            <Button variant="outlined" onClick={openLineChartDialog}>
              Open Line Chart
            </Button>
          </div>
        </div>



        {/* Pie Chart */}
        <div>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "white" }}>
            Pie Chart
          </Typography>
          <PieChart width={300} height={200}>
  <Pie
    data={pieData}
    dataKey="count"
    nameKey="genre"
    cx="50%"
    cy="50%"
    outerRadius={80}
    fill="#8884d8"
    label={(entry) => entry.genre}
  >
    {pieData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip
    formatter={(value, name, props) => [`${props.payload.genre}: ${value}`]} // Display genre and value in tooltip
  />
</PieChart>
          <Button variant="outlined" onClick={openPieChartDialog}>
            Open Pie Chart
          </Button>
          <Dialog open={isPieChartOpen} onClose={closePieChartDialog}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
              <Select
                value={selectedAgeRange}
                onChange={handleAgeRangeChange}
                label="Age Range"
                sx={{ marginBottom: 2, minWidth: 120 }}
              >
                <MenuItem value={null}>Select Age Range</MenuItem>
                <MenuItem value="0-10">0-10</MenuItem>
                <MenuItem value="11-20">11-20</MenuItem>
                <MenuItem value="21-30">21-30</MenuItem>
                <MenuItem value="31-40">31-40</MenuItem>
                <MenuItem value="41-50">41-50</MenuItem>
                <MenuItem value="51-60">51-60</MenuItem>
                <MenuItem value="61-70">61-70</MenuItem>
                <MenuItem value="71-80">71-80</MenuItem>
                <MenuItem value="81-90">81-90</MenuItem>
                <MenuItem value="91-100">91-100</MenuItem>
              </Select>
            <PieChart width={600} height={400}>
              <Pie
                data={filteredPieData}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => entry.genre}
              >
                {filteredPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `No. of users - ${value}`} />
            </PieChart>
            <DialogActions>
            <Button onClick={closePieChartDialog}>Close</Button>
            </DialogActions>
            </Box>
          </Dialog>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default Analytics;
