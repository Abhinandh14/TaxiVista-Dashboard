import React from 'react';
import TripDataVisualization from './TripDataVisualization';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import { useData } from '../Providers/DataContext';
import { useTheme } from './ThemeProvider'; // Import useTheme hook

const Visualizations = ({ isAuthenticated }) => {
  const { trips, loading } = useData();
  const { darkMode } = useTheme();

  // Adjust the number of displayed trips for a more detailed graph
  const detailedTrips = trips.slice(0, 200000);

  return (
    <div style={{ backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : 'inherit' }}>
      <h1>Visualizations</h1>
      <Row>
        <Col>
          <Card style={{ backgroundColor: darkMode ? '#444' : '#fff', color: darkMode ? '#fff' : 'inherit' }}>
            <CardBody>
              <CardTitle tag="h5">Distribution of Trip Data</CardTitle>
              <CardText>
                Displaying a detailed view of the distribution of trip data.
              </CardText>
              <TripDataVisualization trips={detailedTrips} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Visualizations;
