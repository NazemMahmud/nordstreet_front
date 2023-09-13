import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

const PaginationComponent = ({ paginationInfo, paginationCallback }) => {
    /**
     * Use it for pagination callback to update data in table
     * @param page
     * @param isDisabled
     */
    const updateTable = (page, isDisabled = false) => {
        if (paginationInfo.currentPage !== page && !isDisabled) {
            paginationCallback(page);
        }
    };

    return (
        <Row className="mb-5 mt-0 pb-5 pt-0">
            <Col className="mt-0 pt-0">
                <Card className="mt-0 pt-0">
                    <Card.Body className="mt-0">
                        <div className="float-right">
                            <Button size="sm" variant="primary" type="button"
                                    disabled={paginationInfo.hasPreviousPage == false}
                                    onClick={() => updateTable(
                                        paginationInfo.currentPage - 1,
                                        paginationInfo.currentPage === 1)}>
                                Prev
                            </Button>
                            <span className="ml-2 mr-2">
                                { paginationInfo.from } - { paginationInfo.to } of { paginationInfo.total }
                            </span>
                            <Button size="sm" variant="primary" type="button"
                                    disabled={paginationInfo.currentPage === paginationInfo.lastPage}
                                    onClick={() => updateTable(
                                        paginationInfo.currentPage + 1,
                                        paginationInfo.currentPage === paginationInfo.lastPage)}>
                                Next
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default PaginationComponent;
