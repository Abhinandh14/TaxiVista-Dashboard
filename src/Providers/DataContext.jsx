import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://data.cityofchicago.org/resource/wrvz-psew.json');
        // Filter out entries with NaN values
        const filteredTrips = response.data.filter(trip => {
          // Assuming 'trip_seconds' and 'trip_miles' are the fields where NaN values may occur
          return !isNaN(trip.trip_seconds) && !isNaN(trip.trip_miles);
        });
        setTrips(filteredTrips);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return <DataContext.Provider value={{ trips, loading }}>{children}</DataContext.Provider>;
};
