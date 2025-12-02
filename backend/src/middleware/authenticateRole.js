// export const authorizeRole = (roles = []) => {
//   return async (req, res, next) => {
//     // await LoggerUtil.log({
//     //   level: 'INFO',
//     //   service: 'AuthService',
//     //   module: 'RoleMiddleware',
//     //   message: 'Checking role authorization',
//     //   details: { required_roles: roles, user_role: req.user?.role?.role_name },
//     //   request_id: req.id,
//     // });

//     if (!req.user || !roles.includes(req.user.role.role_name)) {
//       // await LoggerUtil.log({
//       //   level: 'ERROR',
//       //   service: 'AuthService',
//       //   module: 'RoleMiddleware',
//       //   message: 'Insufficient permissions',
//       //   details: { required_roles: roles, user_role: req.user?.role?.role_name },
//       //   request_id: req.id,
//       // });
//       return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
//     }

//     // await LoggerUtil.log({
//     //   level: 'INFO',
//     //   service: 'AuthService',
//     //   module: 'RoleMiddleware',
//     //   message: 'Role authorization successful',
//     //   details: { user_role: req.user.role.role_name },
//     //   request_id: req.id,
//     // });

//     next();
//   };
// };



// middlewares/authorizeRole.js

export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden: No user info in token" });
    }

    // Normalize case to avoid mismatch (e.g., "Admin" vs "admin")
    const userRole = req.user.role?.toLowerCase();
    const roles = allowedRoles.map((r) => r.toLowerCase());

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

