import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Container,
  Typography,
  Button,
  Dialog,
  Select,
  MenuItem,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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
    axios
      .get("http://localhost:8003/genreDistribution")
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
    axios
      .get(`http://localhost:8003/genreDistribution?ageRange=${event.target.value}`)
      .then((response) => {
        setPieData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pie chart data:", error);
      });
  };
  const filteredPieData = pieData.filter((entry) => entry.count > 0);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
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
        alignItems: "center", // Center horizontally
        justifyContent: "space-between",
        borderRadius: 8,
        padding: "20px",
        backgroundColor: "#333",
        width: "90%", // Adjust the width as needed
        margin: "0 auto", // Center horizontally
      }}
    >
        {/* Bar Chart */}
        <div>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "white", textAlign: 'center' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        </div>

        {/* Line Chart */}
        <div>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "white", textAlign: 'center' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={openLineChartDialog} >
            Open Line Chart
          </Button>
          <Dialog open={isLineChartOpen} onClose={closeLineChartDialog}>
            <DialogTitle>Line Chart</DialogTitle>
            <DialogContent>
              <LineChart width={300} height={200} data={dummyLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke={COLORS[1]} />
              </LineChart>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeLineChartDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
        </div>

        {/* Pie Chart */}
        <div>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "white", textAlign: 'center' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
              </Box>
            <DialogActions>
              <Button onClick={closePieChartDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default Analytics;
