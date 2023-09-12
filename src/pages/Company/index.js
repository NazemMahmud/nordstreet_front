import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import LoaderComponent from "../../components/LoaderComponent";
import { Card, Col, Row } from "react-bootstrap";
import AddUpdateForm from "../../components/AddUpdateForm";
import { SOMETHING_WENT_WRONG } from "../../config/constants";
import ToastComponent from "../../components/ToastComponent";
import { getAll, getSingle } from "../../services/company.service";
import { useLocation, useNavigate } from "react-router-dom";
import { setHttpParams } from "../../utility/utils";
import Datatable from "../../components/Datatable";

const Company = () => {
    const columns = ['Name', 'Registration Code', 'VAT', 'Address', 'Phone'];
    const actions = ['update', 'delete'];

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const initialParams = {
        perPage: queryParams.get("pageOffset") ?? 10,
        page: queryParams.get("page") ?? 1
    };



    const [isLoading, setIsLoading] = useState(true);
    const [companyData, setCompanyData] = useState({});
    const [params, setParams] = useState(initialParams);
    const [dataList, setDataList] = useState([]);
    const [isSetData, setIsSetData] = useState(false);

    // this info will come from API if it is paginated
    const [paginationInfo, setPaginationInfo] = useState({
        from: '',
        to: '',
        total: '',
        currentPage: '',
        perPage: '',
        lastPage: '',
        pageLimit: 3
    });



    /** Get all/paginated ip address data for table **/
    useEffect( () => {
        getDataList();
    }, [params]);

    const loaderCallback = data => {
        setIsLoading(data);
    };

    /**
     * change url at the same time api call on params
     * so that individual URL can be used
     */
    const changeUrl = () => {
        const urlParams = setHttpParams(params);
        navigate(location.pathname + urlParams ? '?' + urlParams : '');
    };

    const getDataList = async () => {
        setIsLoading(true);
        const response = {
            "success": true,
            "data": {
                "items": [
                    {
                        "id": 8,
                        "name": "ZXCV Company",
                        "registration_code": "987654322",
                        "vat": "302801468",
                        "address": "Test Address",
                        "mobile_phone": "<img src='https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif' alt='Mobile Phone' />"
                    },
                    {
                        "id": 7,
                        "name": "DEF Company \"title VŠĮ\"",
                        "registration_code": "302801467",
                        "vat": "987654321",
                        "address": "Miško g. 25 Vilnius ",
                        "mobile_phone": "<img src='https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif' alt='Mobile Phone' />"
                    },
                    {
                        "id": 6,
                        "name": "ABCD Company \"title VŠĮ\"",
                        "registration_code": "302801466",
                        "vat": "987654321",
                        "address": "Miško g. 25 Vilnius ",
                        "mobile_phone": "<img src='https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif' alt='Mobile Phone' />"
                    },
                    {
                        "id": 3,
                        "name": "ABCD Company",
                        "registration_code": "302801463",
                        "vat": "987654322",
                        "address": "Test Address",
                        "mobile_phone": "<img src='https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif' alt='Mobile Phone' />"
                    },
                    {
                        "id": 2,
                        "name": "ABCD Company \"title VŠĮ\"",
                        "registration_code": "302801462",
                        "vat": "987654321",
                        "address": "Miško g. 25 Vilnius ",
                        "mobile_phone": "<img src='https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif' alt='Mobile Phone' />"
                    },
                    {
                        "id": 1,
                        "name": "ABCD Company \"title VŠĮ\"",
                        "registration_code": "302801461",
                        "vat": "987654321",
                        "address": "Miško g. 25 Vilnius ",
                        "mobile_phone": "<img src='https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif' alt='Mobile Phone' />"
                    }
                ],
                "pagination": {
                    "total_items": 13,
                    "current_page": 2,
                    "last_page": 2,
                    "has_previous_page": true,
                    "has_next_page": false
                }
            }
        };
        setDataList(response.data.items);
        setIsLoading(false);
        setIsSetData(true);
        /*await getAll(params)
            .then(res => {
                const response = res.data;
                console.log(response);
                setDataList(response.data);

                // setPaginationInfo({
                //     ...paginationInfo,
                //     from: response.meta.from,
                //     to: response.meta.to,
                //     total: response.meta.total,
                //     currentPage: response.meta.current_page,
                //     perPage: response.meta.per_page,
                //     lastPage: response.meta.last_page
                // });
                setIsLoading(false);
                setIsSetData(true);
                changeUrl();
            })
            .catch(error => {
                setIsLoading(false);
                const errorMessage = error?.response?.data?.error ?? SOMETHING_WENT_WRONG;
                toast.error(<ToastComponent messages={errorMessage}/>);
            });*/
    };


    /**
     * Call API & populate update form
     */
    const handleEditCallback = async id => {
        setIsLoading(false);
    };

    return (
        <DashboardLayout logoutCallback={loaderCallback}>
            <ToastContainer position={"top-right"}
                            autoClose={3000}
                            hideProgressBar={false}
                            closeOnClick
                            pauseOnFocusLoss
                            draggable/>
            {/*todo*/}
            <LoaderComponent isLoading={false} />
            <p>Company info</p>
            <Row className="mb-5">
                <Col>
                    <Card >
                        <Card.Body>
                            {/*addCallback={addCallback}*/}
                            {/*updateCallback={updateCallback}*/}
                            <AddUpdateForm updateData={companyData}
                                           loaderCallback={loaderCallback} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    {
                        isSetData ?
                            <Datatable data={dataList}
                                       columns={columns}
                                       handleEditCallback={handleEditCallback}
                                       actions={actions} /> : <></>
                    }
                </Col>
            </Row>
        </DashboardLayout>
    );
};

export default Company;
