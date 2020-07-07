import React from "react";

import "./Modal.css";

const Modal = ({ title, children, canCancel, canConfirm, onCancel }) => (
  <div className="modal">
    <header className="modal__header">
      <h1>{title}</h1>
    </header>
    <section className="modal__content">{children}</section>
    <section className="modal__actions">
      {canCancel && (
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
      )}
      {canConfirm && <button className="btn">Confirm</button>}
    </section>
  </div>
);

export default Modal;
