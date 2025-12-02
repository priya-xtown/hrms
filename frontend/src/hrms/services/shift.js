import { message } from 'antd';
import Api from "./api"

function extractMessage(response, defaultMsg) {
    const msg = response.data?.message || defaultMsg;
    console.log('Extracted success message:', msg);
    return msg;
}

function extractErrorMessage(error, defaultMsg) {
    let errMsg;
    if (error.response) {
        errMsg =
            error.response.data?.message ||
            error.response.data?.error ||
            (Array.isArray(error.response.data?.errors)
                ? error.response.data.errors.join(', ')
                : error.response.data?.errors) ||
            defaultMsg ||
            'Something went wrong';
    } else if (error.request) {
        errMsg = 'Network error: Unable to reach the server';
    } else {
        errMsg = error.message || 'Unexpected error occurred';
    }
    console.error('Extracted error message:', errMsg, 'Error details:', error);
    return errMsg;
}



export const shiftService = {

    getshiftAll: async (params) => {
        const response = await Api.get('shift/shift/all', { params });

        return response;

    },

    createShift: async (data) => {
        try {
            const res = await Api.post('shift/shift/create', data);
            const msg = extractMessage(res, 'shift created successfully');
            message.success(msg);
            return { success: true, data: res.data, statusCode: res.status };
        } catch (error) {
            const status = error.response?.status;
            let errMsg = extractErrorMessage(error, 'Failed to create shift');

            switch (status) {
                case 400:
                case 422:
                    errMsg = extractErrorMessage(error, 'Invalid shift data provided');
                    break;
                case 409:
                    errMsg = 'Duplicate shift. Please check your input';
                    break;
                case 429:
                    errMsg = 'Too many requests. Please wait a few minutes';
                    break;
                case 500:
                    errMsg = 'Server error. Please try again later';
                    break;
                default:
                    errMsg = extractErrorMessage(error, 'Unexpected error occurred');
            }

            message.error(errMsg);
            return { success: false, error: errMsg, statusCode: status };
        }
    },

  updateShift: async (id, data) => {
        try {
          const res = await Api.put(`/updateshift/{id}`, data);

            const msg = extractMessage(res, 'shift updated successfully');
            message.success(msg);
            return { success: true, data: res.data, statusCode: res.status };
        } catch (error) {
            const status = error.response?.status;
            let errMsg = extractErrorMessage(error, 'Failed to update shift');

            switch (status) {
                case 400:
                case 422:
                    errMsg = extractErrorMessage(error, 'Invalid shift data provided');
                    break;
                case 404:
                    errMsg = ' shift not found';
                    break;
                case 409:
                    errMsg = 'Conflict while updating  shift. Possible duplicate data';
                    break;
                case 429:
                    errMsg = 'Too many requests. Please wait a few minutes';
                    break;
                case 500:
                    errMsg = 'Server error. Please try again later';
                    break;
                default:
                    errMsg = extractErrorMessage(error, 'Unexpected error occurred');
            }

            message.error(errMsg);
            return { success: false, error: errMsg, statusCode: status };
        }
    },


    deleteShift: async (id) => {
        try {
            const res = await Api.delete(`/shift/${id}`);
            const msg = extractMessage(res, ' shift deleted successfully');
            message.success(msg);
            return { success: true, data: res.data, statusCode: res.status };
        } catch (error) {
            const status = error.response?.status;
            let errMsg = extractErrorMessage(error, 'Failed to delete  shift');

            switch (status) {
                case 400:
                    errMsg = extractErrorMessage(error, 'Invalid request for deleting  shift');
                    break;
                case 404:
                    errMsg = ' shift not found';
                    break;
                case 409:
                    errMsg = 'Conflict error. The  shift may be linked to other data';
                    break;
                case 429:
                    errMsg = 'Too many requests. Please wait a few minutes';
                    break;
                case 500:
                    errMsg = 'Server error. Please try again later';
                    break;
                default:
                    errMsg = extractErrorMessage(error, 'Unexpected error occurred');
            }

            message.error(errMsg);
            return { success: false, error: errMsg, statusCode: status };
        }
    }



    

}



