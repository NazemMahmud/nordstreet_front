import React from "react";
import { Button, Card, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { PencilSquare, Trash } from 'react-bootstrap-icons';

const Datatable = ({
                       data,
                       columns,
                       handleEditCallback= undefined,
                       handleDeleteCallback= undefined,
                       actions = []
}) => {

    // id & created_at column won't show in the table
    const getColumn = item => {
        const tds = [];

        for (const property in item) {
            if (property !== 'id' && property != 'created_at') {
                if (item[property].includes('http') || item[property].includes('https')) {
                    tds.push(<td key={property} style={{whiteSpace: 'pre'}} >
                        <div dangerouslySetInnerHTML={{ __html: item[property] }} />
                    </td>);
                 } else {
                    tds.push(<td key={property} style={{whiteSpace: 'pre'}}>{item[property]}</td>);
                }
            }
        }

        return tds;
    };

    /** Tooltip on hover over action button  **/
    const editTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Edit
        </Tooltip>
    );

    const deleteTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Delete
        </Tooltip>
    );


    return (
        <Card>
            <Card.Body className="m-0 p-0">
                { data.length ?
                    <Table striped bordered hover size="sm" className="mb-0 pb-0">
                        <thead>
                        <tr>
                            {
                                columns.map((col, idx) =>
                                    <th key={idx}> {col} </th>
                                )
                            }
                            {
                                actions.length ?  <th> Actions </th> : <></>
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((item, idx) =>
                                <tr key={idx}>
                                    { getColumn(item) }
                                    {
                                        actions.length ?
                                            <td>
                                                {
                                                    actions.includes('update') ?
                                                        <OverlayTrigger delay={{ show: 250, hide: 400 }}
                                                                        overlay={editTooltip} defaultShow={false}
                                                                        placement="bottom">
                                                            <Button size="md" variant="default" type="button"
                                                                    onClick={() => handleEditCallback(item.id)}>
                                                                <PencilSquare />
                                                            </Button>
                                                        </OverlayTrigger> : <></>
                                                }

                                                {
                                                    actions.includes('delete') ?
                                                        <OverlayTrigger delay={{ show: 250, hide: 400 }}
                                                                        defaultShow={false}
                                                                        overlay={deleteTooltip}
                                                                        placement="bottom">
                                                            <Button size="sm" variant="default" type="button"
                                                                    onClick={() => handleDeleteCallback(item.id)}>
                                                                <Trash color="red" />
                                                            </Button>
                                                        </OverlayTrigger> : <></>
                                                }
                                            </td>
                                            : <></>
                                    }
                                </tr>
                            )
                        }
                        </tbody>
                    </Table> :
                    <div className="justify-content-center align-items-center p-5">
                        <h2> No Data Found </h2>
                    </div>
                }

            </Card.Body>
        </Card>
    );
};

export default Datatable;
