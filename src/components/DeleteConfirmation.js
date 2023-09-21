import React from "react";
import { Modal, Button, Card } from "react-bootstrap";


const DeleteConfirmation = ({ isOpen, closeCallback, deleteCallback }) => {
    return (
        <Modal show={isOpen} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title> Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card>
                    <Card.Body>
                        <h3>Are you sure you want to delete this data?</h3>
                    </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={deleteCallback}>
                    Confirm
                </Button>

                <Button variant="secondary" onClick={closeCallback}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmation;