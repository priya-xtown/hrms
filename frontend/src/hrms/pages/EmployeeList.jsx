// import { useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Checkbox, Col, Row, Statistic } from "antd";
import { Table } from "antd";
// import Item from "antd/es/list/Item";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Radio } from "antd";

const columns = [
  {
    title: "Emp Id",
    dataIndex: "emp_id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "email",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Joining Date",
    dataIndex: "joining_date",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (text) => <a>{text}</a>,
  },
];
const data = [
  {
    key: "1",
    emp_id: "#12",
    name: "Sudhakar",
    email: "sudhakar@xtowns.in",
    phone: "9543803611",
    designation: "developer",
    joining_date: "10-02-2025",
    status: "active",
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    emp_id: "#12",
    name: "Sudhakar",
    email: "sudhakar@xtowns.in",
    phone: "9543803611",
    designation: "developer",
    joining_date: "10-02-2025",
    status: "active",
    address: "New York No. 1 Lake Park",
  },
];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name,
  }),
};

const EmployeeList = () => {
  //   const [selectionType, setSelectionType] = useState("checkbox");

  return (
    <>
      {/* <div>
        <Button type="primary" icon={<DownloadOutlined />}>
          Download
        </Button>
        <Button type="primary">
            Primary
          </Button>
      </div> */}
      <Row gutter={16}>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>{" "}
      <div className="mt-5">
        {/* <Radio.Group
          onChange={(e) => setSelectionType(e.target.value)}
          value={selectionType}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">radio</Radio>
        </Radio.Group>
        <Divider /> */}
        <Table
          rowSelection={Object.assign({ type: Checkbox }, rowSelection)}
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};

export default EmployeeList;
