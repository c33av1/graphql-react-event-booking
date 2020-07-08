import React from "react";

import "./BookingList.css";

const BookingList = ({ bookings, onCancel }) => (
  <ul className="bookings__list">
    {bookings.map((b) => {
      return (
        <li key={b._id} className="bookings__item">
          <div className="bookings___item-data">
            {b.event.title} - {new Date(b.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={onCancel.bind(this, b._id)}>
              Cancel Booking
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default BookingList;
