import React from "react";
import { Container, Navbar } from 'react-bootstrap';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const NavigationBar = ({ loaderCallback }) => {

    return (
        <Navbar bg="dark" variant="dark">
            <ToastContainer position={"top-right"}
                            autoClose={3000}
                            hideProgressBar={false}
                            closeOnClick
                            pauseOnFocusLoss
                            draggable/>
            <Container>
                <Navbar.Brand href="/"> Company Information </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse id="responsive-navbar-nav">
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};


export default NavigationBar;
