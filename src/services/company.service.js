import { axiosInstance as axios } from "../utility/axios";
import { setHttpParams } from "../utility/utils";

/**
 * Get all paginated data of companies
 * @param params => optional { pageOffset | page | orderBy | sortBy }
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAll = async params => {
    params = setHttpParams(params);
    return axios.get(`api/companies?${params}`);
};


/**
 * Get single data
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSingle = async id => {
    return axios.get(`api/company/${id}`);
};


/**
 * Store new company data
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const storeCompany = async data => {
    return axios.post('api/company/new', data);
};


/**
 * Update an company
 * @param data
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateCompany = async (data, id) => {
    return axios.patch(`api/company/new/${id}`, data);
};
