/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import { GridColDef } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

export type defaultFilter = {
  field: string,
  operator: string,
  value: string,
  type: string,
  logicOperator: string,
}

interface Props {
  columns: GridColDef[],
  onFilterChange: (filters: { items: defaultFilter[] }) => void,
  filters: {
    items: defaultFilter[]
  }
}

interface DataOperator {
  value: string;
  label: string;
}

const dataOperatorString = [
  { value: 'LIKE', label: "Contains" },        // Usually implemented as 'LIKE %value%'
  { value: '=', label: "Equals" },
  { value: 'ILIKE', label: "Starts With" },    // Using ILIKE for case-insensitive match
  { value: 'ILIKE', label: "Ends With" },      // Using ILIKE for case-insensitive match
  { value: 'IS NULL', label: "Is Empty" },
  { value: 'IS NOT NULL', label: "Is Not Empty" },
  { value: 'IN', label: "Is Any Of" },
];

const dataOperatorBoolean = [
  { value: '=', label: "Is" },
];

const dataOperatorDate = [
  { value: '=', label: "Is" },
  { value: '!=', label: "Is Not" },
  { value: '>', label: "Is After" },
  { value: '>=', label: "Is On or After" },
  { value: '<', label: "Is Before" },
  { value: '<=', label: "Is On Or Before" },
  { value: 'IS NULL', label: "Is Empty" },
  { value: 'IS NOT NULL', label: "Is Not Empty" },
];

const dataOperatorNumber = [
  { value: '=', label: "=" },
  { value: '!=', label: "!=" },
  { value: '>', label: ">" },
  { value: '>=', label: ">=" },
  { value: '<', label: "<" },
  { value: '<=', label: "<=" },
  { value: 'IS NULL', label: "Is Empty" },
  { value: 'IS NOT NULL', label: "Is Not Empty" },
  { value: 'IN', label: "Is Any Of" },
];

const FormFilter: React.FC<Props> = (props) => {
  const defaultFilter = {
    field: '',
    operator: '',
    value: '',
    type: '',
    logicOperator: 'AND',
  };

  const defaultFiltersState = {
    items: [defaultFilter],
  };

  const [filters, setFilters] = useState(defaultFiltersState);

  const handleChange = (event: any, index: number) => {
    const { name, value, type, checked } = event.target || {};
    const rowColumn = props.columns.find((item) => item.field === (name === "field" ? value : filters.items[index].field));

    let newValue = value;
    if (type === 'checkbox') {
      newValue = checked ? 'true' : 'false';
    }

    if (rowColumn) {
      const newType = rowColumn.type || '';
      const updatedFilter = { [name]: newValue, type: name === "field" ? newType : filters.items[index].type };

      setFilters((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, ...updatedFilter } : item
        ),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, [name]: newValue } : item
        ),
      }));
    }
  };

  const handleDateChange = (date: any, index: number) => {
    const newValue = date ? date.format('YYYY-MM-DD') : '';
    setFilters((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, value: newValue } : item
      ),
    }));
  };

  const handleAddFilter = () => {
    setFilters((prev) => ({
      ...prev,
      items: [...prev.items, { ...defaultFilter }],
    }));
  };

  const handleRemoveFilter = (index: number) => {
    if (index === 0) {
      setFilters((prev) => ({ ...prev, items: [defaultFilter] }));
    } else {
      setFilters((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleRemoveAllFilters = () => {
    setFilters(defaultFiltersState);
  };

  useEffect(() => {
    const filteredItems = filters.items.filter(
      (filter) => filter.value !== '' && filter.field !== ''
    );

    console.log('{ items: filteredItems }', { items: filteredItems })
    if (filteredItems.length > 0) {
      props.onFilterChange({ items: filteredItems });
    } else {
      props.onFilterChange({ items: [] });
    }
    // props.onFilterChange(filters);
  }, [filters]);

  const getDataOperators = (type: string) => {
    switch (type) {
      case 'string':
        return dataOperatorString;
      case 'boolean':
        return dataOperatorBoolean;
      case 'number':
        return dataOperatorNumber;
      case 'date':
      case 'dateTime':
        return dataOperatorDate;
      default:
        return dataOperatorString;
    }
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.field && !item.type) {
          const column = props.columns.find((col) => col.field === item.field);
          if (column) {
            return { ...item, type: column.type || '' };
          }
        }
        return item;
      }),
    }));
  }, [props.columns]);

  const renderValueInput = (filter: { field?: string; operator?: string; value: any; type: any; logicOperator?: string; }, index: number) => {
    switch (filter.type) {
      case 'boolean':
        return (
          <Switch
            name="value"
            checked={filter.value === 'true'}
            onChange={(event) => handleChange(event, index)}
          />
        );
      case 'date':
      case 'dateTime':
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker 
              label="Value" 
              value={filter.value ? moment(filter.value, 'YYYY-MM-DD') : null}
              onChange={(date) => handleDateChange(date, index)}  
              sx={{ width: '100%' }} 
              slotProps={{ textField: { variant: 'standard', size: 'small' } }} 
            />
          </LocalizationProvider>
        );
      default:
        return (
          <TextField
            name="value"
            value={filter.value}
            onChange={(event) => handleChange(event, index)}
            label={'Value'}
            variant="standard"
            size="small"
            fullWidth
          />
        );
    }
  };

  return (
    <div style={{ padding: 5 }}>
      {filters.items.map((filter, index) => (
        <Box key={index} display="flex" alignItems="center" mb={0}>
          <Box sx={{ minWidth: 100 }}>
            {index > 0 && (
              <>
                <IconButton size="small" aria-label="delete" color="error" onClick={() => handleRemoveFilter(index)}>
                  <CloseIcon />
                </IconButton>
                <FormControl variant="standard" size="small" sx={{ mr: 1, minWidth: 20 }}>
                  <Select
                    labelId={`logicOperator-label-${index}`}
                    name="logicOperator"
                    value={filter.logicOperator}
                    onChange={(event) => handleChange(event, index)}
                    label={`logicOperator ${index + 1}`}
                  >
                    <MenuItem value={'AND'}>AND</MenuItem>
                    <MenuItem value={'OR'}>OR</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
          <FormControl variant="standard" size='small' sx={{ mr: 1, minWidth: 120 }}>
            <InputLabel id={`field-label-${index}`}>Column</InputLabel>
            <Select
              labelId={`field-label-${index}`}
              name="field"
              value={filter.field}
              onChange={(event) => handleChange(event, index)}
              label={`Column ${index + 1}`}
            >
              {props.columns.length > 0 && props.columns.filter((column) => column.field !== "action" && column.field !== "rowIndex" && (column.filterable === true || column.filterable === undefined)).map((item, index) => (
                <MenuItem key={index} value={item.field}>{item.headerName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" size='small' sx={{ mr: 1, minWidth: 120 }}>
            <InputLabel id={`operator-label-${index}`}>Operator</InputLabel>
            <Select
              labelId={`operator-label-${index}`}
              name="operator"
              value={filter.operator}
              onChange={(event) => handleChange(event, index)}
              label={`Operator ${index + 1}`}
            >
              {getDataOperators(filter.type).map((item, idx) => (
                <MenuItem key={idx} value={item.value}>{item.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ mr: 1, minWidth: 120 }}>
            {renderValueInput(filter, index)}
          </FormControl>
        </Box>
      ))}
      <Box display={'flex'} justifyContent={'space-between'} mt={2}>
        <Button size='small' startIcon={<AddIcon />} onClick={handleAddFilter}>
          Add Filter
        </Button>
        {filters.items.length > 1 && (
          <Button size='small' startIcon={<DeleteForeverIcon />} color="error" onClick={handleRemoveAllFilters}>
            Remove All Filters
          </Button>
        )}
      </Box>
    </div>
  );
};

export default FormFilter;
