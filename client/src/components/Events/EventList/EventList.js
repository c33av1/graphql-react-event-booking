import React from "react";

import EventItem from "./EventItem/EventItem";

import "./EventList.css";

const eventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        event={event}
        authUserId={props.authUserId}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="events__list">{events}</ul>;
};

export default eventList;
