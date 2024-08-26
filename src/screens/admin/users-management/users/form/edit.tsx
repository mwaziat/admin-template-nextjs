/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Box, Grid, TextField, Button, Autocomplete } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import { ToastSuccess, ToastWarning } from '@/utils/toastAlert';
import { UpdateData, ViewDataRoles } from '../queries';
import { GridTableMuiContext } from '@/components/table/GridTableMui';
import { RoleAttributes } from '@/types/roles';
import { isEmailValidator } from '@/utils/validateEmail';
import { UserAttributes } from '@/types/users';

const EditUser = () => {
  const gridTableMuiContext = useContext(GridTableMuiContext)
  const [roles, setRoles] = useState<{id: number, label: string}[]>([])

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Name is Required'),
    firstName: yup
      .string()
      .required('First Name is Required'),
    lastName: yup
      .string(),
    username: yup
      .string()
      .min(3, 'Username minimum 3 character')
      .required('Username is Required'),
    email: yup
      .string()
      .email("Format email not valid")
      .required('Email is Required')
      .test("is-valid", (message: any) => `${message.path} not valid`, (value: any) => value ? isEmailValidator(value) : new yup.ValidationError("Invalid value")),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/,
        'Must have at least one letter and one number'
      ),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], 'Confirm password must match the password'),
    phone: yup
      .string(),
    address: yup
      .string(),
    city: yup
      .string(),
    postalCode: yup
      .string(),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      roles: [] as {id: number, label: string}[],
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      try {
        const res = await UpdateData(values)
        if(res.status && res.data !== undefined){
          ToastSuccess('Success update data')
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
      const row = gridTableMuiContext.rowSelected as UserAttributes
      const roleFormatted =  row.roles && Array.isArray(row.roles) ? row.roles.map((item) => {
        return {
          id: item.id,
          label: item.name
        }
      }): []
      formik.setValues((prev) => ({
        ...prev,
        id: row.id,
        name: row.name,
        firstName: row.firstName,
        lastName: row.lastName,
        username: row.username,
        email: row.email,
        phone: row.phone,
        address: row.address,
        roles: roleFormatted
      }))
    }
  }, [gridTableMuiContext.rowSelected])

  const fetchDataRoles = async () => {
    try {
      const res = await ViewDataRoles()
      if(res.status && res.data !== undefined){
        const data = res.data as RoleAttributes[]
        const formattedRole = data.map((item) => {
          return {
            id: item.id,
            label: item.name
          }
        })
        setRoles(formattedRole)
      } else {
        setRoles([])
        ToastWarning(res.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDataRoles()
  }, [])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="firstName"
            label="First Name"
            variant="outlined"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={!!formik.errors.firstName}
            helperText={formik.errors.firstName}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="lastName"
            label="Last Name"
            variant="outlined"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={!!formik.errors.lastName}
            helperText={formik.errors.lastName}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
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
        <Grid item xs={6}>
          <TextField
            fullWidth
            size='small'
            id="username"
            label="Username"
            variant="outlined"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.errors.username}
            helperText={formik.errors.username}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size='small'
            id="email"
            label="Email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={!!formik.errors.email}
            helperText={formik.errors.email}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            id="size-small-standard"
            size="small"
            options={roles}
            multiple
            getOptionLabel={(option) => option.label}
            value={formik.values.roles}
            onChange={(event, value) => {
              formik.setFieldValue('roles', value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Roles"
                placeholder="Roles"
                variant="outlined"
                error={!!formik.errors.roles}
                helperText={typeof formik.errors.roles === 'string' ? formik.errors.roles : undefined}
                onBlur={formik.handleBlur}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.errors.password}
            helperText={formik.errors.password}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="confirm_password"
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            error={!!formik.errors.confirm_password}
            helperText={formik.errors.confirm_password}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="phone"
            label="Phone"
            variant="outlined"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={!!formik.errors.phone}
            helperText={formik.errors.phone}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="city"
            label="City"
            variant="outlined"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={!!formik.errors.city}
            helperText={formik.errors.city}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            id="postalCode"
            label="Postal Code"
            variant="outlined"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            error={!!formik.errors.postalCode}
            helperText={formik.errors.postalCode}
            onBlur={formik.handleBlur}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            id="address"
            label="Address"
            variant="outlined"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={!!formik.errors.address}
            helperText={formik.errors.address}
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

export default EditUser