import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardText, Table,Button  } from "reactstrap";
import { useData } from "../Providers/DataContext";
import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ComplexAnalysis = () => {
  const { trips } = useData();
  const [correlation, setCorrelation] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [companyAnalysis, setCompanyAnalysis] = useState(null);
  const [darkTheme, setDarkTheme] = useState(false); // State for dark theme
  const [filteredCompanies, setFilteredCompanies] = useState(null);

  useEffect(() => {
    // Function to calculate correlation between numerical variables
    const calculateCorrelation = () => {
      const numericalData = trips
        .map((trip) => ({
          trip_duration: parseInt(trip.trip_seconds),
          trip_distance: parseFloat(trip.trip_miles),
          fare: parseFloat(trip.fare),
          tips: parseFloat(trip.tips),
          tolls: parseFloat(trip.tolls),
          extras: parseFloat(trip.extras),
        }))
        .filter((trip) => Object.values(trip).every((value) => !isNaN(value))); // Filter out trips with NaN values

      if (numericalData.length === 0) {
        setCorrelation({});
        return;
      }

      const correlations = {};
      Object.keys(numericalData[0]).forEach((key1) => {
        correlations[key1] = {};
        Object.keys(numericalData[0]).forEach((key2) => {
          const correlation = pearsonCorrelation(
            numericalData.map((data) => data[key1]),
            numericalData.map((data) => data[key2])
          );
          correlations[key1][key2] = correlation.toFixed(2);
        });
      });

      setCorrelation(correlations);
    };

    // Function to calculate pearson correlation coefficient
    const pearsonCorrelation = (x, y) => {
      const n = x.length;
      if (n === 0) return NaN;

      const sumX = x.reduce((acc, val) => acc + val, 0);
      const sumY = y.reduce((acc, val) => acc + val, 0);

      const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
      const sumXSquared = x.reduce((acc, val) => acc + val ** 2, 0);
      const sumYSquared = y.reduce((acc, val) => acc + val ** 2, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt(
        (n * sumXSquared - sumX ** 2) * (n * sumYSquared - sumY ** 2)
      );

      if (denominator === 0) return NaN;

      return numerator / denominator;
    };

    // Function to calculate distribution analysis
    const calculateDistribution = () => {
      const numericalData = trips.map((trip) => ({
        trip_duration: parseInt(trip.trip_seconds),
        fare: parseFloat(trip.fare),
        trip_distance: parseFloat(trip.trip_miles),
      }));

      setDistribution(numericalData);
    };

    // Function to perform payment type analysis
    const calculatePaymentType = () => {
      const paymentTypes = trips.map((trip) => trip.payment_type);
      const fareByPaymentType = {};

      paymentTypes.forEach((type) => {
        if (!fareByPaymentType[type]) {
          fareByPaymentType[type] = [];
        }
      });

      trips.forEach((trip) => {
        // Check if the fare is not NaN before pushing it
        if (!isNaN(parseFloat(trip.fare))) {
          fareByPaymentType[trip.payment_type].push(parseFloat(trip.fare));
        }
      });

      // Calculate average fare for each payment type
      const averageFareByPaymentType = {};
      Object.keys(fareByPaymentType).forEach((type) => {
        const fares = fareByPaymentType[type];
        const totalFare = fares.reduce((acc, fare) => acc + fare, 0);
        const nonNaNFares = fares.filter((fare) => !isNaN(fare)); // Filter out NaN fares
        const averageFare =
          nonNaNFares.length > 0 ? totalFare / nonNaNFares.length : 0; // Calculate average only if there are non-NaN fares
        averageFareByPaymentType[type] = averageFare;
      });

      setPaymentType(averageFareByPaymentType);
    };

    // Function to perform company analysis
    const calculateCompanyAnalysis = () => {
      const companies = trips.map((trip) => trip.company);
      const tripCountsByCompany = {};
      companies.forEach((company) => {
        if (!tripCountsByCompany[company]) {
          tripCountsByCompany[company] = 0;
        }
        tripCountsByCompany[company]++;
      });

      // Calculate average trip duration and total fare revenue for each company
      const companyData = {};
      trips.forEach((trip) => {
        if (!companyData[trip.company]) {
          companyData[trip.company] = {
            tripCount: 0,
            totalTripDuration: 0,
            totalFare: 0,
          };
        }
        companyData[trip.company].tripCount++;
        companyData[trip.company].totalTripDuration += parseInt(
          trip.trip_seconds
        );
        // Include fare only if it's not NaN
        if (!isNaN(parseFloat(trip.fare))) {
          companyData[trip.company].totalFare += parseFloat(trip.fare);
        }
      });

      // Remove companies with NaN values for totalFare
      Object.keys(companyData).forEach((company) => {
        if (isNaN(companyData[company].totalFare)) {
          delete companyData[company];
        }
      });

      // Calculate average trip duration and total fare revenue
      Object.keys(companyData).forEach((company) => {
        companyData[company].averageTripDuration =
          companyData[company].totalTripDuration /
          companyData[company].tripCount;
        companyData[company].totalFare =
          companyData[company].totalFare.toFixed(2);
      });

      setCompanyAnalysis(companyData);
    };

    // Call the functions to perform analysis
    calculateCorrelation();
    calculateDistribution();
    calculatePaymentType();
    calculateCompanyAnalysis();
  }, [trips]);

  // Function to toggle dark theme
  const toggleDarkTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Function to filter companies based on criteria
  const filterCompanies = (criterion) => {
    let filtered = null;
    if (criterion === "top10") {
      filtered = Object.keys(companyAnalysis)
        .sort(
          (a, b) => companyAnalysis[b].totalFare - companyAnalysis[a].totalFare
        )
        .slice(0, 10);
    } else if (criterion === "bottom10") {
      filtered = Object.keys(companyAnalysis)
        .sort(
          (a, b) => companyAnalysis[a].totalFare - companyAnalysis[b].totalFare
        )
        .slice(0, 10);
    }
    setFilteredCompanies(filtered);
  };

  return (
    <div className={darkTheme ? "dark-theme" : "light-theme"}>
      <h1>Complex Analysis</h1>

      {/* Correlation Analysis */}
      <Card>
        <CardBody>
          <CardTitle tag="h5">Correlation Analysis</CardTitle>
          <CardText>
            {correlation ? (
              <Table>
                <thead>
                  <tr>
                    <th></th>
                    {Object.keys(correlation).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(correlation).map((key1) => (
                    <tr key={key1}>
                      <td>{key1}</td>
                      {Object.keys(correlation[key1]).map((key2) => (
                        <td key={key2}>{correlation[key1][key2]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>

      {/* Distribution Analysis */}
      <Card>
        <CardBody>
          <CardTitle tag="h5">Distribution Analysis</CardTitle>
          <CardText>
            {distribution ? (
              <div>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="trip_duration"
                      name="Trip Duration"
                      unit="s"
                    />
                    <YAxis type="number" dataKey="fare" name="Fare" unit="$" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter name="Trips" data={distribution} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>

      {/* Payment Type Analysis */}
      <Card>
        <CardBody>
          <CardTitle tag="h5">Payment Type Analysis</CardTitle>
          <CardText>
            {paymentType ? (
              <div>
                <p>Average Fare by Payment Type:</p>
                <Table>
                  <thead>
                    <tr>
                      <th>Payment Type</th>
                      <th>Average Fare ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(paymentType).map((type, index) => (
                      <tr key={index}>
                        <td>{type}</td>
                        <td>{paymentType[type].toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>

      {/* Company Analysis */}
      <Card>
        <CardBody>
          <CardTitle tag="h5">Company Analysis</CardTitle>
          <CardText>
            <div>
              <Button onClick={() => filterCompanies("top10")} color="primary">
                Top 10 Companies by Total Fare
              </Button>{" "}
              <Button
                onClick={() => filterCompanies("bottom10")}
                color="primary"
              >
                Bottom 10 Companies by Total Fare
              </Button>
            </div>
            <br />
            {filteredCompanies ? (
              <div>
                <p>Performance of Taxi Companies:</p>
                <Table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Trip Count</th>
                      <th>Average Trip Duration (seconds)</th>
                      <th>Total Fare Revenue ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company, index) => (
                      <tr key={index}>
                        <td>{company}</td>
                        <td>{companyAnalysis[company].tripCount}</td>
                        <td>
                          {companyAnalysis[company].averageTripDuration.toFixed(
                            2
                          )}
                        </td>
                        <td>{companyAnalysis[company].totalFare}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>

      {/* Dark Theme Toggle Button */}
      <button onClick={toggleDarkTheme}>Toggle Dark Theme</button>
    </div>
  );
};

export default ComplexAnalysis;
