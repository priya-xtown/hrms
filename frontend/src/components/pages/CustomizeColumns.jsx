import React from "react";
import { Dropdown, Switch, Space, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const ColumnVisibilityDropdown = ({
  allColumns,
  visibleColumns,
  setVisibleColumns,
}) => {
  const items = allColumns.map((col) => {
    const colKey = col.dataIndex || col.key;
    return {
      key: colKey,
      label: (
        <Space>
          <Switch
            checked={visibleColumns.includes(colKey)}
            onChange={(checked) => {
              setVisibleColumns((prev) =>
                checked ? [...prev, colKey] : prev.filter((k) => k !== colKey)
              );
            }}
          />
          {col.title}
        </Space>
      ),
    };
  });

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button icon={<SettingOutlined />} />
    </Dropdown>
  );
};

export default ColumnVisibilityDropdown;
