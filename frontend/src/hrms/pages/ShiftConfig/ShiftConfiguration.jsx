import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Dropdown,
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Popover,
  Menu,
  message,
  TimePicker,
  Space,
  Switch,
  Card,
  Tag,
} from "antd";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SettingOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const getUniqueValues = (data, key) =>
  [...new Set(data.map((item) => item[key]))].filter(Boolean);

const FiltersPopover = ({ onApply, dataSource, currentFilters }) => {
  const [filters, setFilters] = useState({
    status: currentFilters.status,
  });
  const statuses = getUniqueValues(dataSource, "status");
  const onChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));
  const renderPopoverContent = (field, options) => (
    <div>
      <div style={{ marginBottom: 3, fontWeight: "bold", color: "#555" }}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </div>
      <Select
        value={filters[field]}
        onChange={(val) => onChange(field, val)}
        placeholder={`Select ${field}`}
        style={{ width: 180 }}
        allowClear
      >
        {options.map((opt) => (
          <Option key={opt} value={opt}>
            {opt}
          </Option>
        ))}
      </Select>
    </div>
  );
  return (
    <div style={{ padding: 10, width: 200 }}>
      <Popover
        content={renderPopoverContent("status", statuses)}
        trigger="hover"
        placement="right"
      >
        <div
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            color: filters.status ? "#1890ff" : "inherit",
          }}
        >
          Status {filters.status && <span>(1)</span>}
        </div>
      </Popover>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={!filters.status}
        >
          Reset
        </Button>{" "}
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={!filters.status}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

const Shiftconfiguration = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const { showCustomButton } = useTheme();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState(
    localStorage.getItem("attendanceViewMode") || "table"
  );
  useEffect(() => {
    localStorage.setItem("attendanceViewMode", viewMode);
  }, [viewMode]);

  const storageKey = "shiftconfigurationVisibleColumns";
  const allColumns = [
    { title: "S.No", key: "serialNumber", render: (_, __, i) => i + 1 },
    { title: "Employee Name", dataIndex: "Employee", key: "Employee" },
    { title: "Shift Name", dataIndex: "Shiftname", key: "Shiftname" },
    { title: "Days of Week", dataIndex: "daysofweek", key: "daysofweek" },
    { title: "Time", dataIndex: "Time", key: "Time" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (st) => <Tag color={st === "active" ? "green" : "red"}>{st}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => console.log(e.key, record)}>
              <Menu.Item icon={<EyeOutlined />} key="view">
                View
              </Menu.Item>
              <Menu.Item icon={<EditOutlined />} key="edit">
                Edit
              </Menu.Item>
              <Menu.Item icon={<DeleteOutlined />} key="delete">
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <EllipsisOutlined rotate={90} />
        </Dropdown>
      ),
    },
  ];
  const [visibleCols, setVisibleCols] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : allColumns.map((c) => c.key);
  });
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(visibleCols));
  }, [visibleCols]);


  const dataSource = []; 
  const applyFilters = (search = searchText, flt = filters) => {
    let fd = [...dataSource];
    if (search) {
      fd = fd.filter((r) =>
        r.Employee?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (flt.status) fd = fd.filter((r) => r.status === flt.status);
    setFilteredData(fd);
  };
  useEffect(() => {
    applyFilters();
  }, []);

  const onSearch = (e) => {
    setSearchText(e.target.value);
    applyFilters(e.target.value, filters);
  };
  const onFilterApply = (flt) => {
    setFilters(flt);
    applyFilters(searchText, flt);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 ">
        <h1 className="text-xl font-semibold">Shift Configuration</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-[250px] min-w-[200px]">
            <Input.Search
              placeholder="Search by employee"
              value={searchText}
              onChange={onSearch}
              allowClear
            />
          </div>
          <Popover
            content={
              <FiltersPopover
                dataSource={dataSource}
                currentFilters={filters}
                onApply={onFilterApply}
              />
            }
            trigger="click"
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Popover>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/hrms/pages/formcreate")}
          >
            Add Shift
          </Button>

          <Button
            icon={
              viewMode === "table" ? <AppstoreOutlined /> : <TableOutlined />
            }
            onClick={() =>
              setViewMode((m) => (m === "table" ? "card" : "table"))
            }
          >

          </Button>

          {showCustomButton && (
            <Dropdown
              menu={{
                items: allColumns.map((col) => ({
                  key: col.key,
                  label: (
                    <Space>
                      <Switch
                        checked={visibleCols.includes(col.key)}
                        onChange={(chk) =>
                          setVisibleCols((vs) =>
                            chk
                              ? [...vs, col.key]
                              : vs.filter((k) => k !== col.key)
                          )
                        }
                      />
                      {col.title}
                    </Space>
                  ),
                })),
              }}
            >
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          )}
        </div>
      </div>

      {viewMode === "table" ? (
        <Table
          rowSelection={rowSelection}
          columns={allColumns.filter((c) => visibleCols.includes(c.key))}
          dataSource={filteredData}
          size="small"
          pagination={{ pageSize: 10 }}
          rowKey={(r, i) => i}
          scroll={{ x: "max-content" }}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.length ? (
            filteredData.map((rec, i) => (
              <Card
                key={i}
                title={`${i + 1}. ${rec.Employee || "Unnamed"}`}
                className="shadow-sm hover:shadow-md"
              >
                <p>
                  <strong>Shift:</strong> {rec.Shiftname}
                </p>
                <p>
                  <strong>Days:</strong> {rec.daysofweek}
                </p>
                <p>
                  <strong>Time:</strong> {rec.Time}
                </p>
                <p>
                  <strong>Date:</strong> {rec.date}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Tag color={rec.status === "active" ? "green" : "red"}>
                    {rec.status}
                  </Tag>
                </p>
                <Dropdown
                  overlay={
                    <Menu onClick={(e) => console.log(e.key, rec)}>
                      <Menu.Item icon={<EyeOutlined />} key="view">
                        View
                      </Menu.Item>
                      <Menu.Item icon={<EditOutlined />} key="edit">
                        Edit
                      </Menu.Item>
                      <Menu.Item icon={<DeleteOutlined />} key="delete">
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <EllipsisOutlined rotate={90} />
                </Dropdown>
              </Card>
            ))
          ) : (
            <div className="py-10 text-center">No shiftconfig found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shiftconfiguration;
