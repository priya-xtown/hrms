import Api from "./api";
import { message } from "antd";
function extractMessage(response, defaultMsg) {
  const msg = response.data?.message || defaultMsg;
  console.log("Extracted success message:", msg);
  return msg;
}

function extractErrorMessage(error, defaultMsg) {
  let errMsg;
  if (error.response) {
    errMsg =
      error.response.data?.message ||
      error.response.data?.error ||
      (Array.isArray(error.response.data?.errors)
        ? error.response.data.errors.join(", ")
        : error.response.data?.errors) ||
      defaultMsg ||
      "Something went wrong";
  } else if (error.request) {
    errMsg = "Network error: Unable to reach the server";
  } else {
    errMsg = error.message || "Unexpected error occurred";
  }
  console.error("Extracted error message:", errMsg, "Error details:", error);
  return errMsg;
}

export const shiftconfigService = {
  getshiftAll: async (params) => {
    const response = await Api.get("/hrms/shiftconfig", { params });
    return response;
  },

  createShiftconfig: async (data) => {
    try {
      const res = await Api.post("/hrms/shiftconfig", data);
      const msg = extractMessage(
        res,
        "ShiftConfiguration created successfully"
      );
      message.success(msg);
      return { success: true, data: res.data, statusCode: res.status };
    } catch (error) {
      const status = error.response?.status;
      let errMsg = extractErrorMessage(error, "Failed to create shiift configuration");

      switch (status) {
        case 400:
        case 422:
          errMsg = extractErrorMessage(
            error,
            "Invalid ShiftConfiguration data provided"
          );
          break;
        case 409:
          errMsg = "Duplicate ShiftConfiguration. Please check your input";
          break;
        case 429:
          errMsg = "Too many requests. Please wait a few minutes";
          break;
        case 500:
          errMsg = "Server error. Please try again later";
          break;
        default:
          errMsg = extractErrorMessage(error, "Unexpected error occurred");
      }

      message.error(errMsg);
      return { success: false, error: errMsg, statusCode: status };
    }
  },
};
