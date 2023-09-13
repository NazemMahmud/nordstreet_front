import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";
import LoaderComponent from "../../components/LoaderComponent";
import AddUpdateForm from "../../components/AddUpdateForm";
import Datatable from "../../components/Datatable";
import PaginationComponent from "../../components/PaginationComponent";
import ToastComponent from "../../components/ToastComponent";

import { SOMETHING_WENT_WRONG } from "../../config/constants";
import { getAll } from "../../services/company.service";
import { setHttpParams } from "../../utility/utils";

const Company = () => {
    const columns = ['Name', 'Registration Code', 'VAT', 'Address', 'Phone'];
    const actions = ['update', 'delete'];
    let responseData = {
        items: [],
        pagination: {
            has_next_page: false,
            has_previous_page: false,
            total_items: 1,
            current_page: 1,
            last_page: 1
        }
    };

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const initialParams = {
        perPage: queryParams.get("pageOffset") ?? 10,
        page: queryParams.get("page") ?? 1,
    };


    const [loadTime, setLoadTime] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [companyData, setCompanyData] = useState({});
    const [params, setParams] = useState(initialParams);
    const [dataList, setDataList] = useState([]);
    const [isSetData, setIsSetData] = useState(false);
    const [oldCompanyData, setOldCompanyData] = useState({});

    // this info will come from API if it is paginated
    const [paginationInfo, setPaginationInfo] = useState({
        from: '',
        to: '',
        total: '',
        currentPage: '',
        perPage: '',
        lastPage: '',
        pageLimit: 3,
        hasNextPage: '',
        hasPreviousPage: '',
    });



    /** Get all/paginated ip address data for table **/
    useEffect( () => {
        getDataList();
    }, [params]);

    const loaderCallback = data => {
        setIsLoading(data);
    };

    /**
     * change url at the same time api call on params, so that individual URL can be used
     */
    const changeUrl = async () => {
        // todo: need to update the navigation, if params are same as prev, no need to navigate
        const urlParams = setHttpParams(params);
        setLoadTime(1);
        navigate(location.pathname + urlParams ? '?' + urlParams : '');
    };

    /**
     * Mobile phone is stored as image, so convert it to a src of image tag
     * @param data
     * @returns {*}
     */
    const convertPhoneToImage = data => {
        data.items.forEach(item => {
            item.mobile_phone = `<img src=${item.mobile_phone} alt='Mobile Phone' />`;
        });

        return data;
    };


    const setPagination = data => {
        const from = (data.current_page - 1) * params.perPage + 1;
        let to = data.current_page * params.perPage;

        if (to > data.total_items) {
            to = data.total_items;
        }

        setPaginationInfo({
            ...paginationInfo,
            hasNextPage: data.has_next_page,
            hasPreviousPage: data.has_previous_page,
            total: data.total_items,
            currentPage: data.current_page,
            lastPage: data.last_page,
            from,
            to
        });
    };


    const getDataList = async () => {
        setIsLoading(true);
        // todo: this is being called 2 times, warning bug
        await getAll(params)
            .then(res => {
                const companies = [...res.data.data.items.map(item => ({ ...item }))];
                setCompanyData(companies);
                responseData = convertPhoneToImage(res.data.data);

                console.log('company: ', companies);
                console.log('res: ', responseData);
                setDataList(responseData.items);
                setPagination(responseData.pagination);
                setIsLoading(false);
                setIsSetData(true);
                changeUrl();
            })
            .catch(error => {
                setIsLoading(false);
                const errorMessage = error?.response?.data?.error ?? SOMETHING_WENT_WRONG;
                toast.error(<ToastComponent messages={errorMessage}/>);
            });
    };



    /**
     * populate update form
     */
    const handleEditCallback = id => {
        setIsLoading(true);
        console.log(companyData);
        const response = companyData.find(item => item.id === id);
        setOldCompanyData({ ...response });
        setIsLoading(false);

    };

    /**
     * change pagination / page id by clicking pagination component
     */
    const paginationCallback = page => {
        setParams({
            ...params,
            page: page,
        });
    };

    /**
     * After update, update data in the data table
     * @param updatedData
     */
    const updateCallback = updatedData => {
        const newDataList = [...dataList];
        const findIndex = dataList.findIndex(item => item.id == updatedData.id);
        newDataList[findIndex] = updatedData;
        setDataList([...newDataList]);
        setOldCompanyData({});
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
            <LoaderComponent isLoading={isLoading} />
            <p>Company info</p>
            <Row className="mb-5">
                <Col>
                    <Card >
                        <Card.Body>
                            {/*addCallback={addCallback}*/}
                            <AddUpdateForm updateData={oldCompanyData}
                                           updateCallback={updateCallback}
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

            {
                dataList.length ?
                    <PaginationComponent paginationInfo={paginationInfo}
                                         paginationCallback={paginationCallback}
                    /> : <></>
            }
        </DashboardLayout>
    );
};

export default Company;
