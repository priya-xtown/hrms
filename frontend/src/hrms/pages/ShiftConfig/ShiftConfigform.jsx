import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Popover,
  message,
  Checkbox,
  Tag,
  Dropdown,
  Menu,
} from "antd";
import { branchServices } from "../../../company/services/CompanyServices";
import { divisionService } from "../../../company/services/divisionService";
import { departmentService } from "../../../company/services/departmentService";
import { shiftService } from "../../services/shift";
import { employeeService } from "../../services/employeeservice";
import { shiftconfigService } from "../../services/Shiftconfig";
import { useNavigate } from "react-router-dom";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const ShiftConfigForm = () => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [customStartTime, setCustomStartTime] = useState(null);
  const [customEndTime, setCustomEndTime] = useState(null);
  const [isRotational, setIsRotational] = useState(false);
  const [rotationPattern, setRotationPattern] = useState([]); // e.g., [{ week: 1, shift_id: 3 }]

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [weekShiftMap, setWeekShiftMap] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState({});
  const [selectedShiftName, setSelectedShiftName] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const navigate = useNavigate();
  const [department, setDepartment] = useState([]);
  const [shift, setShift] = useState([]);
  const [division, setDivision] = useState([]);
  const [branch, setBranch] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSubmit = async () => {
    if (selectedEmployeeIds.length === 0) {
      message.warning("Please select at least one employee.");
      return;
    }

    // if (
    //   !effectiveDate ||
    //   !customStartTime ||
    //   !customEndTime ||
    //   daysOfWeek.length === 0
    // ) {
    //   message.warning("Please complete all required fields.");
    //   return;
    // }

    if (isRotational && rotationPattern.length === 0) {
      message.warning("Please assign shifts to weeks.");
      return;
    }

    const payload = {
      effective_date: effectiveDate,
      end_date: endDate || null,
      days_of_week: daysOfWeek.join(","), // e.g., "Mon,Tue,Wed"
      custom_start_time: dayjs(customStartTime).format("HH:mm:ss"),
      custom_end_time: dayjs(customEndTime).format("HH:mm:ss"),
      is_rotational: isRotational,
      rotation_pattern: isRotational ? rotationPattern : undefined,
      employee_with_shiftconfigs: selectedEmployeeIds.map((id) => ({
        employee_id: id,
      })),
      status: "active",
      is_active: true,
    };

    try {
      await shiftconfigService.createShiftconfig(payload);
      message.success("Shift configuration created successfully!");
      navigate("/hrms/pages/shiftconfiguration");
    } catch (error) {
      console.error(error);
      message.error("Failed to create shift configuration");
    }
  };

  const fetchEmployees = async (params = {}) => {
    setLoading(true);
    try {
      const requestParams = {
        page: params.page ?? pagination.current,
        limit: params.pageSize ?? pagination.pageSize,
        search: searchText,
        sort_by: "created_at",
        sort_order: "desc",
        ...params,
      };

      const response = await employeeService.getEmployees(requestParams);
      console.log("Employee data (response.data):", response.data);

      const rows = response.data || [];

      const formatted = rows
        .filter((item) => item.id)
        .map((item) => {
          const addressParts = [
            item.address_line1,
            item.address_line2,
            item.citys?.name,
            item.states?.name,
            item.countrys?.name,
          ].filter(Boolean);
          const fullAddress = addressParts.join(", ");

          return {
            key: item.id,
            id: item.id,
            employee: `${item.first_name} ${item.last_name}`,
            address: fullAddress || "-",
            phone: item.phone,
            division: item.divisions || {},
            department: item.departments || {},
            branch: item.branch || {},
            company: item.company || {},
            designation: item.designation || {},
            status: item.status,
          };
        });

      console.log("Formatted employee data:", formatted);

      setEmployees(formatted);
      setPagination({
        current: response.meta?.page || pagination.current,
        pageSize: response.meta?.limit || pagination.pageSize,
        total: response.meta?.total || pagination.total,
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setPagination((prev) => ({
        current: 1,
        pageSize: prev.pageSize,
        total: 0,
      }));
      message.error(error.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartment();
    fetchShift();
    fetchDivision();
    fetchBranch();
  }, [searchText, pagination.current, pagination.pageSize]);

  const fetchShift = async () => {
    try {
      const response = await shiftService.getshiftAll();
      setShift(response.data.data || []);
    } catch (error) {
      messageApi.error("Failed to fetch shift");
      console.error("Fetch shift error:", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartment(response.data || []);
    } catch (error) {
      messageApi.error("Failed to fetch departments");
      console.error("Fetch departments error:", error);
    }
  };

  const fetchDivision = async () => {
    try {
      const response = await divisionService.getAllDivisions();
      setDivision(response.data || []);
    } catch (error) {
      messageApi.error("Failed to fetch divisions");
      console.error("Fetch divisions error:", error);
    }
  };
  const fetchBranch = async () => {
    try {
      const response = await branchServices.getBranch();
      setBranch(response.data || []);
    } catch (error) {
      messageApi.error("Failed to fetch branches");
      console.error("Fetch branches error:", error);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsRotational(e.target.checked);
    if (!e.target.checked) {
      setSelectedWeeks([]);
      setWeekShiftMap({});
      setDropdownVisible(false);
      setPopoverVisible({});
    } else {
      setDropdownVisible(true);
    }
  };
  const handleWeekChange = (weeks) => {
    setSelectedWeeks(weeks);
    const updatedMap = {};
    weeks.forEach((week) => {
      if (weekShiftMap[week]) {
        updatedMap[week] = weekShiftMap[week];
      }
    });
    setWeekShiftMap(updatedMap);
  };
  const handleShiftChange = (week, shift) => {
    setWeekShiftMap((prev) => ({
      ...prev,
      [week]: shift,
    }));

    setPopoverVisible((prev) => ({
      ...prev,
      [week]: false,
    }));
  };
  const handlePopoverVisibleChange = (week, visible) => {
    setPopoverVisible((prev) => ({
      ...prev,
      [week]: visible,
    }));
  };

  const renderShiftPopover = (week) => (
    <div style={{ padding: 8 }}>
      <Select
        placeholder="Select Shift"
        style={{ width: 150 }}
        value={weekShiftMap[week] || undefined}
        onChange={(shift) => handleShiftChange(week, shift)}
        allowClear
      >
        {shift.map((item) => (
          <Select.Option key={item.id} value={item.shift_name}>
            {item.shift_name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  const getWeekLabel = (week) => {
    const shift = weekShiftMap[week];
    const weekNumber = week.slice(-1);
    return shift
      ? `Week ${weekNumber} – ${shift.charAt(0).toUpperCase() + shift.slice(1)}`
      : `Week ${weekNumber}`;
  };

  const placeholder =
    selectedWeeks.length > 0
      ? `Select Weeks (${selectedWeeks.length})`
      : "Select Weeks";

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleApply = () => {
    console.log("Apply clicked with:", { isRotational, weekShiftMap });
    setDropdownVisible(false);
    setPopoverVisible({});
  };

  const handleReset = () => {
    setSelectedWeeks([]);
    setWeekShiftMap({});
    setPopoverVisible({});
  };

  const dropdownRender = (menu) => (
    <div style={{ padding: "8px" }}>
      {["week1", "week2", "week3", "week4"].map((week) => (
        <Popover
          key={week}
          content={renderShiftPopover(week)}
          trigger="hover"
          placement="left"
          open={popoverVisible[week] || false}
          onOpenChange={(visible) => handlePopoverVisibleChange(week, visible)}
        >
          <div
            style={{
              padding: "5px 12px",
              cursor: "pointer",
              backgroundColor: selectedWeeks.includes(week)
                ? "#e6f7ff"
                : "white",
            }}
          >
            {getWeekLabel(week)}
          </div>
        </Popover>
      ))}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          danger
          size="small"
          onClick={handleReset}
          disabled={
            selectedWeeks.length === 0 && Object.keys(weekShiftMap).length === 0
          }
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={handleApply}
          disabled={
            selectedWeeks.length === 0 && Object.keys(weekShiftMap).length === 0
          }
        >
          Apply
        </Button>
      </div>
    </div>
  );

  // const branchOptions = [];
  // const departmentOptions = [];
  // const divisionOptions = [];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  const capitalizeWords = (text) => {
    return text?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";
  };

  const columns = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 70,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      render: (name) => capitalizeWords(name),
    },
    {
      title: "Company",
      dataIndex: ["company", "name"],
      key: "company_name",
      render: (name) => capitalizeWords(name),
    },
    {
      title: "Branch",
      dataIndex: ["branch", "name"],
      key: "branch_name",
      render: (name) => capitalizeWords(name),
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department_name",
      render: (name) => capitalizeWords(name),
    },
    {
      title: "Division",
      dataIndex: ["division", "name"],
      key: "division_name",
      render: (name) => capitalizeWords(name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => capitalizeWords(address),
    },
    {
      title: "Designation",
      dataIndex: ["designation", "name"],
      key: "designation_name",
      render: (name) => capitalizeWords(name),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Tag color={status === "active" ? "green" : "red"}>
    //       {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Dropdown
    //       overlay={
    //         <Menu onClick={(e) => handleMenuClick(record, e)}>
    //           <Menu.Item key="view" icon={<EyeOutlined />}>
    //             View
    //           </Menu.Item>
    //           <Menu.Item key="edit" icon={<EditOutlined />}>
    //             Edit
    //           </Menu.Item>
    //           <Menu.Item key="delete" icon={<DeleteOutlined />}>
    //             Delete
    //           </Menu.Item>
    //         </Menu>
    //       }
    //       trigger={["click"]}
    //     >
    //       <a onClick={(e) => e.preventDefault()}>
    //         <EllipsisOutlined
    //           style={{ fontSize: 18, cursor: "pointer" }}
    //           rotate={90}
    //         />
    //       </a>
    //     </Dropdown>
    //   ),
    // },
  ];

  return (
    <>
      {contextHolder}

      <div className="max-w-full overflow-hidden">
        <div className="bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-2">
            <h1 className="text-xl font-semibold">
              Create Shift Configuration
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto">
                <label className="flex items-center font-semibold gap-1 mr-4">
                  <Checkbox
                    checked={isRotational}
                    onChange={handleCheckboxChange}
                  />
                  Rotational
                </label>

                {!isRotational && (
                  <Select
                    placeholder="Select Shift Name"
                    className="w-40"
                    value={selectedShiftName}
                    onChange={(value) => setSelectedShiftName(value)}
                    allowClear
                  >
                    {shift.map((item) => (
                      <Select.Option key={item.id} value={item.shift_name}>
                        {item.shift_name}
                      </Select.Option>
                    ))}
                  </Select>
                )}

                {isRotational && (
                  <Select
                    mode="multiple"
                    placeholder={placeholder}
                    className="w-40"
                    value={selectedWeeks}
                    onChange={handleWeekChange}
                    dropdownRender={dropdownRender}
                    open={dropdownVisible}
                    showSearch={false}
                    suffixIcon={null}
                    onDropdownVisibleChange={(visible) => {
                      if (!visible && selectedWeeks.length > 0) {
                        setDropdownVisible(false);
                      } else if (!visible && selectedWeeks.length === 0) {
                        setDropdownVisible(true);
                      } else {
                        setDropdownVisible(visible);
                      }
                    }}
                  >
                    {["week1", "week2", "week3", "week4"].map((week) => (
                      <Option key={week} value={week}>
                        {getWeekLabel(week)}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="w-full sm:w-[250px] min-w-[200px]">
                <Input.Search
                  placeholder="Search by role name"
                  value={searchText}
                  // onChange={handleSearchChange}
                  className="w-full"
                  allowClear
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-2">
          <div className="flex space-x-4 mb-4">
            {/* Branch */}
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Select Branch
              </label>

              <Select placeholder="Select branch" className="w-full" allowClear>
                {branch?.data?.branches?.map((branchItem) => (
                  <Option key={branchItem.id} value={branchItem.id}>
                    {branchItem.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Department */}
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Select Department
              </label>

              <Select
                placeholder="Select department"
                className="w-full"
                allowClear
              >
                {department?.departments?.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Division */}
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Select Division
              </label>

              <Select
                placeholder="Select division"
                className="w-full"
                allowClear
              >
                {division?.divisions?.map((div) => (
                  <Option key={div.id} value={div.id}>
                    {div.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={employees}
            size="small"
            pagination={{
              pageSize: 10,
              responsive: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            onChange={handleTableChange}
            rowKey="id"
            scroll={{ x: "max-content" }}
            className="min-w-full"
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
        <div className="flex justify-end space-x-2 mb-4">
          <Button
            danger
            onClick={() => navigate("/hrms/pages/shiftconfiguration")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShiftConfigForm;
