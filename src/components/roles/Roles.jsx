import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FilledInput, Grid, IconButton, InputAdornment, Switch, Typography } from '@mui/material';
import { Check, CloseOutlined, Delete, EditOutlined, SearchOutlined, Warning } from '@mui/icons-material';
import { kGreenColor, kGreenLight } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { addRole, deleteRole, editRole, fetchRoles } from '../../controllers/roles';
import { useForm } from 'react-hook-form';
import { fetchPermissions } from '../../controllers/permissins';

const RolesComponent = () => {

    const { isLoading, data, isError, isSuccess } = useQuery('roles', fetchRoles)
    const { isLoading: loadingPermissions, data: permissionsData } = useQuery('permissions', fetchPermissions)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState({})
    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingRole } = useMutation(addRole, {
        onMutate: (error, variables, context) => {
            setAddRoleDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries('roles')
            reset()
        },
    })


    const editRoleMutation = useMutation(editRole, {
        onMutate: (error, variables, context) => {
            setEditRoleDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            // console.log('Edited roles')
            queryClient.invalidateQueries('roles')
            reset()
        },
    })

    const disableRoleMutation = useMutation(editRole, {
        onMutate: (error, variables, context) => {
            // setAddUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Disabled Role')
            queryClient.invalidateQueries('roles')
        },
    })

    function getFormattedDate(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '-' + day + '-' + year;
    }

    const deleteRoleMutation = useMutation(deleteRole, {
        onMutate: (error, variables, context) => {
            setAddRoleDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            // console.log('Deleted roles')
            queryClient.invalidateQueries('roles')
        },
    })


    const { register, handleSubmit, reset, setValue } = useForm()

    const columns = [

        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (cellValue) => {
                return (
                    <Grid container sx={{ backgroundColor: '#f0f0f0', borderRadius: 3, p: 1 }} direction='row' alignItems='center'>
                        <Grid item>
                            <Check sx={{ fontSize: 13, color: '#444', mr: 1 }} />
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['name']}</Typography>
                        </Grid>
                    </Grid>


                )
            }
        },

        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 150,
            renderCell: (cellValue) => {
                console.log()
                return (
                    <Typography sx={{ fontSize: 13 }}>{getFormattedDate(new Date(cellValue['row']['createdAt']))}</Typography>

                )
            }

        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container justifyContent='space-evenly' alignItems='center' sx={{ backgroundColor: cellValue['row']['status'] === 'active' ? kGreenLight : null, py: 1, borderRadius: 1 }}>
                        {cellValue['row']['status'] === 'active' && <Check sx={{ fontSize: 13, color: kGreenColor }} />}
                        {cellValue['row']['status'] === 'inactive' && <Warning sx={{ fontSize: 13, color: 'yellow' }} />}
                        <Typography sx={{ color: cellValue['row']['status'] === 'active' ? kGreenColor : 'yellowgreen', fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['status'] === 'active' ? 'Active' : 'Inactive'}</Typography>
                        <Switch color={cellValue['row']['status'] === 'active' ? 'success' : 'error'} checked={cellValue['row']['status'] === 'active'} onChange={(e) => {
                            setSelectedRole(cellValue['row'])
                            disableRoleMutation.mutate({ ...cellValue['row'], status: e.target.checked ? 'active' : 'inactive' })

                        }} size='small' sx={{ size: 15 }} />

                    </Grid>
                )
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container>
                        <Grid item>
                            {/* <IconButton ><Visibility sx={{ fontSize: 17 }} /></IconButton> */}
                            <Drawer open={editRoleDrawerOpen} onClose={() => { setEditRoleDrawerOpen(false) }} anchor='right' >
                                <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item >
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit roles</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit roles Info</Typography>

                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={() => setEditRoleDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                    </Grid>


                                </Grid>

                                <form onSubmit={handleSubmit(handleEditRole)} style={{ width: 400 }}>



                                    <input
                                        placeholder='First Name'
                                        style={{ ...textInputFieldStyle }}

                                        {...register('name')}
                                    />

                                    <input
                                        placeholder='Description'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('description')}

                                    />

                                    {!loadingPermissions && permissionsData && permissionsData.map(permission => {
                                        return <Grid key={permission.id} container sx={{ p: 1 }} alignItems='center' direction='row'>
                                            <Grid item>
                                                <input key={permission.id} type='checkbox' {...register('permission')} id={permission.id} value={permission.id} />
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ fontSize: 13 }} component='label' for={permission.id} >{permission.name}</Typography>

                                            </Grid>
                                        </Grid>
                                    })
                                    }

                                    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit roles</Button>
                                    </Box>

                                </form>




                            </Drawer>
                            <IconButton onClick={() => {
                                setValue('name', cellValue['row']['name'])
                                setValue('desctiption', cellValue['row']['description'])
                                // console.log(cellValue['row']['permissions'].map(p => p.id))
                                setValue('permission', cellValue['row']['permissions'].map(p => p.id))
                                setSelectedRole(cellValue['row'])
                                setEditRoleDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => {
                                setDeleteModalOpen(true)
                                setSelectedRole(cellValue['row'])
                            }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => { setDeleteModalOpen(false) }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete Role?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete role ${selectedRole && selectedRole['name']}?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {
                                        console.log(cellValue['row']['id'])
                                        setDeleteModalOpen(false)
                                        setSelectedRole(cellValue['roe'])
                                        deleteRoleMutation.mutate(cellValue['row']['id'])
                                    }} autoFocus>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                )
            }
        },

    ];

    const handleAddRole = (data) => {
        mutate({ name: data.name, description: data.description, permissions: data.permission || [], })
        // reset()
    }

    const handleEditRole = (data) => {
        console.log(data)
        editRoleMutation.mutate({ id: selectedRole['id'], name: data.name, description: data.description, permissions: data.permission, status: selectedRole['status'] })
    }

    const [editRoleDrawerOpen, setEditRoleDrawerOpen] = useState(false)
    const [addRoleDrawerOpen, setAddRoleDrawerOpen] = useState(false)


    const createRowsDataFromResponse = (data) => {

        return data.map(role => {
            return {
                id: role.id,
                name: role && role.name,
                description: role.description,
                createdAt: role.created_at,
                status: role.status,
                permissions: role.permissions
            }
        })
    }

    if (isLoading || deleteRoleMutation.isLoading || isAddingRole || editRoleMutation.isLoading) {
        return <FullPageLoading />
    }

    else if (isError) {
        return 'Error Loading...'
    }
    else if (!isLoading && isSuccess && data) {
        return (
            <Box sx={{ height: 400, width: '100%' }}>
                <Grid container justifyContent='space-between' alignItems='center'>

                    <Grid item sx={{ mb: 1 }}>
                        <FilledInput
                            disableUnderline
                            startAdornment={<InputAdornment position="start"><SearchOutlined sx={{ fontSize: 20 }} /></InputAdornment>}
                            // fullWidth
                            style={{ width: 400, height: 40, border: 'none', borderBottom: '0px', outline: 'none' }}
                        />
                    </Grid>
                    <Grid item sx={{ mb: 1 }}>
                        <Button onClick={() => {
                            reset()
                            setAddRoleDrawerOpen(true)
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Role
                        </Button>

                        <Drawer open={addRoleDrawerOpen} onClose={() => { setAddRoleDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New roles</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New roles by giving a Role</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddRoleDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddRole)} style={{ width: 400 }}>



                                <input
                                    placeholder='Name'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('name')}
                                />

                                <input
                                    placeholder='Description'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('description')}
                                />


                                {!loadingPermissions && permissionsData && permissionsData.map(permission => {
                                    return <Grid key={permission.id} container sx={{ p: 1 }} alignItems='center' direction='row'>
                                        <Grid item>
                                            <input color={kGreenColor} key={permission.id} type='checkbox' {...register('permission')} id={permission.id} value={permission.id} />
                                        </Grid>
                                        <Grid item>
                                            <Typography sx={{ fontSize: 13 }} component='label' for={permission.id} >{permission.name}</Typography>

                                        </Grid>
                                    </Grid>
                                })
                                }


                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Role</Button>
                                </Box>


                            </form>




                        </Drawer>

                    </Grid>
                </Grid>

                <DataGrid
                    disableSelectionOnClick={true}
                    rows={createRowsDataFromResponse(data)}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableColumnSelector
                />
            </Box>
        );
    }
    else {
        return <FullPageLoading />
    }
}

export default RolesComponent