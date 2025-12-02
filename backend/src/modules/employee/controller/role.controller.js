import BaseService from "../../../services/service.js";
import { Op } from "sequelize";
import { Role, Department} from "../../../association/association.js"

const roleService = new BaseService(Role);


export const createRole = async (req, res) => {
  try {
    const { role_name, department_id } = req.body;

    // 🔍 Check for existing role name
    const existingRole = await Role.findOne({ where: { role_name } });
    if (existingRole) {
      return res.status(400).json({
        message: `Role "${role_name}" already exists`,
      });
    }

    // ✅ Create new role
    const payload = {
      role_name,
      department_id,
      created_by: req.user?.id || "system",
    };

    const newRole = await Role.create(payload);

    return res.status(201).json({
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    console.error("❌ Error in createRole:", error);
    return res.status(500).json({
      message: "Failed to create role",
      error: error.message,
    });
  }
};


// // ✅ GET /api/role/getAllRoles
// export const getAllRoles = async (req, res) => {
//   try {
//     const options = {
//       includeInactive: req.query.includeInactive === "true" || false,
//       search: req.query.search || "",
//       page: Number(req.query.page) || 1,
//       limit: Number(req.query.limit) || 10,
//       orderBy: req.query.orderBy || "createdAt",
//       order: req.query.order || "ASC",
//       searchFields: ["role_name", "description"],
//     };

//     const result = await roleService.getAll(options);

//     return res.status(200).json({
//       message: "Roles fetched successfully",
//       ...result,
//     });
//   } catch (error) {
//     console.error("❌ Error in getAllRoles:", error);
//     return res.status(500).json({
//       message: "Failed to fetch roles",
//       error: error.message,
//     });
//   }
// };

// // // ✅ GET /api/role/getRoleById/:id
// export const getRoleById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const role = await roleService.getById(id);

//     return res.status(200).json({
//       message: "Role fetched successfully",
//       data: role,
//     });
//   } catch (error) {
//     console.error("❌ Error in getRoleById:", error);
//     return res.status(500).json({
//       message: "Failed to fetch role",
//       error: error.message,
//     });
//   }
// };



// ✅ GET /api/role/getAllRoles
export const getAllRoles = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === "true" || false;
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const orderBy = req.query.orderBy || "createdAt";
    const order = req.query.order || "ASC";

    const where = {};
    if (!includeInactive) where.is_active = true;

    if (search) {
      where[Op.or] = [
        { role_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    // 🟢 Fetch roles with department association
    const { rows, count } = await Role.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id", "department_name"],
        },
      ],
      order: [[orderBy, order]],
      limit,
      offset,
    });

    // 🟡 Flatten department details in output
    const formattedData = rows.map((role) => ({
      id: role.id,
      role_name: role.role_name,
      department_id: role.department_id,
      department_name: role.department ? role.department.department_name : null,
      is_active: role.is_active,
      created_by: role.created_by,
      updated_by: role.updated_by,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
       deletedAt: role.deletedAt,
    }));

    return res.status(200).json({
      message: "Roles fetched successfully",
      data: formattedData,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("❌ Error in getAllRoles:", error);
    return res.status(500).json({
      message: "Failed to fetch roles",
      error: error.message,
    });
  }
};

// ✅ GET /api/role/getRoleById/:id
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["id", "department_name"],
        },
      ],
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const formattedRole = {
      id: role.id,
      role_name: role.role_name,
      department_id: role.department_id,
      department_name: role.department ? role.department.department_name : null,
      is_active: role.is_active,
       created_by: role.created_by,
      updated_by: role.updated_by,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
       deletedAt: role.deletedAt,
    };

    return res.status(200).json({
      message: "Role fetched successfully",
      data: formattedRole,
    });
  } catch (error) {
    console.error("❌ Error in getRoleById:", error);
    return res.status(500).json({
      message: "Failed to fetch role",
      error: error.message,
    });
  }
};


// ✅ PUT /api/role/updateRole/:id
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user?.id || "system",
    };

    const updatedRole = await roleService.update(id, payload);

    return res.status(200).json({
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    console.error("❌ Error in updateRole:", error);
    return res.status(500).json({
      message: "Failed to update role",
      error: error.message,
    });
  }
};


export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Check if role exists
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // 🔹 Soft delete: set is_active = false
    await role.update({ is_active: false });

    return res.status(200).json({
      message: "Role deactivated successfully",
      data: { id: role.id, is_active: role.is_active },
    });
  } catch (error) {
    console.error("❌ Error in deleteRole:", error);
    return res.status(500).json({
      message: "Failed to deactivate role",
      error: error.message,
    });
  }
};

// ✅ PUT /api/role/restoreRole/:id
export const restoreRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findOne({
      where: { id },
      paranoid: false, // include soft-deleted
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.restore();
    await role.update({ is_active: true });

    return res.status(200).json({
      message: "Role restored successfully",
      data: role,
    });
  } catch (error) {
    console.error("❌ Error in restoreRole:", error);
    return res.status(500).json({
      message: "Failed to restore role",
      error: error.message,
    });
  }
};


// export const getDeptByRoleId = async (req, res) => {
//   try {
//     // Get dynamic department ID from frontend (e.g. /api/departments/:id)
//     const { id } = req.params;

//     const departmentData = await Department.findOne({
//       where: {
//         id, // dynamic
//         is_active: 1,
//       },
//       attributes: [
//         "id",
//         ["department_name", "department_name"],
//         ["is_active", "deptActiveSts"],
//       ],
//       include: [
//         {
//           model: Role,
//           required: false, // LEFT JOIN
//           attributes: [
//             "id",
//             ["role_name", "role_name"],
//             ["is_active", "desigStaus"],
//           ],
//           where: { is_active: 1 },
//         },
//       ],
//     });

//     if (!departmentData) {
//       return res.status(404).json({ message: "Department not found" });
//     }

//     res.status(200).json(departmentData);
//   } catch (error) {
//     console.error("Error fetching department:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getDeptByRoleId = async (req, res) => {
  try {
    const { id } = req.params;

    const departmentData = await Department.findOne({
      where: {
        id,
        is_active: 1,
      },
      attributes: [
        "id",
        ["department_name", "department_name"],
        ["is_active", "deptActiveSts"],
      ],
      include: [
        {
          model: Role,
          as: "roles", // ✅ must match the alias in association
          required: false, // LEFT JOIN
          attributes: [
            "id",
            ["role_name", "role_name"],
            ["is_active", "desigStaus"],
          ],
          where: { is_active: 1 },
        },
      ],
    });

    if (!departmentData) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(departmentData);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export default {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  restoreRole,
  getDeptByRoleId
};
