import React  from "react";
import { Modal, Spinner } from "react-bootstrap";

const LoaderComponent = ({ isLoading }) => {
    return (
        <Modal className="loader" show={isLoading} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <div className="text-center py-5">
                    <Spinner animation="border"/>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LoaderComponent;
