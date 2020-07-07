import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "./Events.css";

class AuthPage extends Component {
  state = {
    creating: false,
  };

  startCreateHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
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
            <p>Modal Content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default AuthPage;
