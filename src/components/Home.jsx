import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Carousel,
  CarouselItem,
  CarouselControl,
} from "reactstrap";
import { useData } from "../Providers/DataContext";
import { useTheme } from "./ThemeProvider";

const items = [
  {
    id: 1,
    heading: "Welcome to Taxi Trips Data Visualization",
    description:
      "Explore the fascinating world of taxi trips in Chicago from 2013 to 2023.",
    image:
      "https://i.ytimg.com/vi/aEypyy3pv3E/maxresdefault.jpg",
  },
  {
    id: 2,
    heading: "Lets goo CHICAGO ",
    image: "http://www.clipartbest.com/cliparts/pi5/X7r/pi5X7r8zT.jpg",
  }
];

const Home = () => {
  const { trips, loading } = useData();
  const { darkMode } = useTheme(); // Access darkMode state from ThemeProvider

  const first10Trips = trips.slice(0, 10);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const next = () =>
    setActiveIndex(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
  const previous = () =>
    setActiveIndex(activeIndex === 0 ? items.length - 1 : activeIndex - 1);

  useEffect(() => {
    if (!loading && trips.length > 0) {
      console.log("Trips:", trips);
    }
  }, [loading, trips]);

  const calculateAverageTripDuration = () => {
    if (trips.length === 0 || !trips[0].trip_duration) {
      return 0;
    }

    const totalDuration = trips.reduce(
      (acc, trip) => acc + trip.trip_duration,
      0
    );
    return totalDuration / trips.length;
  };

  return (
    <div
      className="home-container py-5"
      style={{
        backgroundColor: darkMode ? "#333" : "#f8f9fa",
        color: darkMode ? "#fff" : "inherit",
      }}
    >
      <div className="container">
        <Carousel
          activeIndex={activeIndex}
          next={next}
          previous={previous}
          interval={5000}
          pause={false}
        >
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <img
                src={item.image}
                className="d-block w-100"
                alt={item.heading}
              />
              <div className="carousel-caption">
                <h1 className="text-white">{item.heading}</h1>
                <p>{item.description}</p>
              </div>
            </CarouselItem>
          ))}
          <CarouselControl direction="prev" onClickHandler={previous} />
          <CarouselControl direction="next" onClickHandler={next} />
        </Carousel>

        <h2
          className="text-center mb-4"
          style={{ color: darkMode ? "#fff" : "inherit" }}
        >
          Recent Taxi Trips
        </h2>
        <Row xs="1" sm="2" md="4" className="justify-content-center">
          {loading ? (
            <p>Loading...</p>
          ) : (
            first10Trips.map((trip) => (
              <Col key={trip.trip_id} className="mb-4">
                <Card
                  className="trip-card shadow"
                  style={{ backgroundColor: darkMode ? "#444" : "#fff" }}
                >
                  <CardBody>
                    <CardText>Trip Start: {trip.trip_start_timestamp}</CardText>
                    <CardText>Trip End: {trip.trip_end_timestamp}</CardText>
                    <CardText>Fare: ${trip.fare}</CardText>
                    <CardText>Trip Miles: {trip.trip_miles} miles</CardText>
                    <CardText>Tips: ${trip.tips}</CardText>
                    <CardText>Tolls: ${trip.tolls}</CardText>
                    <CardText>Extras: ${trip.extras}</CardText>
                    <CardText>Total Fare: ${trip.trip_total}</CardText>
                    <CardText>Payment Type: {trip.payment_type}</CardText>
                    <CardText>Company: {trip.company}</CardText>
                    <CardText>
                      Pickup Community Area: {trip.pickup_community_area}
                    </CardText>
                    <CardText>
                      Dropoff Community Area: {trip.dropoff_community_area}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
};

export default Home;