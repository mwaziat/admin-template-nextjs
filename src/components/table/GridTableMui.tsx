/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, JSXElementConstructor, ReactElement, SetStateAction, useCallback } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridRowId, GridToolbar, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport, GridActionsCellItem, GridRowParams, GridActionsCellItemProps, GridFilterModel, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box, LinearProgress, styled } from '@mui/material';
import CustomToolbarAdd from './DataTables/CustomToolbarAdd';
import CustomToolbarRefresh from './DataTables/CustomToolbarRefresh';
import CustomToolbarDeleteMany from './DataTables/CustomToolbarDeleteMany';
import { toast } from 'react-toastify';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Encrypt } from '@/utils/crypt';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import CustomDialog from '../dialog';
import CustomToolbarFilter from './DataTables/CustomToolbarFilter';
import { defaultFilter } from './DataTables/component-filter/FormFilter';
import { FilterGroup, FilterObject, FilterQueryGenerator } from '@/app/api/utils/sequelize-filter-generator';
import { ViewData } from './queries';
import { Logs } from '@/utils/logs';

type dataToolbar = {
  isActive?: boolean
  modalComponent?: React.ReactNode
  modalDetails?: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  path?: string
  param?: any
  customComponent?: React.ReactNode
  handleClick?: () => void
  onDeleteClick?: (data: any) => void
}

type OpTypeFilter = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL' | 'BETWEEN' | 'NOT BETWEEN' | 'ILIKE' | 'MATCH';
type typeFilter = 'boolean' | 'number' | 'string' | 'date' | 'array'; 

export type EditModalProps = {
  data: any
  openModal: boolean
  setOpenModal: (val: boolean) => void
}

export type DetailModalProps = {
  data: any
  openModal: boolean
  setOpenModal: (val: boolean) => void
}

export type customComponentModal = {
  modalComponent: React.ReactNode
  modalDetails: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  handleClick?: () => void
  openModal: boolean
  setOpenModal: (val: boolean) => void
}

type dataColumnAction = {
  isActive?: boolean
  isShowEditButton?: boolean
  isShowDeleteButton?: boolean
  isShowDetailButton?: boolean
  isModalEdit?: boolean
  pathEdit?: string
  editModalComponent?: (props: EditModalProps) => React.ReactNode
  editModalDetails?: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  isModalDetail?: boolean
  pathDetail?: string
  detailModalComponent?: (props: DetailModalProps) => React.ReactNode
  detailModalDetails?: { title: string, maxWidth?: 'lg' | 'md' | 'sm' | 'xl' | 'xs', fullWidth?: boolean }
  onDeleteClick?: (data: any) => void
}

type serverSide = {
  isActive: boolean
  path: string
  defaultFilters?: {
    field: string,
    op: OpTypeFilter,
    value: any,
    type: typeFilter,
  }[]
  fields?: string[]
  exclude?: string[]
}


type filterData = {
  isActive: boolean
  filters?: (val: defaultFilter[]) => void
}

interface Props {
  rows?: GridRowsProp
  pageSize?: number
  columns: GridColDef[]
  checkboxSelection?: boolean
  isLoading?: boolean
  isReload?: boolean
  toolbarDefault?: boolean
  toolbarAdd?: dataToolbar
  toolbarRefresh?: dataToolbar
  toolbarDeleteMany?: dataToolbar
  toolbarColumns?: dataToolbar
  toolbarFilter?: dataToolbar
  toolbarDensity?: dataToolbar
  toolbarExport?: dataToolbar
  toolbarSearch?: dataToolbar
  customToolbar?: Array<any>
  defaultColumnsAction?: dataColumnAction
  serverSide?: serverSide
  customComponentModal?: customComponentModal[]
  filters?: filterData
}

interface GridTableMuiContext {
  refreshServerSide: boolean;
  setRefreshServerSide: React.Dispatch<SetStateAction<boolean>>
  openModalEdit: boolean;
  setOpenModalEdit: React.Dispatch<SetStateAction<boolean>>
  openModalDetail: boolean;
  setOpenModalDetail: React.Dispatch<SetStateAction<boolean>>
  rowSelected: object
  rowsData: Array<any>
}

export const GridTableMuiContext = createContext<GridTableMuiContext>({
  refreshServerSide: false,
  setRefreshServerSide: () => {},
  openModalEdit: false,
  setOpenModalEdit: () => {},
  openModalDetail: false,
  setOpenModalDetail: () => {},
  rowSelected: {},
  rowsData: []
})

const GridTableMui = (props: Props) => {
  const router = useRouter()
  const [rows, setRows] = React.useState<any>([])
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [dataRows, setDataRows] = React.useState({});
  const [ids, setIds] = React.useState<GridRowId[]>([]);
  const [columns, setColumns] = React.useState<GridColDef[]>([])
  const [openModalEdit, setOpenModalEdit] = React.useState(false)
  const [openModalDetail, setOpenModalDetail] = React.useState(false)
  const [refreshServerSide, setRefreshServerSide] = React.useState(false)
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: props.pageSize ? props.pageSize : 10,
    page: 0,
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [filters, setFilters] = React.useState<{items: defaultFilter[]}>({items: [{field: '', operator: '', value: '', type: '', logicOperator: 'AND'}]})

  React.useEffect(() => {
    if (props.rows !== undefined && props.serverSide === undefined){
      setRows(props.rows)
    }
  }, [props.rows])


  React.useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 100);
  }, [props.isLoading])

  React.useEffect(() => {
    if (props.columns !== undefined)
      if (props.defaultColumnsAction?.isActive) {
        const filteredColumns = props.columns.filter((col) => col.field !== "action");
        filteredColumns.push(
          {
            field: "action",
            headerName: "Action",
            type: "actions",
            width: 80,
            getActions: (params) => getColumnActions(params, props.defaultColumnsAction || {}),
          },
        )
        setColumns(filteredColumns)
      } else {
        setColumns(props.columns)
      }
  }, [props.columns])

  const getColumnActions = (params: GridRowParams<any>, columnActionConfig: dataColumnAction): ReactElement<GridActionsCellItemProps, string | JSXElementConstructor<any>>[] => {
    const actions: ReactElement<GridActionsCellItemProps, string | JSXElementConstructor<any>>[] = [];

    if (columnActionConfig.isShowEditButton) {
      actions.push(
        <GridActionsCellItem
          key="edit-action"
          icon={<EditIcon sx={{ color: 'warning.main' }} />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
          showInMenu
          sx={{ color: 'warning.main' }}
        />
      );
    }

    if (columnActionConfig.isShowDeleteButton) {
      actions.push(
        <GridActionsCellItem
          key="delete-action"
          icon={<DeleteIcon sx={{ color: 'error.main' }} />}
          label="Delete"
          onClick={() => typeof columnActionConfig.onDeleteClick === 'function' ? columnActionConfig.onDeleteClick(params.row) : undefined}
          showInMenu
          sx={{ color: 'error.main' }}
        />
      );
    }

    if (columnActionConfig.isShowDetailButton) {
      actions.push(
        <GridActionsCellItem
          key="detail-action"
          icon={<VisibilityIcon sx={{ color: 'info.main' }} />}
          label="Detail"
          onClick={() => handleDetail(params.row)}
          showInMenu
          sx={{ color: 'info.main' }}
        />
      );
    }
    return actions;
  };

  const handleEdit = (param: any) => {
    if (props.defaultColumnsAction?.isActive && props.defaultColumnsAction.isModalEdit) {
      setDataRows(param)
      setOpenModalEdit(!openModalEdit)
    } else if (props.defaultColumnsAction?.isActive && !props.defaultColumnsAction.isModalEdit) {
      if (props.defaultColumnsAction?.isActive && props.defaultColumnsAction.pathEdit !== undefined && props.defaultColumnsAction?.pathEdit !== '') {
        if (param !== undefined) {
          const encryptData = Encrypt(JSON.stringify(param))
          setCookie(props.defaultColumnsAction.pathEdit, encryptData, { secure: true })
        }
        router.push(props.defaultColumnsAction.pathEdit, { scroll: false });
      }
    }
  }

  const handleDetail = (param: any) => {
    if (props.defaultColumnsAction?.isActive && props.defaultColumnsAction.isModalDetail) {
      setOpenModalDetail(!openModalDetail)
    } else if (props.defaultColumnsAction?.isActive && !props.defaultColumnsAction.isModalDetail) {
      if (props.defaultColumnsAction?.isActive && props.defaultColumnsAction.pathDetail !== undefined && props.defaultColumnsAction?.pathDetail !== '') {
        if (param !== undefined) {
          const encryptData = Encrypt(JSON.stringify(param))
          setCookie(props.defaultColumnsAction.pathDetail, encryptData, { secure: true })
        }
        router.push(props.defaultColumnsAction.pathDetail, { scroll: false });
      }
    }
  }

  const handleRefresh = () => {
    if (typeof props.toolbarRefresh?.handleClick === 'function' && props.toolbarRefresh?.handleClick !== undefined && props.serverSide === undefined) {
      setIsLoading(true)
      props.toolbarRefresh.handleClick()
      setTimeout(() => {
        setIsLoading(false)
      }, 100);
    } else {
      setIsLoading(true)
      if (props.rows !== undefined && props.serverSide === undefined) {
        setRows(props.rows)
      } else {
        fetchData();
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 100);
    }
  }

  const handleDeleteMany = React.useCallback(() => {
    if (typeof props.toolbarDeleteMany?.onDeleteClick === 'function' && props.toolbarDeleteMany?.onDeleteClick !== undefined) {
      if (props.checkboxSelection === true) {
        if (ids.length > 0) {
          props.toolbarDeleteMany.onDeleteClick(ids)
        } else {
          toast.warn(`You Can't deleted data, please select data`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } else {
        toast.warn('Checkbook Selection Is Not Active', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  }, [ids])

  const handleFilterChange = (newFilters: React.SetStateAction<{ items: defaultFilter[]; }>) => {
    setFilters(newFilters);
  };

  const customToolbar = React.useCallback(() => {
    return (
      <Box display={'flex'} justifyContent={'space-between'}>
        <GridToolbarContainer>
          {props.toolbarAdd?.isActive && (<CustomToolbarAdd {...props.toolbarAdd} />)}
          {props.toolbarRefresh?.isActive && (<CustomToolbarRefresh {...props.toolbarRefresh} handleClick={() => handleRefresh()} />)}
          {props.toolbarDeleteMany?.isActive && props.checkboxSelection && (<CustomToolbarDeleteMany {...props.toolbarDeleteMany} handleClick={() => handleDeleteMany()} />)}
          {props.toolbarColumns?.isActive && (<GridToolbarColumnsButton />)}
          {props.toolbarFilter?.isActive && (<CustomToolbarFilter columns={columns} onFilterChange={(filters: { items: defaultFilter[] }) => handleFilterChange(filters)} />)}
          {/* {props.toolbarFilter?.isActive && (<GridToolbarFilterButton />)} */}
          {props.toolbarDensity?.isActive && (<GridToolbarDensitySelector />)}
        </GridToolbarContainer>
        <GridToolbarContainer>
          {props.toolbarSearch?.isActive && (<GridToolbarQuickFilter />)}
        </GridToolbarContainer>
      </Box>
    );
  }, [props, ids, columns])

  const fetchData = async () => {
    try {
      if(props.serverSide && props.serverSide?.isActive){
        setIsLoading(true);
  
        const filterObject: FilterObject = {
          skip: paginationModel.page,
          take: paginationModel.pageSize,
          filter: convertToFilterQueryGenerator(filters.items),
          fields: props.serverSide.fields,
          exclude: props.serverSide.exclude, 
        };
    
        const response = await ViewData(props.serverSide?.path!, filterObject)
    
        const rowsData = response.data.data.length > 0 ? response.data.data.map((item: any, index: number)=> {
          return {
            ...item,
            rowIndex: index + 1
          }
        }): []
        setRows(rowsData);
      } else {
        toast.warn(`Please, set up your data server side component`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

    } catch (error) {
      Logs('Grid_Table_Mui', JSON.stringify(error))
      console.error('Failed to fetch data: ', props.serverSide?.path!, error);
      toast.error('Failed to fetch data server side');
    } finally {
      setIsLoading(false);
      setRefreshServerSide(false);
    }
  };

  const convertToFilterQueryGenerator = (filters: defaultFilter[]): FilterQueryGenerator => {
    const filterQueryGenerator: FilterQueryGenerator = {
      operator: 'AND',
      filters: [],
    };
    
    if(filters.length > 0){
      filters.forEach((item) => {
        if (item.value === '' || item.field === '') {
          filterQueryGenerator.filters = [];
          return filterQueryGenerator;
        }
  
        let filterGroup = filterQueryGenerator.filters.find(
          (group) => group.operator === item.logicOperator
        );
    
        if (!filterGroup) {
          filterGroup = {
            operator: item.logicOperator === 'AND' ? 'AND' : 'OR',
            attributes: [],
          };
          filterQueryGenerator.filters.push(filterGroup);
        }
  
        filterGroup.attributes.push({
          field: item.field,
          op: item.operator as OpTypeFilter,
          value: item.value,
          type: item.type as typeFilter,
        });
      })
    }
  
    if (props.serverSide?.defaultFilters) {
      const defaultFilterGroup: FilterGroup = {
        operator: 'AND', 
        attributes: props.serverSide.defaultFilters,
      };

      filterQueryGenerator.filters.push(defaultFilterGroup);
    }

    if (filterQueryGenerator.filters.length === 0) {
      return {
        operator: 'AND',
        filters: [],
      };
    }
  
    return filterQueryGenerator;
  };

  React.useEffect(() => {
    if(props.serverSide && props.serverSide?.isActive){
      fetchData();
    }
  }, [filters, paginationModel, props.serverSide?.isActive]);

  React.useEffect(() => {
    if(refreshServerSide === true){
      fetchData();
    }
  }, [refreshServerSide]);

  React.useEffect(() => {
    if(props.isReload){
      setTimeout(() => {
        fetchData()
      }, 100);
    }
  }, [props.isReload])


  return (
    <React.Fragment>
      <GridTableMuiContext.Provider value={{
        refreshServerSide, 
        setRefreshServerSide,
        rowSelected: dataRows,
        rowsData: rows,
        openModalEdit,
        setOpenModalEdit,
        openModalDetail,
        setOpenModalDetail,
      }}>
        <Box sx={{ minHeight: '300px', width: '100%', }}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            /* initialState={{
              pagination: {
                paginationModel: paginationModel,
              },
            }} */
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 25, 50, 75, 100]}
            // onFilterModelChange={onFilterChange}
            slots={{
              toolbar: props.toolbarDefault ? GridToolbar : customToolbar,
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            // slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  variant: "outlined",
                  size: "small"
                }
              },
            }}
            checkboxSelection={props.checkboxSelection ? true : false}
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = rows.filter((row: any) =>
                selectedIDs.has(row.id),
              );
              setIds([...ids])
              setSelectedRows(selectedRows);
            }}
            loading={isLoading}
            disableColumnFilter
            style={{ flex: 1 }}
          />
        </Box>

        {props.defaultColumnsAction?.isActive && props.defaultColumnsAction.isModalEdit && props.defaultColumnsAction.editModalComponent && (
          <CustomDialog
            title={props.defaultColumnsAction.editModalDetails?.title ? props.defaultColumnsAction.editModalDetails.title : ''}
            maxWidth={props.defaultColumnsAction.editModalDetails?.maxWidth ? props.defaultColumnsAction.editModalDetails.maxWidth : 'md'}
            fullWidth={props.defaultColumnsAction.editModalDetails?.fullWidth ? props.defaultColumnsAction.editModalDetails.fullWidth : true}
            openDialog={openModalEdit}
            onClose={(val) => setOpenModalEdit(val)}
            bottomRight={false}
            actions={undefined}
          >
            {props.defaultColumnsAction.editModalComponent({
              data: dataRows,
              openModal: openModalEdit,
              setOpenModal: (val) => setOpenModalEdit(val)
            })}
          </CustomDialog>
        )}

        {props.defaultColumnsAction?.isActive && props.defaultColumnsAction.isModalDetail && props.defaultColumnsAction.detailModalComponent && (
          <CustomDialog
            title={props.defaultColumnsAction.detailModalDetails?.title ? props.defaultColumnsAction.detailModalDetails.title : ''}
            maxWidth={props.defaultColumnsAction.detailModalDetails?.maxWidth ? props.defaultColumnsAction.detailModalDetails.maxWidth : 'md'}
            fullWidth={props.defaultColumnsAction.detailModalDetails?.fullWidth ? props.defaultColumnsAction.detailModalDetails.fullWidth : true}
            openDialog={openModalDetail}
            onClose={(val) => setOpenModalDetail(val)}
            bottomRight={false}
            actions={undefined}
          >
            {props.defaultColumnsAction.detailModalComponent({
              data: dataRows,
              openModal: openModalEdit,
              setOpenModal: (val) => setOpenModalEdit(val)
            })}
          </CustomDialog>
        )}

        {props.customComponentModal && props.customComponentModal.length > 0 && props.customComponentModal.map((modalItem, modalIndex) => {
          return (
            <CustomDialog
              key={modalIndex + new Date().getTime()}
              title={modalItem.modalDetails?.title ? modalItem.modalDetails.title : ''}
              maxWidth={modalItem.modalDetails?.maxWidth ? modalItem.modalDetails.maxWidth : 'md'}
              fullWidth={modalItem.modalDetails?.fullWidth ? modalItem.modalDetails.fullWidth : true}
              openDialog={modalItem.openModal}
              onClose={(val) => modalItem.setOpenModal(val)}
              bottomRight={false}
              actions={undefined}
            >
              {modalItem.modalComponent}
            </CustomDialog>
          )
        })}
      </GridTableMuiContext.Provider>
    </React.Fragment>
  )
}

export default GridTableMui

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  paddingTop: '5px',
  paddingBottom: '5px',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}))

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}