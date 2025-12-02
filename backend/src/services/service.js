import { Op } from "sequelize";

class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  // Create new record
  async create(data) {
    return await this.Model.create(data);
  }

  // Get all records with optional search, pagination, and sorting
  async getAll({
    includeInactive = false,
    search = "",
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    order = "ASC",
    searchFields = [],
  } = {}) {
    const where = {};

    if (!includeInactive && this.Model.rawAttributes.is_active) {
      where.is_active = true;
    }

    if (search && searchFields.length > 0) {
      where[Op.or] = searchFields.map((field) => ({
        [field]: { [Op.like]: `%${search}%` },
      }));
    }

    const offset = (page - 1) * limit;

    const rows = await this.Model.findAll({
      where,
      offset,
      limit,
      order: [[orderBy, order.toUpperCase()]],
    });

    const count = await this.Model.count({ where });

    return {
      rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  // Get single record by ID
  async getById(id) {
    const record = await this.Model.findByPk(id);
    if (!record) throw new Error(`${this.Model.name} not found`);
    return record;
  }

  // Update record by ID
  async update(id, data) {
    const record = await this.Model.findByPk(id);
    if (!record) throw new Error(`${this.Model.name} not found`);
    return await record.update(data);
  }

  // Delete record by ID
//   async delete(id) {
//     const record = await this.Model.findByPk(id);
//     if (!record) throw new Error(`${this.Model.name} not found`);
//     await record.destroy();
//     return { message: `${this.Model.name} deleted successfully` };
//   }
// }


async delete(id) {
    const record = await this.Model.findByPk(id);
    if (!record) throw new Error(`${this.Model.name} not found`);

    if (this.Model.options.paranoid) {
      await record.update({ is_active: false });
      await record.destroy(); // marks as deleted (sets deleted_at)
      return { message: `${this.Model.name} soft deleted successfully` };
    }

    // fallback hard delete if not paranoid
    await record.destroy();
    return { message: `${this.Model.name} permanently deleted` };
  }
}
export default BaseService;
