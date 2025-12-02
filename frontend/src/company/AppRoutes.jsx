// CompanyRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Page components (make sure these are default exports in their respective files)
import Company from "./pages/Company";
import Branch from "./pages/Branch.jsx";
import Department from "./pages/Department";
import DivisionPage from "./pages/DivisionMaster";

// Ant Design icons
import {
  BankOutlined,
  BranchesOutlined,
  ApartmentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

// Menu items for sidebar or navigation
export const companyMenuItems = [
  {
    icon: <BankOutlined />,
    key: "/company/company",
    label: "Company",
  },
  {
    icon: <BranchesOutlined />,
    key: "/company/branch",
    label: "Branch",
  },
  {
    icon: <ApartmentOutlined />,
    key: "/company/department",
    label: "Department",
  },
  {
    icon: <ShareAltOutlined />,
    key: "/company/division",
    label: "Division",
  },
];

const CompanyRoutes = () => {
  return (
    <Routes>
      <Route path="company" element={<Company />} />
      <Route path="branch" element={<Branch />} />
      <Route path="department" element={<Department />} />
      <Route path="division" element={<DivisionPage />} />
    </Routes>
  );
};

export default CompanyRoutes;
