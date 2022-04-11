import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, Autocomplete, TextField, FilledInput, Grid, IconButton, InputAdornment, Switch, Typography } from '@mui/material';
import { Check, CloseOutlined, Delete, Download, EditOutlined, SearchOutlined, Tune, Warning } from '@mui/icons-material';
import { kGreenColor, kGreenLight } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addUser, deleteUser, editUser, fetchUsers } from '../../controllers/users';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { fetchRoles } from '../../controllers/roles';
import { useForm } from 'react-hook-form';
import { fetchConfigs } from '../../controllers/configs';

export const getDateFormated = (dateString) => {
    let date = new Date(dateString)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let d = date.getDate()
    return `${year}-${month}-${d}`
}


const SystemUsers = () => {

    const getRoleNameFromId = (id, roles) => {
        return roles.find(role => role.id === id)
    }

    const { isLoading, isError, data: usersData, isSuccess, } = useQuery('users', fetchUsers)
    const { isLoading: loadingRoles, data: rolesData } = useQuery('roles', fetchRoles)
    const { isLoading: loadingConfigsData, data: systemConfigData } = useQuery('configs', fetchConfigs)


    const [representativeID, setRepresentativeID] = useState()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingUser, isError: errorAddingUser, data: addUserError } = useMutation(addUser, {
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

    const disableUserMutation = useMutation(editUser, {
        onMutate: (error, variables, context) => {
            // setAddUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted User')
            queryClient.invalidateQueries('users')
        },
    })

    if (errorAddingUser) {
        console.log(addUserError)
    }

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

            field: 'username',
            headerName: 'Username',
            width: 170,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['username']}</Typography>

                )
            }
        },

        {
            field: 'role',
            headerName: 'Role',
            width: 200,
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

        // {
        //     field: 'createdAt',
        //     headerName: 'Created At',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Typography sx={{ fontSize: 13 }}>{cellValue['row']['createdAt']}</Typography>

        //         )
        //     }

        // },
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
                            setSelectedUser(cellValue['row'])
                            disableUserMutation.mutate({ ...cellValue['row'], status: e.target.checked ? 'active' : 'inactive' })
                            // console.log(JSON.stringify({ ...cellValue['row'], status: e.target.checked ? 'active' : 'inactive' }))

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
                                    />

                                    <input
                                        placeholder='Last Name'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('last_name')}
                                    />

                                    {!loadingConfigsData && systemConfigData && <select {...register('gender')} style={{ ...textInputFieldStyle }} placeholder='Gender'>
                                        {
                                            systemConfigData['gender'].map(gender => {
                                                return <option key={gender.value} value={gender.value}>{gender.name}</option>
                                            })
                                        }
                                    </select>}

                                    <input
                                        placeholder='Date of Birth'
                                        type='date'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('birthdate')}
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

                                    {!loadingConfigsData && systemConfigData && <select {...register('bank')} style={{ ...textInputFieldStyle }} placeholder='Bank'>
                                        {
                                            systemConfigData['banks'].map(bank => {
                                                return <option key={bank.value} value={bank.value}>{bank.name}</option>
                                            })
                                        }
                                    </select>}

                                    <input
                                        placeholder='Account Number'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('account_number')}
                                    />

                                    <input
                                        placeholder='Email'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('email')}
                                    />

                                    <Box sx={{ mx: 3, my: 2, pb: 2 }}>
                                        <Autocomplete
                                            id="tags-standard"
                                            options={createRowsDataFromResponse(usersData)}
                                            onChange={(e, newValue) => {
                                                setRepresentativeID(newValue['id'])
                                            }}
                                            sx={{ border: '' }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Representatives"
                                                    placeholder="Representatives"
                                                />
                                            )}
                                        />
                                    </Box>


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
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit User</Button>
                                    </Box>

                                </form>
                            </Drawer>
                            <IconButton onClick={() => {
                                console.log(cellValue['row'])
                                setValue('username', cellValue['row']['username'])
                                setValue('first_name', cellValue['row']['first_name'])
                                setValue('last_name', cellValue['row']['last_name'])
                                setValue('middle_name', cellValue['row']['middle_name'])
                                setValue('email', cellValue['row']['email'])
                                setValue('phone', cellValue['row']['phone'])
                                setValue('password', cellValue['row']['password'])
                                setValue('confirm_password', cellValue['row']['confirm_password'])

                                setValue('birthdate', getDateFormated(cellValue['row']['birthdate']))
                                setValue('representative', cellValue['row']['representative'])
                                setRepresentativeID(cellValue['row']['representative'])
                                setValue('bank', cellValue['row']['bank'])
                                setValue('account_number', cellValue['row']['account_number'])
                                setValue('role', cellValue['row']['role '])



                                setSelectedUser(cellValue['row'])
                                setEditUserDrawerOpen(true)
                                console.log(cellValue['row'])
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => {
                                setSelectedUser(cellValue['row'])
                                setDeleteModalOpen(true)
                            }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
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
        console.log(JSON.stringify({ username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, bank: data.bank, account_number: data.account_number, representative: representativeID, gender: data.gender, birthdate: data.birthdate, }))
        mutate({ username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, bank: data.bank, account_number: data.account_number, representative: representativeID, gender: data.gender, birthdate: data.birthdate, })
    }

    const handleEditUser = (data) => {
        console.log(data)
        editUserMutation.mutate({ id: selectedUser['id'], username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, bank: data.bank, account_number: data.account_number, representative: representativeID, gender: data.gender, birthdate: data.birthdate, status: selectedUser['status'] })
        // editUserForm.reset()
    }


    const [editUserDrawerOpen, setEditUserDrawerOpen] = useState(false)
    const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false)




    const createRowsDataFromResponse = (data) => {
        return data.results.rows.map(user => {

            // console.log(getDateFormated(user['birthdate']))
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
                createdAt: '12-12-2022',
                account_number: user.account_number,
                bank: user.bank,
                representative: user.representative,
                birthdate: user.birthdate,
                gender: user.gender,
            }
        })
    }

    if (isLoading || loadingRoles || deleteUserMutation.isLoading || isAddingUser || editUserMutation.isLoading) {
        return <FullPageLoading />
    }

    else if (isError) {
        return 'Error Loading...'
    }
    else if (!isLoading && isSuccess && usersData) {
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
                            // reset()
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
                                    required={true}
                                    {...register('first_name')}
                                />

                                <input
                                    placeholder='Middle Name'
                                    style={{ ...textInputFieldStyle }}
                                    required={true}

                                    {...register('middle_name')}
                                />

                                <input
                                    placeholder='Last Name'
                                    style={{ ...textInputFieldStyle }}
                                    required={true}

                                    {...register('last_name')}
                                />

                                {!loadingConfigsData && systemConfigData && <select {...register('gender')} style={{ ...textInputFieldStyle }} placeholder='Gender'>
                                    {
                                        systemConfigData['gender'].map(gender => {
                                            return <option key={gender.value} value={gender.value}>{gender.name}</option>
                                        })
                                    }
                                </select>}

                                <input
                                    placeholder='Date of Birth'
                                    type='date'
                                    required={true}

                                    style={{ ...textInputFieldStyle }}
                                    {...register('birthdate')}
                                />

                                <input
                                    placeholder='Phone'
                                    required={true}

                                    style={{ ...textInputFieldStyle }}
                                    {...register('phone')}
                                />

                                <input
                                    placeholder='Username'
                                    required={true}

                                    style={{ ...textInputFieldStyle }}
                                    {...register('username')}
                                />

                                {!loadingConfigsData && systemConfigData && <select {...register('bank')} style={{ ...textInputFieldStyle }} placeholder='Bank'>
                                    {
                                        systemConfigData['banks'].map(bank => {
                                            return <option key={bank.value} value={bank.value}>{bank.name}</option>
                                        })
                                    }
                                </select>}

                                <input
                                    required={true}

                                    placeholder='Account Number'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('account_number')}
                                />

                                <input
                                    placeholder='Email'
                                    required={true}

                                    style={{ ...textInputFieldStyle }}
                                    {...register('email')}
                                />

                                <Box sx={{ mx: 3, my: 2, pb: 2 }}>
                                    <Autocomplete
                                        id="tags-standard"
                                        aria-required={true}
                                        options={createRowsDataFromResponse(usersData)}
                                        onChange={(e, newValue) => {
                                            setRepresentativeID(newValue['id'])
                                        }}
                                        // value={representativeID}
                                        sx={{ border: '' }}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Representatives"
                                                placeholder="Representatives"
                                            />
                                        )}
                                    />
                                </Box>


                                <input
                                    placeholder='Password'
                                    required={true}

                                    type='password'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('password')}
                                />
                                <input
                                    placeholder='Confirm Password'
                                    required={true}

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
                    rows={createRowsDataFromResponse(usersData)}
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