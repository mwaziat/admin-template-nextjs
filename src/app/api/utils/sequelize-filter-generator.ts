import { ModelStatic, Op, FindOptions, literal, Order, IncludeOptions } from 'sequelize';
import { Model } from 'sequelize';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

export interface FilterCondition {
  field: string;
  op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL' | 'BETWEEN' | 'NOT BETWEEN' | 'ILIKE' | 'MATCH';
  value: any;
  type: 'boolean' | 'number' | 'string' | 'date' | 'array'; // Added 'array' for BETWEEN and NOT BETWEEN
}

export interface FilterGroup {
  operator: 'AND' | 'OR';
  attributes: FilterCondition[];
}

export interface FilterQueryGenerator {
  operator: 'AND' | 'OR';
  filters: FilterGroup[];
}

export interface SortCondition {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface FilterObject {
  skip: number;
  take: number;
  filter: FilterQueryGenerator;
  fields?: string[];   // Optional: Fields to include
  exclude?: string[];  // Optional: Fields to exclude
  sort?: SortCondition[]; // Optional: Sorting conditions
}

export const generateSequelizeFilter = (filterObject: FilterQueryGenerator) => {
  const whereClause = filterObject.filters
    .map(filterGroup => {
      // Abaikan filterGroup yang tidak memiliki attributes atau attributes kosong
      if (filterGroup.attributes.length === 0) {
        return null;
      }

      const attributesCondition = filterGroup.attributes.map(condition => {
        let op;

        switch (condition.op) {
          case '=':
            op = Op.eq;
            break;
          case '!=':
            op = Op.ne;
            break;
          case '>':
            op = Op.gt;
            break;
          case '<':
            op = Op.lt;
            break;
          case '>=':
            op = Op.gte;
            break;
          case '<=':
            op = Op.lte;
            break;
          case 'LIKE':
            op = Op.like;
            // Tambahkan wildcard % pada LIKE
            condition.value = `%${condition.value}%`;
            break;
          case 'ILIKE': // PostgreSQL only
            op = Op.iLike;
            // Tambahkan wildcard % pada ILIKE
            condition.value = `%${condition.value}%`;
            break;
          case 'IN':
            op = Op.in;
            break;
          case 'NOT IN':
            op = Op.notIn;
            break;
          case 'IS NULL':
            return { [condition.field]: { [Op.is]: null } };
          case 'IS NOT NULL':
            return { [condition.field]: { [Op.not]: null } };
          case 'BETWEEN':
            return { [condition.field]: { [Op.between]: condition.value } };
          case 'NOT BETWEEN':
            return { [condition.field]: { [Op.notBetween]: condition.value } };
          case 'MATCH': // MySQL full-text search
            return literal(`MATCH(${condition.field}) AGAINST(${condition.value})`);
          default:
            throw new Error(`Operator ${condition.op} tidak didukung.`);
        }

        return { [condition.field]: { [op]: condition.value } };
      });

      return filterGroup.operator === 'AND'
        ? { [Op.and]: attributesCondition }
        : { [Op.or]: attributesCondition };
    })
    .filter(group => group !== null); // Hanya simpan group yang tidak null

  return whereClause.length > 0
    ? (filterObject.operator === 'AND'
        ? { [Op.and]: whereClause }
        : { [Op.or]: whereClause })
    : {}; // Jika tidak ada filter, kembalikan objek kosong
};


export async function ViewData<T extends Model>(
  model: ModelStatic<T>,
  filterObject: FilterObject,
  includes?: IncludeOptions[]
): Promise<PaginationResult<T>> {
  const { filter, skip, take, fields, exclude, sort } = filterObject;
  const sequelizeFilter = generateSequelizeFilter(filter);

  // Mendapatkan daftar field dari model
  const allFields = Object.keys(model.rawAttributes);
  
  // Menentukan field yang harus disertakan berdasarkan pengecualian
  const includedFields = exclude
    ? allFields.filter(field => !exclude.includes(field))
    : fields;

  // Menyiapkan opsi sorting
  const order: Order = sort?.map(sortCondition => [
    sortCondition.field, sortCondition.direction
  ]) as Order;

  // Opsi query Sequelize
  const options: FindOptions<T> = {
    where: sequelizeFilter,
    include: includes!,
    attributes: includedFields,
    order,
    limit: take,
    offset: skip,
  };

  const result = await model.findAndCountAll(options);

  const totalPages = Math.ceil(result.count / take);

  const pagination = {
    totalItems: result.count,
    currentPage: Math.floor(skip / take) + 1,
    totalPages,
    itemsPerPage: take,
  };

  // Mengembalikan data dan pagination
  return {
    data: result.rows as T[],
    pagination,
  };
}
