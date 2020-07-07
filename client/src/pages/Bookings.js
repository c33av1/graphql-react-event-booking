import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    const { token } = this.context;
    if (!token) {
      return;
    }

    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query{
          bookings{
            _id
            event{
             _id
             title
             price
             date
             description
            }
            user{
              _id
              email
              
            }
            createdAt
            updatedAt
          }
        }
        `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Request failed!");
        }

        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        this.setState({ bookings, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {this.state.bookings.map((b) => (
              <li key={b._id}>
                {b.event.title} - {new Date(b.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
