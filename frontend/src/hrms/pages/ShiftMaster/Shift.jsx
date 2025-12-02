// ========================================================
// ================ SHIFT PAGE (LIST + TABLE) ==============
// ========================================================

import { useState, useEffect } from "react";
import {
  Table,
  Dropdown,
  Input,
  Popover,
  Button,
  Select,
  message,
  Tag,
  Space,
  Switch,  Card,
   Popconfirm,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SettingOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { shiftService } from "./ShiftApi.js";

const { Option } = Select;



// =====================================================================
// ========================= FILTER SECTION START =======================
// =====================================================================

const getUniqueValues = (data, key) => {
  if (key === "status") {
    return [...new Set(data.map((item) => item[key]))].filter(Boolean);
  }
  return [];
};

const FiltersPopover = ({ onApply, dataSource, currentFilters }) => {
  const [filters, setFilters] = useState({
    status: currentFilters.status,
  });

  const statuses = getUniqueValues(dataSource, "status");

  const onChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderPopoverContent = (field) => {
    let options = [];
    if (field === "status") {
      options = statuses;
    }

    return (
      <div>
        <div style={{ marginBottom: 3, fontWeight: "bold", color: "#555" }}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </div>
        <Select
          value={filters[field]}
          onChange={(val) => onChange(field, val)}
          placeholder={`Select ${
            field.charAt(0).toUpperCase() + field.slice(1)
          }`}
          style={{ width: 180 }}
          allowClear
        >
          {options.map((opt) => (
            <Option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()}
            </Option>
          ))}
        </Select>
      </div>
    );
  };
// =====================================================================
// ========================== FILTER SECTION END ========================
// =====================================================================

  return (
    <div style={{ padding: 10, width: 200, height: "auto" }}>
      {["status"].map((field) => (
        <div key={field} style={{ marginBottom: 15 }}>
          <Popover
            content={renderPopoverContent(field)}
            trigger="hover"
            placement="right"
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                width: 100,
                color: filters[field] ? "#1890ff" : "inherit",
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {filters[field] && (
                <span className="ml-2 text-xs text-gray-500">(1)</span>
              )}
            </div>
          </Popover>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 20 }} className="space-x-2">
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={Object.values(filters).every((val) => !val)}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={Object.values(filters).every((val) => !val)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};



// =====================================================================
// ======================== SHIFT GET ALL START =========================
// =====================================================================

const Shift = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    status: undefined,
  });
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showCustomButton } = useTheme();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const localStorageKey = "shiftVisibleColumns";

  // View Mode (Table / Card)
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("shiftViewMode") || "table"
  );
  useEffect(() => {
    localStorage.setItem("shiftViewMode", viewMode);
  }, [viewMode]);

  // Visible Columns
  // const [visibleColumns, setVisibleColumns] = useState(() => {
  //   const stored = localStorage.getItem(localStorageKey);
  //   return stored
  //     ? JSON.parse(stored)
  //     : [
  //         "serialNumber",
  //         "shift_name",
  //         "start_time",
  //         "end_time",
  //         "status",
  //         "action",
  //       ];
  // });

  const [visibleColumns, setVisibleColumns] = useState([
  "serialNumber",
  "shift_name",
  "start_time",
  "end_time",
  "break_start_time",
  "break_end_time",
  "total_hours",
  "status",
  "action",
]);


  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(visibleColumns));
  }, [visibleColumns]);


  // ======================== FETCH SHIFTS API (GET ALL) =======================
  const fetchShift = async (
    paginationParams = pagination,
    search = searchText,
    appliedFilters = filters
  ) => {
    setLoading(true);

    try {
      // GET ALL SHIFTS - API CALL
      const response = await shiftService.getAllShifts();

      let data = response.data.data || [];

      // Search filter
      if (search) {
        data = data.filter((item) =>
          item.shift_name?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Status filter
      if (appliedFilters.status) {
        data = data.filter((item) => item.status === appliedFilters.status);
      }

      // Pagination (Frontend)
      const start = (paginationParams.current - 1) * paginationParams.pageSize;
      const end = start + paginationParams.pageSize;
      const paginatedData = data.slice(start, end);

      setShiftData(paginatedData);

      setPagination({
        current: paginationParams.current,
        pageSize: paginationParams.pageSize,
        total: data.length,
      });

    } catch (error) {
      console.error("Error fetching shift data:", error);
      messageApi.error("Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  };
  // ========================= GET ALL SHIFTS END ==============================


  // INITIAL LOAD
  useEffect(() => {
    fetchShift();
  }, []);


  // FORM SUCCESS MESSAGE AFTER ADD/EDIT
  useEffect(() => {
    if (location.state?.message) {
      messageApi.success(location.state.message);
      const { message, ...rest } = location.state;
      window.history.replaceState({ ...rest }, document.title);
    }
  }, [location.state, messageApi]);


  // SEARCH FUNCTION
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchShift({ ...pagination, current: 1 }, value, filters);
  };

  // APPLY FILTERS
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchShift({ ...pagination, current: 1 }, searchText, newFilters);
  };

  // PAGINATION CHANGE
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchShift(newPagination, searchText, filters);
  };

  // ========================= EDIT SHIFT END ==================================

const handleEdit = async (record) => {
  try {
    const id = record.shift_id;

    if (!id) {
      messageApi.error("Invalid shift ID");
      return;
    }

    const response = await shiftService.getShiftById(id);
    const shiftData = response?.data?.data;

    if (!shiftData) {
      messageApi.error("Failed to load shift details");
      return;
    }

    messageApi.success("Shift loaded successfully");

    navigate("/hrms/pages/createshift", {
      state: {
        isEdit: true,
        initialValues: shiftData,
      },
    });

  } catch (error) {
    messageApi.error(
      error?.response?.data?.message || "Failed to load shift details"
    );
  }
};


// ========================= DELETE SHIFT START ================================
const handleDelete = async (record) => {
  try {
    const id = record.shift_id;

    if (!id) {
      messageApi.error("Invalid shift ID");
      return;
    }

    await shiftService.deleteShift(id);
    messageApi.success("Shift deleted successfully");
    fetchShift();
  } catch (error) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete shift";

    messageApi.error(errMsg);
  }
};



  const allColumns = [
  {
    title: "S.No",
    key: "serialNumber",
    width: 70,
    render: (_, _record, index) =>
      (pagination.current - 1) * pagination.pageSize + index + 1,
  },
  {
    title: "Shift Name",
    key: "shift_name",
    dataIndex: "shift_name",
    render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
  },
  {
    title: "Start Time",
    key: "start_time",
    dataIndex: "start_time",
    render: (text) => (text ? text.slice(0, 5) : "--:--"),
  },
  {
    title: "End Time",
    key: "end_time",
    dataIndex: "end_time",
    render: (text) => (text ? text.slice(0, 5) : "--:--"),
  },
  {
    title: "Break Start",
    key: "break_start_time",
    dataIndex: "break_start_time",
    render: (text) => (text ? text.slice(0, 5) : "--:--"),
  },
  {
    title: "Break End",
    key: "break_end_time",
    dataIndex: "break_end_time",
    render: (text) => (text ? text.slice(0, 5) : "--:--"),
  },
  {
    title: "Total Hours",
    key: "total_hours",
    dataIndex: "total_hours",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (text) => (
      <Tag color={text === "active" ? "green" : "red"}>
        {text.charAt(0).toUpperCase() + text.slice(1)}
      </Tag>
    ),
  },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Delete?"
           onConfirm={() => handleDelete(record)}

            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  // {
  //   title: "Action",
  //   key: "action",
  //   render: (_, rec) => (
  //     <Dropdown
  //       menu={{

  //         items: [
  //           // { key: "view", icon: <EyeOutlined />, label: "View", onClick: () => handleMenuClick(rec, { key: "view" }) },
  //           { key: "edit", icon: <EditOutlined />, label: "Edit", onClick: () => handleMenuClick(rec, { key: "edit" }) },
  //           { key: "delete", icon: <DeleteOutlined />, label: "Delete", onClick: () => handleMenuClick(rec, { key: "delete" }) },
  //         ],
  //       }}
  //       trigger={["click"]}
  //     >
  //       <EllipsisOutlined className="cursor-pointer text-lg rotate-90" />
  //     </Dropdown>
  //   ),
  // },
];

  // ====================== ALL TABLE COLUMNS END ============================

  // Filter visible columns
  const columns = allColumns.filter((col) =>
    visibleColumns.includes(col.dataIndex || col.key)
  );

  // ======================= TABLE SECTION START ==========================

  return (
    <>
      {contextHolder}
      <div className="max-w-full overflow-hidden">
        <div className="bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-xl">Shift</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-[250px] min-w-[200px]">
                <Input.Search
                  placeholder="Search by name"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full"
                  allowClear
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
                <Popover
                  content={
                    <FiltersPopover
                      dataSource={shiftData}
                      currentFilters={filters}
                      onApply={handleFilterApply}
                    />
                  }
                  trigger="click"
                  placement="bottomLeft"
                >
                  <Button
                    icon={<FilterOutlined />}
                    className="w-full sm:w-auto"
                  >
                    Filters
                  </Button>
                </Popover>

                {/* ======================= ADD SHIFT BUTTON (CREATE) ======================= */}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/hrms/pages/createshift")}
                >
                  Add Shift
                </Button>
                {/* ======================= ADD SHIFT END ================================ */}

                {/* COLUMN SETTINGS */}
                {showCustomButton && (
                  <Dropdown
                    menu={{
                      items: allColumns.map((col) => ({
                        key: col.dataIndex || col.key,
                        label: (
                          <Space>
                            <Switch
                              checked={visibleColumns.includes(
                                col.dataIndex || col.key
                              )}
                              onChange={(checked) => {
                                if (checked) {
                                  setVisibleColumns([
                                    ...visibleColumns,
                                    col.dataIndex || col.key,
                                  ]);
                                } else {
                                  setVisibleColumns(
                                    visibleColumns.filter(
                                      (k) => k !== (col.dataIndex || col.key)
                                    )
                                  );
                                }
                              }}
                            />
                            {col.title}
                          </Space>
                        ),
                      })),
                    }}
                  >
                    <Button icon={<SettingOutlined />}></Button>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================= TABLE VIEW START ============================ */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={shiftData}
              size="small"
              pagination={{
                ...pagination,
                responsive: true,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={handleTableChange}
              rowKey="shift_id"
              scroll={{ x: "max-content" }}
              className="w-full"
              loading={loading}
              components={{
                header: {
                  cell: (props) => (
                    <th
                      {...props}
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        padding: "8px 8px",
                        whiteSpace: "nowrap",
                      }}
                    />
                  ),
                },
              }}
            />
          </div>
        ) : (
          <>
            {/* ========================= CARD VIEW START ============================ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {shiftData.length ? (
                shiftData.map((rec, idx) => (
                  <Card
                    key={rec.id}
                    title={`${
                      (pagination.current - 1) * pagination.pageSize + idx + 1
                    }. ${rec.shift_name}`}
                  >
                    <p>
                      <strong>Start Time:</strong>{" "}
                      {rec.start_time ? rec.start_time.slice(0, 5) : "--:--"}
                    </p>
                    <p>
                      <strong>End Time:</strong>{" "}
                      {rec.end_time ? rec.end_time.slice(0, 5) : "--:--"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Tag color={rec.status === "active" ? "green" : "red"}>
                        {rec.status}
                      </Tag>
                    </p>

                   <Dropdown
  menu={{
    items: [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => handleEdit(rec),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => handleDelete(rec),
      },
    ],
  }}
  trigger={["click"]}
>
  <EllipsisOutlined className="cursor-pointer text-lg rotate-90" />
</Dropdown>

                  </Card>
                ))
              ) : (
                <div className="py-10 text-center col-span-full">
                  No shifts found
                </div>
              )}
            </div>
            {/* ========================= CARD VIEW END ============================== */}
          </>
        )}
        {/* ========================= TABLE VIEW END ============================ */}
      </div>
    </>
  );
};

export default Shift;
