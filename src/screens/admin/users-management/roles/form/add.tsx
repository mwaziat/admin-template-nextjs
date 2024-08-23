'use client'
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button, Autocomplete } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import { RoleContext } from '..';
import { isEmailValidator } from '@/utils/validateEmail';
import { ToastSuccess, ToastWarning } from '@/utils/toastAlert';
import { ToolbarAddContext } from '@/components/table/DataTables/CustomToolbarAdd';
import { CreateData } from '../queries';
import { GridTableMuiContext } from '@/components/table/GridTableMui';

const AddRole = () => {
  const toolbarAddContext = useContext(ToolbarAddContext)
  const gridTableMuiContext = useContext(GridTableMuiContext)
  const roleContext = useContext(RoleContext)

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Name is Required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      console.log("formik", values)
      try {
        const res = await CreateData(values)
        if(res.status && res.data !== undefined){
          ToastSuccess('Success Create data')
          actions.resetForm()
          toolbarAddContext.setOpen(!toolbarAddContext.open)
          gridTableMuiContext.setRefreshServerSide(true)
        } else {
          ToastWarning(res.error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

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

export default AddRole