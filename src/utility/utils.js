/**
 * Check submit button should remain disabled or not
 * @param formInput
 * @returns {boolean}
 */
export const checkDisableButton = formInput => {
    for (const property in formInput) {
        if (!formInput[property].isValid) {
            return true;
        }
    }
    return false;
};



/**
 * format HTTP query params before send with API
 * @param params
 * @returns {string}
 */
export const setHttpParams = (params) => {
    // delete key, if key has no value or value = null
    Object.keys(params).forEach(key => (params[key] == null || params[key] == "") && delete params[key]);

    let length = Object.keys(params).length;
    let param = "";
    for (const [key, value] of Object.entries(params)) {
        param = param + `${key}=${value}`;
        length = length - 1;
        param = length ? param + "&" : param;
    }
    return param;
};
