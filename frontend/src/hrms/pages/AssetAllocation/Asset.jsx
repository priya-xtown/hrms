import React, { useState, useMemo } from "react";
import { DatePicker, Modal, Tabs, Input, Button } from "antd";
import dayjs from "dayjs";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

export default function AssetMaster() {
  const [activeTab, setActiveTab] = useState("company");

  const [companyAssets, setCompanyAssets] = useState([]);
  const [companyForm, setCompanyForm] = useState({
    assetId: "",
    assetType: "",
    customAssetType: "",
    purchasedDate: "",
    serialNumber: "",
    model: "",
    condition: "",
    status: "",
    notes: "",
    value: "",
  });

  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const assetTypes = ["Laptop", "Desktop", "Mac", "Other"];
  const conditions = ["New", "Refurbished"];
  const statuses = ["Active", "Inactive", "Returned", "Lost"];
  const modelBrands = [
    "ACER", "APPLE", "HP", "DELL", "LENOVO", "MICROSOFT",
    "SAMSUNG", "MSI", "GIGABYTE", "TOSHIBA", "LG", "SONY", "ASUS",
  ];

  const formatDisplayDate = (date) => {
    if (!date) return "";
    return dayjs(date, "DD/MM/YYYY").isValid()
      ? dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY")
      : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = () => {
    setCompanyForm({
      assetId: "",
      assetType: "",
      customAssetType: "",
      purchasedDate: "",
      serialNumber: "",
      model: "",
      condition: "",
      status: "",
      notes: "",
      value: "",
    });
    setErrors({});
    setEditIndex(null);
  };

  const handleAdd = () => {
    const newErrors = {};
    Object.keys(companyForm).forEach((key) => {
      if (key === "customAssetType" && companyForm.assetType !== "Other") return;
      if (!companyForm[key] || companyForm[key].toString().trim() === "") {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalAssetType =
      companyForm.assetType === "Other"
        ? companyForm.customAssetType
        : companyForm.assetType;

    const newAsset = {
      ...companyForm,
      assetType: finalAssetType,
      value: parseFloat(companyForm.value) || 0,
      // employeeId and employeeName will remain undefined for now
    };

    if (editIndex !== null) {
      const updated = [...companyAssets];
      updated[editIndex] = newAsset;
      setCompanyAssets(updated);
    } else {
      setCompanyAssets([...companyAssets, newAsset]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setCompanyForm(companyAssets[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setCompanyAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredData = useMemo(() => {
    const filtered = companyAssets.filter((a) => {
      const matchesSearch =
        (a.assetId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType ? a.assetType === filterType : true;
      return matchesSearch && matchesFilter;
    });
    return filtered;
  }, [companyAssets, searchQuery, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCompanyValue = companyAssets.reduce(
    (acc, a) => acc + (a.value || 0),
    0
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-2xl shadow-xl">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          resetForm();
        }}
        items={[
          { label: "Company Assets", key: "company" },
          { label: "Employee Assets", key: "employee" },
        ]}
      />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-4 mb-6">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-purple-500">
          {activeTab === "company" ? "Company Assets" : "Employee Assets"}
        </h1>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <input
            type="text"
            placeholder="Search by ID or Serial..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-0"
          />

          {activeTab === "company" && (
            <>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-0"
              >
                <option value="">All Types</option>
                {assetTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:scale-105 transition"
              >
                + Add
              </button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              {activeTab === "employee" && (
                <>
                  <th className="border border-gray-100 p-4 text-left">Employee ID</th>
                  <th className="border border-gray-100 p-4 text-left">Employee Name</th>
                </>
              )}
              <th className="border border-gray-100 p-4 text-left">Asset ID</th>
              <th className="border border-gray-100 p-4 text-left">Asset Type</th>
              <th className="border border-gray-100 p-4 text-left">Serial</th>
              <th className="border border-gray-100 p-4 text-left">Model</th>
              <th className="border border-gray-100 p-4 text-left">Condition</th>
              <th className="border border-gray-100 p-4 text-left">Status</th>
              <th className="border border-gray-100 p-4 text-left">Purchased</th>
              <th className="border border-gray-100 p-4 text-left">Value</th>
              <th className="border border-gray-100 p-4 text-left">Notes</th>
              {activeTab === "company" && (
                <th className="border border-gray-100 p-4 text-left">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-gray-700 transition">
                  {activeTab === "employee" && (
                    <>
                      <td className="border p-3">{a.employeeId || "-"}</td>
                      <td className="border p-3">{a.employeeName || "-"}</td>
                    </>
                  )}
                  <td className="border p-3">{a.assetId}</td>
                  <td className="border p-3">{a.assetType}</td>
                  <td className="border p-3">{a.serialNumber}</td>
                  <td className="border p-3">{a.model}</td>
                  <td className="border p-3">{a.condition}</td>
                  <td className="border p-3">{a.status}</td>
                  <td className="border p-3">{formatDisplayDate(a.purchasedDate)}</td>
                  <td className="border p-3">₹{a.value}</td>
                  <td className="border p-3">{a.notes}</td>
                  {activeTab === "company" && (
                    <td className="border p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === "company" ? 10 : 11} className="text-center p-6 text-gray-400 italic">
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {activeTab === "company" && (
          <div className="mt-3 font-bold text-gray-700">
            Total Asset Value: ₹{totalCompanyValue.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="px-4 py-2 border rounded">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {activeTab === "company" && isModalOpen && (
        <Modal
          title={editIndex !== null ? "Edit Asset" : "Add Asset"}
          open={isModalOpen}
          onCancel={() => {
            resetForm();
            setIsModalOpen(false);
          }}
          footer={null}
          width={800}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Asset ID", name: "assetId", type: "text" },
              { label: "Asset Type", name: "assetType", type: "select", options: assetTypes },
              { label: "Custom Asset Type", name: "customAssetType", type: "text", condition: companyForm.assetType === "Other" },
              { label: "Purchased Date", name: "purchasedDate", type: "date" },
              { label: "Serial Number", name: "serialNumber", type: "text" },
              { label: "Model", name: "model", type: "modelSelect" },
              { label: "Condition", name: "condition", type: "select", options: conditions },
              { label: "Status", name: "status", type: "select", options: statuses },
              { label: "Value", name: "value", type: "number" },
            ].map((field) => {
              if (field.name === "customAssetType" && !field.condition) return null;
              return (
                <div key={field.name}>
                  <label className="font-semibold">{field.label}</label>
                  {field.type === "text" || field.type === "number" ? (
                    <Input
                      type={field.type}
                      name={field.name}
                      value={companyForm[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label}`}
                      disabled={field.name === "customAssetType" && companyForm.assetType !== "Other"}
                    />
                  ) : field.type === "modelSelect" ? (
                    <select
                      name="model"
                      value={companyForm.model}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select Model</option>
                      {modelBrands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  ) : field.type === "select" ? (
                    <select
                      name={field.name}
                      value={companyForm[field.name]}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "date" ? (
                    <DatePicker
                      format="DD/MM/YYYY"
                      value={companyForm[field.name] ? dayjs(companyForm[field.name], "DD/MM/YYYY") : null}
                      onChange={(date, ds) => setCompanyForm(prev => ({ ...prev, [field.name]: ds }))}
                      className="w-full"
                    />
                  ) : null}
                  {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                </div>
              );
            })}

            <div className="col-span-2">
              <label className="font-semibold">Notes</label>
              <Input.TextArea
                name="notes"
                value={companyForm.notes}
                onChange={handleChange}
                placeholder="Add notes"
              />
              {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleAdd}>
              {editIndex !== null ? "Update" : "Add"} Asset
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

