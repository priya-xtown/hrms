// import express from "express";
// const router = express.Router();

// import {
//   createCompanyAsset,
//   getAllCompanyAssets,
//   getCompanyAssetById,
//   updateCompanyAsset,
//   deleteCompanyAsset,
// } from "../controller/companyasset.controller.js";

// import {
//   createCompanyAssetSchema,
//   updateCompanyAssetSchema,
//   idSchema,
// } from "../dto/companyasset.zod.js";

// import { validate } from "../../middleware/validate.js";

// // ✅ Create Company Asset
// router.post("/createCompanyAssett", validate(createCompanyAssetSchema), createCompanyAsset);

// // ✅ Get all Company Assets
// router.get("/getAllCompanyAssets", getAllCompanyAssets);

// // ✅ Get Company Asset by ID
// router.get("/getCompanyAssetById/:id", validate(idSchema, "params"), getCompanyAssetById);

// // ✅ Update Company Asset by ID
// router.put("/updateCompanyAsset/:id", validate(updateCompanyAssetSchema), updateCompanyAsset);

// // ✅ Delete Company Asset by ID (soft delete)
// router.delete("/deleteCompanyAsset/:id", validate(idSchema, "params"), deleteCompanyAsset);

// export default router;


import { Router } from "express";
import companyassetController from "../controller/companyasset.controller.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";

import {
  createCompanyAssetSchema,
  updateCompanyAssetSchema,
  idSchema,
} from "../dto/companyasset.zod.js";

const router = Router();

// ----------------------------------------
// CREATE COMPANY ASSET
// ----------------------------------------
router.post(
  "/companyasset/create",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  validate(createCompanyAssetSchema),
  companyassetController.createCompanyAsset
);

// ----------------------------------------
// GET ALL
// ----------------------------------------
router.get(
  "/companyasset/all",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  companyassetController.getAllCompanyAssets
);

// ----------------------------------------
// GET BY ID
// ----------------------------------------
router.get(
  "/companyasset/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  validate(idSchema, "params"),
  companyassetController.getCompanyAssetById
);

// ----------------------------------------
// UPDATE
// ----------------------------------------
router.put(
  "/companyasset/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate(updateCompanyAssetSchema),
  companyassetController.updateCompanyAsset
);

// ----------------------------------------
// DELETE
// ----------------------------------------
router.delete(
  "/companyasset/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate(idSchema, "params"),
  companyassetController.deleteCompanyAsset
);

export default router;
