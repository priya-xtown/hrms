
import {AuditOutlined,DesktopOutlined , ClusterOutlined   } from "@ant-design/icons";
export const dashboardMenuItems = [
  {
    icon:<AuditOutlined />,
    key: "/hrms/pages/dashboard",
    label:"HRMS Dashboard",
  },
  {
    icon:<DesktopOutlined />,
    key: "/ssms/pages/dashboard",
    label:"SSMS Dashboard",
  },
  {
    icon:<ClusterOutlined />,
    key: "/iot/pages/dashboard",
    label:"IOT Dashboard",
  },
];

const DashboardRoutes = () => {
  return (
   <>

   </>
  );
};

export default DashboardRoutes;
