import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { useData } from '../Providers/DataContext'; // Import useData hook from DataContext

const BasicAnalysis = () => {
  const { trips } = useData(); // Access trips from DataContext
  const [summary, setSummary] = useState(null);
  const [dataTypes, setDataTypes] = useState(null);
  const [nullValues, setNullValues] = useState(null);

  useEffect(() => {
    // Function to calculate basic statistics
    const calculateStatistics = () => {
      // Filter out trips with null fields
      const validTrips = trips.filter(trip => trip.trip_seconds !== null && trip.trip_miles !== null && trip.fare !== null);

      // Calculate total number of trips
      const totalTrips = 200000; // Set total trips to 200,000

      // Calculate average trip duration
      const tripDurations = validTrips.map(trip => parseInt(trip.trip_seconds));
      const averageDuration = tripDurations.reduce((acc, duration) => acc + duration, 0) / totalTrips;

      // Calculate average trip distance
      const tripDistances = validTrips.map(trip => parseFloat(trip.trip_miles));
      const averageDistance = tripDistances.reduce((acc, distance) => acc + distance, 0) / totalTrips;

      // Calculate average fare
      const fares = validTrips.map(trip => parseFloat(trip.fare));
      const averageFare = fares.reduce((acc, fare) => acc + fare, 0) / totalTrips;

      // Set summary object
      setSummary({
        totalTrips,
        averageDuration: !isNaN(averageDuration) ? averageDuration : null,
        averageDistance: !isNaN(averageDistance) ? averageDistance : null,
        averageFare: !isNaN(averageFare) ? averageFare : null,
      });
    };

    // Function to analyze data types
    const analyzeDataTypes = () => {
      // Extract data types of each field
      const types = {};
      trips.forEach(trip => {
        for (let key in trip) {
          if (trip[key] !== null) {
            const type = typeof trip[key];
            types[key] = types[key] ? types[key] : new Set();
            types[key].add(type);
          }
        }
      });
      setDataTypes(types);
    };

    // Function to handle null values
    const handleNullValues = () => {
      // Count null values for each field
      const nulls = {};
      trips.forEach(trip => {
        for (let key in trip) {
          nulls[key] = nulls[key] ? nulls[key] : 0;
          if (trip[key] === null) {
            nulls[key]++;
          }
        }
      });
      setNullValues(nulls);
    };

    // Call the functions to calculate statistics, analyze data types, and handle null values
    calculateStatistics();
    analyzeDataTypes();
    handleNullValues();
  }, [trips]);

  return (
    <div>
      <h1>Basic Analysis</h1>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Summary Statistics</CardTitle>
          <CardText>
            {summary ? (
              <div>
                <p>Total Trips: {summary.totalTrips}</p>
                {summary.averageDuration && !isNaN(summary.averageDuration) && <p>Average Trip Duration (seconds): {summary.averageDuration.toFixed(2)}</p>}
                {summary.averageDistance && !isNaN(summary.averageDistance) && <p>Average Trip Distance (miles): {summary.averageDistance.toFixed(2)}</p>}
                {summary.averageFare && !isNaN(summary.averageFare) && <p>Average Fare ($): {summary.averageFare.toFixed(2)}</p>}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>

      <Card className="mt-3">
        <CardBody>
          <CardTitle tag="h5">Data Type Analysis</CardTitle>
          <CardText>
            {dataTypes ? (
              <div>
                {Object.keys(dataTypes).map(field => (
                  <p key={field}>Data Type of {field}: {Array.from(dataTypes[field]).join(', ')}</p>
                ))}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>

      <Card className="mt-3">
        <CardBody>
          <CardTitle tag="h5">Null Values Analysis</CardTitle>
          <CardText>
            {nullValues ? (
              <div>
                {Object.keys(nullValues).map(field => (
                  <p key={field}>Null Values in {field}: {nullValues[field]}</p>
                ))}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default BasicAnalysis;