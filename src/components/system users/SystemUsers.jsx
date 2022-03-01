import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FilledInput, Grid, IconButton, InputAdornment, Switch, Typography } from '@mui/material';
import { Check, CloseOutlined, Delete, Download, EditOutlined, SearchOutlined, Tune } from '@mui/icons-material';
import { kGreenColor, kGreenLight } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addUser, deleteUser, editUser, fetchUsers } from '../../controllers/users';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { fetchRoles } from '../../controllers/roles';
import { useForm } from 'react-hook-form';







const SystemUsers = () => {



    const getRoleNameFromId = (id, roles) => {
        return roles.find(role => role.id === id)
    }


    const { isLoading, isError, data, isSuccess } = useQuery('users', fetchUsers)
    const { isLoading: loadingRoles, data: rolesData } = useQuery('roles', fetchRoles)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingUser } = useMutation(addUser, {
        onMutate: (error, variables, context) => {
            setAddUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added User')
            queryClient.invalidateQueries('users')
            reset()
        },
    })


    const editUserMutation = useMutation(editUser, {
        onMutate: (error, variables, context) => {
            setEditUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited User')
            queryClient.invalidateQueries('users')
            reset()
        },
    })

    const deleteUserMutation = useMutation(deleteUser, {
        onMutate: (error, variables, context) => {
            setAddUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted User')
            queryClient.invalidateQueries('users')
        },
    })


    const { register, handleSubmit, reset, setValue } = useForm()

    const columns = [

        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['name']}</Typography>

                )
            }
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['email']}</Typography>

                )
            }
        },

        {
            field: 'role',
            headerName: 'Role',
            width: 190,
            renderCell: (cellValue) => {
                return (

                    rolesData ? <Grid container sx={{ backgroundColor: '#f0f0f0', borderRadius: 3, p: 1 }} direction='row' alignItems='center'>
                        <Grid item>
                            <Check sx={{ fontSize: 13, color: '#444', mr: 1 }} />
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>{getRoleNameFromId(cellValue['row']['role'], rolesData) && getRoleNameFromId(cellValue['row']['role'], rolesData).name}</Typography>
                        </Grid>
                    </Grid> : <Typography></Typography>

                )
            }
        },

        {
            field: 'createdAt',
            headerName: 'Crated At',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['createdAt']}</Typography>

                )
            }

        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container justifyContent='space-evenly' alignItems='center' sx={{ backgroundColor: kGreenLight, py: 1, borderRadius: 1 }}>
                        <Check sx={{ fontSize: 13, color: kGreenColor }} />
                        <Typography sx={{ color: kGreenColor, fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['status'] === 'active' ? 'Active' : 'Inactive'}</Typography>
                        <Switch color={cellValue['row']['status'] === 'active' ? 'success' : 'error'} checked={cellValue['row']['status'] === 'active'} onChange={(e) => { console.log(e.target.checked) }} size='small' sx={{ size: 15 }} />

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
                            <Drawer open={editUserDrawerOpen} onClose={() => { setEditUserDrawerOpen(false) }} anchor='right' >
                                <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item >
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit User</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit User Info</Typography>

                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={() => setEditUserDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                    </Grid>


                                </Grid>

                                <form onSubmit={handleSubmit(handleEditUser)} style={{ width: 400 }}>



                                    <input
                                        placeholder='First Name'
                                        style={{ ...textInputFieldStyle }}

                                        {...register('first_name')}
                                    />

                                    <input
                                        placeholder='Middle Name'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('middle_name')}
                                    // defaultValue={selectedUser['middle_name']}

                                    />

                                    <input
                                        placeholder='Last Name'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('last_name')}
                                    // defaultValue={selectedUser['last_name']}

                                    />

                                    <input
                                        placeholder='Phone'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('phone')}
                                    // defaultValue={selectedUser['phone']}

                                    />

                                    <input
                                        placeholder='Username'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('username')}
                                    // defaultValue={selectedUser['username']}



                                    />

                                    <input
                                        placeholder='Email'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('email')}
                                    // defaultValue={selectedUser['email']}


                                    />

                                    <input
                                        placeholder='Password'
                                        type='password'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('password')}
                                    // defaultValue={selectedUser['password']}

                                    />
                                    <input
                                        placeholder='Confirm Password'
                                        type='password'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('confirm_password')}
                                    // defaultValue={selectedUser['confirm_password']}

                                    />

                                    {!loadingRoles && rolesData && <select value={selectedUser['role']}
                                        {...register('role')} style={{ ...textInputFieldStyle }} placeholder='Role'>
                                        {
                                            rolesData.map(role => {
                                                return <option key={role.id} value={role.id}>{role.name}</option>
                                            })
                                        }
                                    </select>}

                                    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit User</Button>
                                    </Box>


                                </form>




                            </Drawer>
                            <IconButton onClick={() => {
                                setValue('username', cellValue['row']['username'])
                                setValue('first_name', cellValue['row']['first_name'])
                                setValue('last_name', cellValue['row']['last_name'])
                                setValue('middle_name', cellValue['row']['middle_name'])
                                setValue('email', cellValue['row']['email'])
                                setValue('phone', cellValue['row']['phone'])
                                setValue('password', cellValue['row']['password'])
                                setValue('confirm_password', cellValue['row']['confirm_password'])
                                setSelectedUser(cellValue['row'])
                                setEditUserDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => { setDeleteModalOpen(true) }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => { setDeleteModalOpen(false) }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete User?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete User ${selectedUser['first_name']} ${selectedUser['last_name']}?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {
                                        console.log(cellValue['row']['id'])
                                        setDeleteModalOpen(false)
                                        deleteUserMutation.mutate(cellValue['row']['id'])
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

    const handleAddUser = (data) => {
        mutate({ username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name })
        // reset()
    }

    const handleEditUser = (data) => {
        console.log(data)
        editUserMutation.mutate({ id: selectedUser['id'], username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name })
        // editUserForm.reset()
    }

    const [editUserDrawerOpen, setEditUserDrawerOpen] = useState(false)
    const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false)


    const createRowsDataFromResponse = (data) => {
        return data.results.rows.map(user => {
            return {
                id: user.id,
                name: `${user.first_name} ${user.middle_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                username: user.username,
                role: user.role,
                status: user.status,
                createdAt: '12-12-2022'
            }
        })
    }

    if (isLoading || loadingRoles || deleteUserMutation.isLoading || isAddingUser || editUserMutation.isLoading) {
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
                            setAddUserDrawerOpen(true)
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add User
                        </Button>

                        <Drawer open={addUserDrawerOpen} onClose={() => { setAddUserDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New User</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New User by giving a Role</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddUserDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddUser)} style={{ width: 400 }}>



                                <input
                                    placeholder='First Name'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('first_name')}
                                />

                                <input
                                    placeholder='Middle Name'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('middle_name')}
                                />

                                <input
                                    placeholder='Last Name'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('last_name')}
                                />

                                <input
                                    placeholder='Phone'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('phone')}
                                />

                                <input
                                    placeholder='Username'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('username')}
                                />

                                <input
                                    placeholder='Email'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('email')}
                                />

                                <input
                                    placeholder='Password'
                                    type='password'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('password')}
                                />
                                <input
                                    placeholder='Confirm Password'
                                    type='password'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('confirm_password')}
                                />

                                {!loadingRoles && rolesData && <select {...register('role')} style={{ ...textInputFieldStyle }} placeholder='Role'>
                                    {
                                        rolesData.map(role => {
                                            return <option key={role.id} value={role.id}>{role.name}</option>
                                        })
                                    }
                                </select>}

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add User</Button>
                                </Box>


                            </form>




                        </Drawer>

                        <Button sx={{ mr: 1, fontWeight: '600', color: kGreenColor, fontSize: 10 }} startIcon={<Download />} >
                            Export
                        </Button>
                        <Button sx={{ fontWeight: '600', color: kGreenColor, fontSize: 10 }} startIcon={<Tune />} >
                            Add Filter
                        </Button>
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

export default SystemUsers