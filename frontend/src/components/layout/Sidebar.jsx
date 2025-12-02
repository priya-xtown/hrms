// Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import company from "../assets/Company_logo.png";
import logo from "../assets/Dark Logo.png";
import { useTheme } from "../../context/ThemeContext";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import settings from "../assets/technology.png";

const SubSidebar = ({ parentItem, collapsed }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, primaryColor } = useTheme();
  const [openSubSubMenuKey, setOpenSubSubMenuKey] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);

  const containerStyles = {
    height: "100%",
    width: collapsed ? "170px" : "200px",
    backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    paddingTop: "0rem",
    position: "absolute",
    left: collapsed ? "80px" : "200px",
    top: 0,
    zIndex: 999,
    borderLeft: `1px solid ${theme === "dark" ? "#4b5563" : "#e5e7eb"}`,
    display: "flex",
    flexDirection: "column",
  };

  const baseMenuItemStyles = {
    padding: collapsed ? "0.5rem" : "0.5rem 1rem",
    cursor: "pointer",
    color: theme === "dark" ? "#d1d5db" : "#374151",
    margin: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    fontSize: collapsed ? "0.8rem" : "0.9rem",
  };

  const getMenuItemStyles = (itemKey, hasChildren) => {
    const isActivePath = pathname === itemKey;
    const isHovered = hoveredKey === itemKey;
    const isDropdownOpen = openSubSubMenuKey === itemKey && hasChildren;

    let styles = { ...baseMenuItemStyles };

    if (isActivePath) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e5e7eb";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
      styles.fontWeight = "bold";
    } else if (isHovered || isDropdownOpen) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e5e7eb";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
    }

    return styles;
  };

  const getSubSubMenuItemStyles = (itemKey) => {
    const isActive = pathname === itemKey;
    const isHovered = hoveredKey === itemKey;

    let styles = {
      ...baseMenuItemStyles,
      paddingLeft: collapsed ? "1rem" : "1.75rem",
      fontSize: collapsed ? "0.75rem" : "0.85rem",
      margin: "0.1rem 0.5rem",
    };

    if (isActive || isHovered) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e0e7ff";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
      styles.fontWeight = "bold";
    }

    return styles;
  };

  const handleSubItemClick = (subItem) => {
    if (subItem.children && subItem.children.length > 0) {
      setOpenSubSubMenuKey(openSubSubMenuKey === subItem.key ? null : subItem.key);
    } else {
      navigate(subItem.key);
    }
  };

  return (
    <div style={containerStyles}>
      <div
        style={{
          display: "flex",
          padding: "0.75rem 1rem",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontWeight: "600",
            color: theme === "dark" ? "#ffffff" : "#111827",
            fontSize: "1rem",
          }}
        >
          {parentItem.label}
        </span>
      </div>
      <div style={{ padding: "0.5rem", overflowY: "auto", flexGrow: 1 }}>
        {parentItem.children.map((subItem) => (
          <div key={subItem.key}>
            <div
              style={getMenuItemStyles(subItem.key, subItem.children?.length > 0)}
              onClick={() => handleSubItemClick(subItem)}
              onMouseEnter={() => setHoveredKey(subItem.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {subItem.icon && (
                <span
                  style={{
                    marginRight: collapsed ? "0.25rem" : "0.5rem",
                    color:
                      pathname === subItem.key ||
                      openSubSubMenuKey === subItem.key
                        ? primaryColor
                        : "inherit",
                  }}
                >
                  {subItem.icon}
                </span>
              )}
              <span>{subItem.label}</span>
              {subItem.children?.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    color: openSubSubMenuKey === subItem.key ? primaryColor : "inherit",
                  }}
                >
                  {openSubSubMenuKey === subItem.key ? <UpOutlined /> : <DownOutlined />}
                </span>
              )}
            </div>
            {openSubSubMenuKey === subItem.key && subItem.children && (
              <div
                style={{
                  paddingTop: "0.25rem",
                  paddingBottom: "0.25rem",
                  paddingLeft: collapsed ? "1rem" : "1.75rem",
                }}
              >
                {subItem.children.map((subSubItem) => (
                  <div
                    key={subSubItem.key}
                    style={getSubSubMenuItemStyles(subSubItem.key)}
                    onClick={() => navigate(subSubItem.key)}
                    onMouseEnter={() => setHoveredKey(subSubItem.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <span>{subSubItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({ collapsed, menuItems, selectedParent, setSelectedParent }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, primaryColor, sidebarBgColor } = useTheme();
  const [hoveredKey, setHoveredKey] = useState(null);

  const handleItemClick = (item) => {
    if (!item.children) {
      setSelectedParent(null);
      navigate(item.key);
    }
  };

  const containerStyles = {
    height: "100%",
    width: collapsed ? "80px" : "200px",
    backgroundColor: theme === "dark" ? "#1f2937" : sidebarBgColor,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    paddingTop: "0.5rem",
    position: "relative",
  };

  const getMenuItemStyles = (itemKey) => {
    const isActive = pathname === itemKey || selectedParent?.key === itemKey;
    const isHovered = hoveredKey === itemKey;

    let styles = {
      padding: collapsed ? "0.5rem" : "0.5rem 1rem",
      cursor: "pointer",
      color: theme === "dark" ? "#d1d5db" : "#374151",
      margin: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      display: "flex",
      alignItems: "center",
      fontSize: collapsed ? "0.875rem" : "1rem",
      fontWeight: "semibold",
    };

    if (isActive || isHovered) {
      styles.backgroundColor = theme === "dark" ? "#4b5563" : "#e5e7eb";
      styles.color = theme === "dark" ? "#ffffff" : primaryColor;
    }

    return styles;
  };

  return (
    <div
      style={{ position: "relative", height: "100%" }}
    >
      <div style={containerStyles}>
        {!collapsed ? (
          <div style={{ display: "flex", padding: "0.5rem", justifyContent: "center" }}>
            <img src={company} alt="Company Logo" style={{ height: "2rem" }} />
          </div>
        ) : (
          <div style={{ display: "flex", padding: "1rem", justifyContent: "center" }}>
            <img src={logo} alt="Logo" style={{ height: "1rem", width: "1.5rem" }} />
          </div>
        )}
        <div style={{ padding: "0.5m", height: "calc(100% - 100px)", fontWeight: "500", }}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              style={getMenuItemStyles(item.key)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={() => {
                if (item.children) {
                  setSelectedParent(selectedParent?.key === item.key ? null : item);
                } else {
                  handleItemClick(item);
                }
              }}
            >
              {item.icon && (
                <span
                  style={{
                    marginRight: collapsed ? "0" : "0.5rem",
                    color:
                      pathname === item.key || selectedParent?.key === item.key
                        ? primaryColor
                        : "inherit",
                  }}
                >
                  {item.icon}
                </span>
              )}
              {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
            </div>
          ))}
        </div>
        
        {/* Settings button fixed at bottom */}
        <div 
          style={{
            position: "absolute",
            bottom: "20px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "center",
            padding: "0.5rem",
          }}
        >
          <div
            style={{
              ...getMenuItemStyles("settings"),
              display: "flex",
              justifyContent: collapsed ? "center" : "flex-start",
              alignItems: "center",
              cursor: "pointer",
              width: collapsed ? "50px" : "80%",
              padding: collapsed ? "0.5rem 0.25rem" : "0.5rem 1rem",
            }}
            onClick={() => navigate("/settings")}
            onMouseEnter={() => setHoveredKey("settings")}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <span
              style={{
                marginRight: collapsed ? "0" : "0.5rem",
                color: hoveredKey === "settings" ? primaryColor : "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img 
                src={settings} 
                alt="Settings" 
                style={{
                  width: collapsed ? "24px" : "26px",
                  height: collapsed ? "24px" : "26px",
                }}
              />
            </span>
            {!collapsed && <span>Settings</span>}
          </div>
        </div>
      </div>
      {selectedParent && selectedParent.children && (
        <SubSidebar
          parentItem={selectedParent}
          onClose={() => setSelectedParent(null)}
          collapsed={collapsed}
        />
      )}
    </div>
  );
};

export default Sidebar;
