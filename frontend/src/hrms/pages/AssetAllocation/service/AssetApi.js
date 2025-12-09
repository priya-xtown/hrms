import api from "../../services/api.js";

export const assetService = {

  // Create Asset
  createAsset: (data) =>
    api.post("company/companyasset/create", data),

  // Get All Assets with pagination
  getAllAssets: (page = 1, limit = 10) =>
    api.get(`asset/companyasset/all?page=${page}&limit=${limit}`),

  // Get Asset by ID
  getAssetById: (id) =>
    api.get(`asset/companyasset/${id}`),

  // Update Asset (POST like shift)
  updateAsset: (id, data) =>
    api.post(`asset/companyasset/update/${id}`, data),

  // Delete Asset (GET like shift)
  deleteAsset: (id) =>
    api.get(`asset/companyasset/delete/${id}`),
};
