import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";
import LoaderComponent from "../../components/LoaderComponent";
import AddUpdateForm from "../../components/AddUpdateForm";
import Datatable from "../../components/Datatable";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import PaginationComponent from "../../components/PaginationComponent";
import ToastComponent from "../../components/ToastComponent";

import { SOMETHING_WENT_WRONG } from "../../config/constants";
import {deleteCompany, getAll} from "../../services/company.service";
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


    const [isLoading, setIsLoading] = useState(true);
    const [companyData, setOriginalCompanyData] = useState({});
    const [params, setParams] = useState(initialParams);
    const [dataList, setDataList] = useState([]);
    const [isSetData, setIsSetData] = useState(false);
    const [oldCompanyData, setOldCompanyData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState('');

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

    /** Get all/paginated data for table **/
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
        navigate(location.pathname + urlParams ? '?' + urlParams : '');
    };

    /**
     * Mobile phone is stored as image, so convert it to a src of image tag
     * @param data
     * @returns {*}
     */
    const convertPhoneToImage = data => {
        if(data.hasOwnProperty('items')) {
            data.items.forEach(item => {
                item.mobile_phone = `<img src=${item.mobile_phone} alt='Mobile Phone' />`;
            });
        } else {
            data.mobile_phone = `<img src=${data.mobile_phone} alt='Mobile Phone' />`;
        }

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
                setOriginalCompanyData(companies);
                responseData = convertPhoneToImage(res.data.data);

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
        const singleCompany =  Object.assign({}, updatedData) ;
        const companies = [...companyData];
        let findIndex = companyData.findIndex(item => item.id == singleCompany.id);
        companies[findIndex] = singleCompany;
        setOriginalCompanyData(companies);

        const newDataList = [...dataList];
        findIndex = dataList.findIndex(item => item.id == updatedData.id);
        newDataList[findIndex] = convertPhoneToImage(updatedData);
        setDataList([...newDataList]);

        setOldCompanyData({});
        setIsLoading(false);
    };


    /**
     * on click delete confirmation modal at first
     */
    const handleDelete = (id) => {
        setDeleteId(id);
        setShowModal(!showModal);
    };

    /**
     * Delete data through API
     */
    const handleDeleteConfirm = async () => {
        setShowModal(!showModal);
        setIsLoading(true);

        await deleteCompany(deleteId)
            .then(res => {
                const companies = [...companyData];
                const updatedCompanies = companies.filter(item => item.id !== deleteId);
                setOriginalCompanyData(updatedCompanies);

                const newDataList = [...dataList];
                const updatedList = newDataList.filter(item => item.id !== deleteId);
                setDataList(updatedList);
                setPaginationInfo({
                    ...paginationInfo,
                    total: paginationInfo.total - 1,
                    to: paginationInfo.from == 1 ? paginationInfo.to - 1 : paginationInfo.to
                });
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                const errorMessage = error?.response?.data?.error ?? SOMETHING_WENT_WRONG;
                toast.error(<ToastComponent messages={errorMessage}/>);
            });
    };

    /**
     * After add, update data table
     * Show the new data at top
     * Update pagination info
     * @param data
     */
    const addCallback = data => {
        console.log('data: ', data);
        if (params.page == 1) {
            const singleCompany =  Object.assign({}, data.data);
            const companies = [...companyData];
            companies.unshift(singleCompany);
            setOriginalCompanyData(companies);

            const newDataList = [...dataList];
            newDataList.unshift(convertPhoneToImage(data.data));
            setDataList([...newDataList]);
            // "id": 8,
            //     "name": "ZXCV Company",
            //     "registration_code": "987654322",
            //     "vat": "302801468",
            //     "address": "Test Address",
            //     "mobile_phone": "https://rekvizitai.vz.lt/timages/%3DHGZ1VQAmVQV1NPZ3ZmX.gif"

            setPaginationInfo({
                ...paginationInfo,
                to: paginationInfo.to + 1,
                total: paginationInfo.total + 1,
            });
            setIsLoading(false);
        } else {
            setParams({
                ...params,
                page: 1,
            });
        }

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
                            <AddUpdateForm addCallback={addCallback}
                                           updateData={oldCompanyData}
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
                                       handleDeleteCallback={handleDelete}
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

            {
                showModal ?
                    <DeleteConfirmation isOpen={showModal}
                                        deleteCallback={handleDeleteConfirm}
                                        closeCallback={() => setShowModal(!showModal)}

                    /> : <></>
            }
        </DashboardLayout>
    );
};

export default Company;
