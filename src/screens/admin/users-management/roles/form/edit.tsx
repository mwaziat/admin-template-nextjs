/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Box, Grid, TextField, Button } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import { RoleContext } from '..';
import { ToastSuccess, ToastWarning } from '@/utils/toastAlert';
import { UpdateData } from '../queries';
import { GridTableMuiContext } from '@/components/table/GridTableMui';
import { RoleAttributes } from '@/types/roles';

const EditRole = () => {
  const gridTableMuiContext = useContext(GridTableMuiContext)
  const roleContext = useContext(RoleContext)

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Name is Required'),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        const res = await UpdateData(values)
        if(res.status && res.data !== undefined){
          ToastSuccess('Success Create data')
          actions.resetForm()
          gridTableMuiContext.setRefreshServerSide(true)
          gridTableMuiContext.setOpenModalEdit(false)
        } else {
          ToastWarning(res.error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    if(Object.keys(gridTableMuiContext.rowSelected).length > 0){
      const row = gridTableMuiContext.rowSelected as RoleAttributes
      formik.setValues({
        id: row.id,
        name: row.name,
        description: row.description
      })
    }
  }, [gridTableMuiContext.rowSelected])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            id="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={!!formik.errors.name}
            helperText={formik.errors.name}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            id="description"
            label="Description"
            variant="outlined"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={!!formik.errors.description}
            helperText={formik.errors.description}
            onBlur={formik.handleBlur}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ marginTop: 5, }}>
            <Button sx={{ float: 'right' }} variant="contained" onClick={() => formik.handleSubmit()} color="primary">Save</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EditRole