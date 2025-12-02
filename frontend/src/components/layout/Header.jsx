/* HeaderBar.jsx */
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, message } from "antd";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const HeaderBar = ({ collapsed, toggleCollapsed }) => {
  const { theme, headerBgColor, headerGradient } = useTheme();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      message.success("Logged out");
      navigate("/");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const isGradient = headerGradient && headerGradient.includes("gradient");
  const textColor =
    theme === "dark" || isGradient ? "text-white" : "text-black";
  const hoverColor =
    theme === "dark" || isGradient
      ? "hover:text-gray-300"
      : "hover:text-gray-600";

  const iconBgColor = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
  const iconHoverColor =
    theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300";

  const headerStyle = isGradient
    ? { background: headerGradient }
    : { backgroundColor: headerBgColor || "#ffffff" };

  return (
    <div
      className="flex justify-between items-center shadow-lg h-12 px-4 py-2"
      style={{
        ...headerStyle,
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <div className="flex items-center">
        <button
          onClick={toggleCollapsed}
          className={`text-lg ${textColor} transition-transform duration-200 p-2 
    ${hoverColor} transform
    ${collapsed ? "hover:translate-x-1" : "hover:-translate-x-1"}`}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <div className="flex items-center">
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <UserOutlined
            className={`cursor-pointer text-ms ${iconBgColor} p-2 rounded-3xl ${iconHoverColor} transition-colors`}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default HeaderBar;
