import { axiosInstance as axios } from "../utility/axios";
import { setHttpParams } from "../utility/utils";

/**
 * Get all paginated data of companies
 * @param params => optional { pageOffset | page }
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAll = async params => {
    params = setHttpParams(params);
    return axios.get(`/companies?${params}`);
};


/**
 * Store new company data
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const storeCompany = async data => {
    return axios.post('/company/new', data);
};


/**
 * Update a company
 * @param data
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateCompany = async (data, id) => {
    return axios.put(`/company/${id}`, data);
};
