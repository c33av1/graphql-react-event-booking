import React from "react";

import "./EventItem.css";

const eventItem = ({ event, authUserId, onDetail }) => {
  const {
    _id,
    title,
    price,
    date,
    creator: { _id: userId },
  } = event;

  return (
    <li key={_id} className="events__list-item">
      <div>
        <h1>{title}</h1>
        {authUserId === userId && <small>By You</small>}
        <h2>
          ${price} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        <button className="btn" onClick={onDetail.bind(this, _id)}>
          View Details
        </button>
      </div>
    </li>
  );
};

export default eventItem;
