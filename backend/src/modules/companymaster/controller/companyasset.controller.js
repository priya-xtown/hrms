
import { Op } from "sequelize";
// import Attendance from "../attendance.models/attendance.models.js"; // fixed folder/file name
import BaseService from "../../../services/service.js";


// =======
import CompanyAsset from "../models/companyasset.model.js";
// import BaseService from "../../../services/service.js";


const companyAssetService = new BaseService(CompanyAsset);

// Create Asset
export const createCompanyAsset  = async (req, res) => {
  try {
    const data = req.body;
    const newAsset = await companyAssetService.create(data);

    return res.status(201).json({
      message: "Asset created successfully",
      data: newAsset,
    });
  } catch (error) {
    console.error("Error creating asset:", error);
    return res.status(500).json({
      message: "Failed to create asset",
      error: error.message,
    });
  }
};

// Get All Assets
export const getAllCompanyAssets = async (req, res) => {
  try {
    const result = await companyAssetService.getAll({
      searchFields: ["asset_name", "asset_type", "status"],
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch assets",
      error: error.message,
    });
  }
};

// Get Asset by ID
export const  getCompanyAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await companyAssetService.getById(id);
    return res.status(200).json(record);
  } catch (error) {
    return res.status(404).json({ message: "Asset not found" });
  }
};

// Update Asset
export const  updateCompanyAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await companyAssetService.update(id, req.body);

    return res.status(200).json({
      message: "Asset updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update asset",
      error: error.message,
    });
  }
};

// Delete Asset
export const  deleteCompanyAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await companyAssetService.delete(id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete asset",
      error: error.message,
    });
  }
};

export default {
  createCompanyAsset,
  getAllCompanyAssets,
  getCompanyAssetById,
  updateCompanyAsset,
  deleteCompanyAsset,
};

