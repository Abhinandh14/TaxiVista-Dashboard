import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  PolarRadiusAxis,
  LineChart,
  Line, 
} from "recharts";

const TripDataVisualization = ({ trips }) => {
  const [chartType, setChartType] = useState("bar");

  const handleChange = (e) => {
    setChartType(e.target.value);
  };

  const preparePieChartData = () => {
    const paymentTypeData = {};
    trips.forEach((trip) => {
      const paymentType = trip.payment_type;
      if (!paymentTypeData[paymentType]) {
        paymentTypeData[paymentType] = 1;
      } else {
        paymentTypeData[paymentType]++;
      }
    });

    return Object.keys(paymentTypeData).map((key, index) => ({
      name: key,
      value: paymentTypeData[key],
      fill: ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#8dd1e1"][index],
    }));
  };

  const prepareCashTypePieData = () => {
    const cashTrips = trips.filter((trip) => trip.payment_type === "Cash");
    const cashCompanyData = {};
    cashTrips.forEach((trip) => {
      const company = trip.company;
      if (!cashCompanyData[company]) {
        cashCompanyData[company] = 1;
      } else {
        cashCompanyData[company]++;
      }
    });

    const sortedCompanies = Object.keys(cashCompanyData).sort((a, b) => cashCompanyData[b] - cashCompanyData[a]);
    const topCompanies = sortedCompanies.slice(0, 10);

    let otherCount = 0;
    const displayedCompanies = topCompanies.map((company, index) => {
      if (index < 5) {
        return {
          name: company,
          value: cashCompanyData[company],
          fill: ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#8dd1e1"][index],
        };
      } else {
        otherCount += cashCompanyData[company];
        return null;
      }
    }).filter(company => company !== null);

    if (sortedCompanies.length > 5) {
      displayedCompanies.push({
        name: `Other Companies (${sortedCompanies.length - 5})`,
        value: otherCount,
        fill: "#9e9e9e",
      });
    }

    return displayedCompanies;
  };

  const prepareScatterData = () => {
    return trips.map((trip, index) => ({
      tripIndex: index,
      tripTotal: parseFloat(trip.trip_total),
      extras: parseFloat(trip.extras),
      tripMiles: parseFloat(trip.trip_miles),
    }));
  };

  const prepareMeanTripsByCommunityArea = () => {
    const meanTripsByCommunityArea = {};
    trips.forEach((trip) => {
      const communityArea = trip.pickup_community_area;
      if (!meanTripsByCommunityArea[communityArea]) {
        meanTripsByCommunityArea[communityArea] = [];
      }
      meanTripsByCommunityArea[communityArea].push(parseFloat(trip.trip_total));
    });

    return Object.keys(meanTripsByCommunityArea).map((area) => ({
      communityArea: area,
      meanTrips: meanTripsByCommunityArea[area].reduce((a, b) => a + b, 0) / meanTripsByCommunityArea[area].length,
    }));
  };

  const prepareTotalTripsByYear = () => {
    const totalTripsByYear = {};
    trips.forEach((trip) => {
      const tripYear = new Date(trip.trip_start_timestamp).getFullYear();
      if (!totalTripsByYear[tripYear]) {
        totalTripsByYear[tripYear] = 1;
      } else {
        totalTripsByYear[tripYear]++;
      }
    });

    return Object.keys(totalTripsByYear).map((year) => ({
      year: parseInt(year),
      totalTrips: totalTripsByYear[year],
    }));
  };

  return (
    <div>
      <h1>Trip Data Visualization</h1>
      <div>
        <label htmlFor="chartType">Select Chart Type:</label>
        <select id="chartType" value={chartType} onChange={handleChange}>
          <option value="bar">Bar Chart</option>
          <option value="area">Area Chart</option>
          <option value="radar">Radar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="scatter">Scatter Plot</option>
          {/* <option value="line">Line Chart</option> */}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <div style={{ width: "50%", margin: "10px" }}>
          {chartType === "bar" && (
            <>
              <h2>Bar Chart</h2>
              <p>The bar chart displays the trip duration in seconds for each trip.</p>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={trips}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trip_index" interval={1000} />
                  <YAxis type="number" domain={[0, 10000]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="trip_seconds"
                    fill="#8884d8"
                    name="Trip Duration (seconds)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "area" && (
            <>
              <h2>Area Chart</h2>
              <p>The area chart displays the total trip miles covered over time.</p>
              <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={trips}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="trip_index" interval={10} />
                  <YAxis scale="linear" domain={[0, 60]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="trip_miles"
                    fill="#82ca9d"
                    name="Trip Miles"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "radar" && (
            <>
              <h2>Radar Chart</h2>
              <p>The radar chart displays the distribution of fares across trips.</p>
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart
                  outerRadius={150}
                  width={300}
                  height={300}
                  data={trips}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="trip_index" />
                  <PolarRadiusAxis type="number" domain={[0, 50]} />
                  <Radar
                    name="Fare"
                    dataKey="fare"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "pie" && (
            <>
              <h2>Pie Chart for Payment Type</h2>
              <p>The pie chart displays the distribution of trips by payment type.</p>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={preparePieChartData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {preparePieChartData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "scatter" && (
            <>
              <h2>Scatter Plot of Trip Totals</h2>
              <ResponsiveContainer width="100%" height={450}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
                  <CartesianGrid />
                  <XAxis
                    type="number"
                    dataKey="tripIndex"
                    name="Trip Index"
                    unit=""
                  />
                  <YAxis
                    type="number"
                    dataKey="tripTotal"
                    name="Trip Total"
                    unit="$"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="A Scatter" data={prepareScatterData()} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "line" && (
            <>
              <h2>Line Chart of Total Trips Over Years</h2>
              <p>The line chart displays the total number of trips over the years.</p>
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={prepareTotalTripsByYear()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" interval={1} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalTrips" name="Total Trips" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
        <div style={{ width: "50%", margin: "10px" }}>
          {chartType === "pie" && (
            <>
              <h2>Pie Chart for Cash Type Payments</h2>
              <p>The pie chart displays the distribution of trips with cash payments.</p>
              <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <p><strong>Note:</strong> Due to space constraints, only the top 10 companies accepting cash payments are shown. Other companies are aggregated into an "Other Companies" category.</p>
              </div>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={prepareCashTypePieData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {prepareCashTypePieData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "bar" && (
            <>
              <h2>Mean Trips by Pickup Community Area</h2>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={prepareMeanTripsByCommunityArea()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="communityArea" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="meanTrips" fill="#8884d8" name="Mean Trips" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          {chartType === "scatter" && (
            <>
              <h2>Scatter Plot of Extras vs Trip Miles</h2>
              <ResponsiveContainer width="100%" height={450}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
                  <CartesianGrid />
                  <XAxis
                    type="number"
                    dataKey="tripMiles"
                    name="Trip Miles"
                    unit=""
                  />
                  <YAxis
                    type="number"
                    dataKey="extras"
                    name="Extras"
                    unit="$"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Extras vs Trip Miles" data={prepareScatterData()} fill="#82ca9d" />
                </ScatterChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDataVisualization;

























































