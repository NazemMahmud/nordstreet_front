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
import PaginationComponent from "../../components/PaginationComponent";

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
        pageLimit: 3,
        hasNextPage: '',
        hasPreviousPage: '',
    });



    /** Get all/paginated ip address data for table **/
    useEffect( () => {
        changeUrl();
    }, [params]);

    const loaderCallback = data => {
        setIsLoading(data);
    };

    /**
     * change url at the same time api call on params, so that individual URL can be used
     */
    const changeUrl = () => {
        // todo: need to update the navigation, if params are same as prev, no need to navigate
        const urlParams = setHttpParams(params);
        getDataList();
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
                responseData = convertPhoneToImage(res.data.data);
                console.log('res: ', responseData);
                setDataList(responseData.items);
                setPagination(responseData.pagination);

                setIsLoading(false);
                setIsSetData(true);
            })
            .catch(error => {
                setIsLoading(false);
                const errorMessage = error?.response?.data?.error ?? SOMETHING_WENT_WRONG;
                toast.error(<ToastComponent messages={errorMessage}/>);
            });
    };


    /**
     * Call API & populate update form
     */
    const handleEditCallback = async id => {
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
