import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";

import "./Events.css";

class AuthPage extends Component {
  state = {
    creating: false,
    events: [],
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();
  }

  componentDidMount() {
    this.fetchevents();
  }

  startCreateHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    console.log("i am here");

    const title = this.titleEl.current.value;
    const price = this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price: +price, date, description };
    console.log("eventevent:", event);

    const token = this.context.token;
    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${+price}, date: "${date}"}){
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
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
        this.setState({ creating: false });
        this.fetchevents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchevents() {
    const requestBody = {
      query: `
        query{
          events{
            _id
            title
            description
            date
            price
            creator {
              email
              _id
            }
          }
        }
        `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Request failed!");
        }

        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        this.setState({ events });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const eventList = this.state.events.map((event) => {
      return (
        <li key={event._id} className="events__list-item">
          {event.title}
        </li>
      );
    });

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form className="">
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleEl} />
              </div>
              <div className="form-control">
                <label htmlFor="price">price</label>
                <input type="number" id="price" ref={this.priceEl} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateEl} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionEl}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">{eventList}</ul>
      </React.Fragment>
    );
  }
}

export default AuthPage;
