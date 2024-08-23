
export interface FilterCondition {
  field: string;
  op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL' | 'ALL' | 'ANY' | 'SOME' | 'EXISTS' | 'UNION' | 'INTERSECT' | 'EXCEPT' | 'MINUS';
  value: any;
  type: 'boolean' | 'number' | 'string' | 'date';
}

export interface FilterGroup {
  operator: 'AND' | 'OR';
  filters: Array<{
    attributes: FilterCondition[];
  }>;
}

export interface FilterObject {
  filter?: FilterGroup;
}

export interface SQLQueryParameters {
  skip: number;
  take: number;
  query: string;
  filterGenerator: string;
}

export type GenerateFilterSQLType = (filterObject: FilterObject) => string;

export type GenerateSQLQueryType = (skip: number, take: number, query: string, filterGenerator: string) => string;

export type GenerateTotalSQLQueryType = (query: string, filterGenerator: string) => string;

export const GenerateFilterSQL: GenerateFilterSQLType = (filterObject) => {
  let sqlWhere = '';

  if (filterObject.filter) {
    sqlWhere += '(';
    const operator = filterObject.filter.operator === 'AND' ? 'AND' : 'OR';

    filterObject.filter.filters.forEach((filter, index) => {
      if (index > 0) {
        sqlWhere += ` ${operator} `;
      }

      sqlWhere += '(';
      filter.attributes.forEach((condition, idx) => {
        if (idx > 0) {
          sqlWhere += ' AND ';
        }
        if (
          condition.op === '=' ||
          condition.op === '!=' ||
          condition.op === '>' ||
          condition.op === '<' ||
          condition.op === '>=' ||
          condition.op === '<='
        ) {
          // Handling boolean values
          if (condition.type === 'boolean') {
            sqlWhere += `${condition.field} ${condition.op} ${condition.value ? 1 : 0}`;
          } else if (condition.type === 'number') {
            sqlWhere += `${condition.field} ${condition.op} ${Math.floor(condition.value)}`;
          } else if (condition.type === 'string') {
            sqlWhere += `${condition.field} ${condition.op} ${"'" + condition.value + "'"}`;
          } else {
            sqlWhere += `${condition.field} ${condition.op} ${typeof condition.value === 'string' ? "'" + condition.value + "'" : condition.value}`;
          }
        } else if (condition.op === 'LIKE') {
          sqlWhere += `${condition.field} LIKE '${condition.value}'`;
        } else if (condition.op === 'IN') {
          sqlWhere += `${condition.field} IN (${condition.value.join(', ')})`;
        } else if (condition.op === 'NOT IN') {
          sqlWhere += `${condition.field} NOT IN (${condition.value.join(', ')})`;
        } else if (condition.op === 'IS NULL') {
          sqlWhere += `${condition.field} IS NULL`;
        } else if (condition.op === 'IS NOT NULL') {
          sqlWhere += `${condition.field} IS NOT NULL`;
        } else if (condition.op === 'ALL') {
          sqlWhere += `${condition.field} = ALL (${condition.value})`;
        } else if (condition.op === 'ANY' || condition.op === 'SOME') {
          sqlWhere += `${condition.field} ${condition.op} (${condition.value})`;
        } else if (condition.op === 'EXISTS') {
          sqlWhere += `EXISTS (${condition.value})`;
        } else if (condition.op === 'UNION') {
          sqlWhere += `(${condition.value.join(' UNION ')})`;
        } else if (condition.op === 'INTERSECT') {
          sqlWhere += `(${condition.value.join(' INTERSECT ')})`;
        } else if (condition.op === 'EXCEPT' || condition.op === 'MINUS') {
          sqlWhere += `(${condition.value.join(' EXCEPT ')})`;
        } else {
          // Default to equal if operator not recognized
          sqlWhere += `${condition.field} = ${typeof condition.value === 'string' ? "'" + condition.value + "'" : condition.value}`;
        }
      });
      sqlWhere += ')';
    });

    sqlWhere += ')';
  }

  return sqlWhere;
};

// Implementasi GenerateSQLQuery
export const GenerateSQLQuery: GenerateSQLQueryType = (skip, take, query, filterGenerator) => {
  const limitClause = `LIMIT ${skip}, ${take}`;
  const sqlQuery = `${query} WHERE ${filterGenerator} ${limitClause}`;
  return sqlQuery;
};

// Implementasi GenerateTotalSQLQuery
export const GenerateTotalSQLQuery: GenerateTotalSQLQueryType = (query, filterGenerator) => {
  const totalQuery = `SELECT COUNT(*) AS total FROM (${query} WHERE ${filterGenerator}) AS totalQuery`;
  return totalQuery;
};
