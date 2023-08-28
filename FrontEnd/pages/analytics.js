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
    axios.get("http://localhost:8002/genreDistribution")
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
    axios.get(`http://localhost:8002/genreDistribution?ageRange=${event.target.value}`)
      .then((response) => {
        setPieData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pie chart data:", error);
      });
  };
  const filteredPieData = pieData.filter(entry => entry.count > 0);
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
        <h1>Analytics</h1>
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
          <Typography variant="h6" sx={{ marginBottom: 2, color: "white" }}>
            Bar Chart
          </Typography>
          <BarChart width={300} height={200} data={dummyBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
        <Button variant="outlined" onClick={openBarChartDialog}>
            Open Bar Chart
        </Button>
        <Dialog open={isBarChartOpen} onClose={closeBarChartDialog}>
            <DialogTitle>Bar Chart</DialogTitle>
            <DialogContent>
            <BarChart width={300} height={200} data={dummyBarData}>
            <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
            </DialogContent>
            <DialogActions>
            <Button onClick={closeBarChartDialog}>Close</Button>
            </DialogActions>
        </Dialog>
        </div>

        {/* Line Chart */}
        <div>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "white" }}>
            Line Chart
          </Typography>
          <LineChart width={300} height={200} data={dummyLineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={COLORS[1]} />
          </LineChart>
          <Button variant="outlined" onClick={openLineChartDialog}>
            Open Line Chart
          </Button>
          <Dialog open={isLineChartOpen} onClose={closeLineChartDialog}>
            <LineChart width={400} height={300} data={dummyLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[1]} />
            </LineChart>
            <DialogActions>
            <Button onClick={closeLineChartDialog}>Close</Button>
            </DialogActions>
          </Dialog>
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
              label={(entry) => entry.label}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
            <PieChart width={400} height={300}>
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
