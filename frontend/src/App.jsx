// import { Suspense, useMemo } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import MainLayout from "./components/layout/MainLayout";
// import dashboard from "./components/assets/dashboard.png";
// //import ssms from "./components/assets/sewing-machine.png";
// import company from "../public/factory.png";
// import Login from "./login/Login";
// import ProtectedRoute from "./context/ProtectedRoute";
// import { AuthProvider } from "./context/AuthContext";
// import Loading from "./utils/Loading";
// import Settings from "./components/pages/Settings";
// import hrms from "./components/assets/sewing-machine.png";
// import Register from "./login/RegisterPage";
// const routeModules = import.meta.glob("./*/AppRoutes.jsx", { eager: true });

// const moduleIcons = {
//   dashboard: <img src={dashboard} alt="iot" className="w-6 h-6" />,
//   hrms: <img src={hrms} alt="iot" className="w-6 h-6 " />,
//   //ssms: <img src={ssms} alt="iot" className="w-6 h-6" />,
//   //iot: <img src={iot} alt="iot" className="w-6 h-6" />,
//   company: <img src={company} alt="company" className="w-7 h-9" />,
// };

// const App = () => {
//   const modules = Object.entries(routeModules).map(([path, mod]) => {
//     const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
//     const name = match?.[1];

//     return {
//       name,
//       path: `/${name}/*`,
//       element: mod.default,
//       menuItems: mod[`${name}MenuItems`] || [],
//     };
//   });

//   const menuItems = useMemo(() => {
//     return modules.map(({ name, menuItems }) => ({
//       key: name,
//       icon: moduleIcons[name] || null,
//       label: name.toUpperCase(),
//       children: menuItems,
//     }));
//   }, [modules]);

//   const getDefaultRedirect = () => {
//     const filteredModules = modules.filter((mod) => mod.name !== "dashboard");
//     return filteredModules.length > 0
//       ? `/${filteredModules[0].name}/pages/dashboard`
//       : "/404";
//   };

//   return (
//     <BrowserRouter>
//     <Loading duration={3000} />
//       <Suspense fallback={<div className="p-4"><Loading /></div>}>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route element={<MainLayout menuItems={menuItems} />}>
//             <Route
//               path="/"
//               element={<Navigate to={getDefaultRedirect()} replace />}
//             />
//             {modules.map(({ name, path, element: Element }) => (
//               <Route key={name} path={path} element={<Element />} />
//             ))}
//             <Route path="/settings" element={<Settings/>} />
//             <Route
//               path="*"
//               element={
//                 <div className="p-4 text-red-500">404 - Page Not Found</div>
//               }
//             />
//           </Route>
//         </Routes>
        
//       </Suspense>
//     </BrowserRouter>
//   );
// };

// export default App;
// import { Suspense, useMemo } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { App as AntApp } from "antd";
// import MainLayout from "./components/layout/Mainlayout.jsx";
// import dashboard from "./components/assets/dashboard.png";
// import hrms from "./components/assets/sewing-machine.png";
// import Login from "./login/Login";
// import ProtectedRoute from "./context/ProtectedRoute";
// import { AuthProvider } from "./context/AuthContext";
// import Loading from "./utils/Loading";
// import Settings from "./components/pages/Settings";
// import Register from "./login/RegisterPage";

// // ✅ FIX 1: use /factory.png (served from public root) instead of importing from ../public
// const companyIconUrl = "/factory.png";

// // Dynamic route import
// const routeModules = import.meta.glob("./*/AppRoutes.jsx", { eager: true });

// // Icon mapping
// const moduleIcons = {
//   dashboard: <img src={dashboard} alt="dashboard" className="w-6 h-6" />,
//   hrms: <img src={hrms} alt="hrms" className="w-6 h-6" />,
//   company: <img src={companyIconUrl} alt="company" className="w-7 h-9" />,
// };

// const App = () => {
//   const modules = Object.entries(routeModules).map(([path, mod]) => {
//     const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
//     const name = match?.[1];

//     return {
//       name,
//       path: `/${name}/*`,
//       element: mod.default,
//       menuItems: mod[`${name}MenuItems`] || [],
//     };
//   });

//   const menuItems = useMemo(() => {
//     return modules.map(({ name, menuItems }) => ({
//       key: name,
//       icon: moduleIcons[name] || null,
//       label: name.toUpperCase(),
//       children: menuItems,
//     }));
//   }, [modules]);

//   const getDefaultRedirect = () => {
//     const filteredModules = modules.filter((mod) => mod.name !== "dashboard");
//     return filteredModules.length > 0
//       ? `/${filteredModules[0].name}/pages/dashboard`
//       : "/404";
//   };

//   return (
//     <AntApp>
//       <AuthProvider>
//         <BrowserRouter>
//           <Loading duration={3000} />
//           <Suspense fallback={<div className="p-4"><Loading /></div>}>
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<Login />} />
//               <Route path="/register" element={<Register />} />

//               {/* Protected Routes */}
//               <Route
//                 element={
//                   <ProtectedRoute>
//                     <MainLayout menuItems={menuItems} />
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route
//                   path="/"
//                   element={<Navigate to={getDefaultRedirect()} replace />}
//                 />
//                 {modules.map(({ name, path, element: Element }) => (
//                   <Route key={name} path={path} element={<Element />} />
//                 ))}
//                 <Route path="/settings" element={<Settings />} />
//                 <Route
//                   path="*"
//                   element={
//                     <div className="p-4 text-red-500">404 - Page Not Found</div>
//                   }
//                 />
//               </Route>
//             </Routes>
//           </Suspense>
//         </BrowserRouter>
//       </AuthProvider>
//     </AntApp>
//   );
// };

// export default App;



import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { App as AntApp } from "antd";
import MainLayout from "./components/layout/Mainlayout.jsx";
import dashboard from "./components/assets/dashboard.png";
import hrms from "./components/assets/sewing-machine.png";
import Login from "./login/Login";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Loading from "./utils/Loading";
import Settings from "./components/pages/Settings";
import Register from "./login/RegisterPage";

// Static public file (correct)
const companyIconUrl = "/factory.png";

// Auto-import AppRoutes files
const routeModules = import.meta.glob("./*/AppRoutes.jsx", { eager: true });

// Icon mapping
const moduleIcons = {
  dashboard: <img src={dashboard} alt="dashboard" className="w-6 h-6" />,
  hrms: <img src={hrms} alt="hrms" className="w-6 h-6" />,
  company: <img src={companyIconUrl} alt="company" className="w-7 h-9" />,
};

const App = () => {
  const modules = Object.entries(routeModules).map(([path, mod]) => {
    const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
    const name = match?.[1];

    return {
      name,
      path: `/${name}/*`,
      element: mod.default,
      menuItems: mod[`${name}MenuItems`] || [],
    };
  });

  const menuItems = useMemo(() => {
    return modules.map(({ name, menuItems }) => ({
      key: name,
      icon: moduleIcons[name] || null,
      label: name.toUpperCase(),
      children: menuItems,
    }));
  }, [modules]);

  const getDefaultRedirect = () => {
    const filteredModules = modules.filter((mod) => mod.name !== "dashboard");
    return filteredModules.length > 0
      ? `/${filteredModules[0].name}/pages/dashboard`
      : "/404";
  };

  return (
    <AntApp>
      <AuthProvider>
        <BrowserRouter>
          <Loading duration={3000} />
          <Suspense fallback={<div className="p-4"><Loading /></div>}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout menuItems={menuItems} />
                  </ProtectedRoute>
                }
              >
                {/* Default redirect */}
                <Route
                  path="/"
                  element={<Navigate to={getDefaultRedirect()} replace />}
                />

                {/* Dynamic modules */}
                {modules.map(({ name, path, element: Element }) => (
                  <Route key={name} path={path} element={<Element />} />
                ))}

                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<div className="p-4 text-red-500">404 - Page Not Found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </AntApp>
  );
};

export default App;
