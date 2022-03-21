import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FilledInput, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { CloseOutlined, Delete, Download, EditOutlined, SearchOutlined, Tune } from '@mui/icons-material';
import { kGreenColor } from '../../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../../theme/theme';
import { fetchRoles } from '../../../controllers/roles';
import { useForm } from 'react-hook-form';
import { editDepartmentMembers } from '../../../controllers/souls';
import { useParams } from 'react-router-dom';
import { fetchConfigs } from '../../../controllers/configs';
import { fetchUsers } from '../../../controllers/users';
import { addMemberToAssociation, deleteMemberFromAssociation, fetchMembersOfAssociatin } from '../../../controllers/associations';


const AssociationMembersComponent = () => {

    const { associationid } = useParams()
    console.log(associationid)

    const { isLoading, isError, data: associationMembersData, isSuccess } = useQuery(['association_members', associationid], () => fetchMembersOfAssociatin(associationid))
    const { isLoading: loadingAllUsers, data: usersData, } = useQuery('users', fetchUsers)

    const { isLoading: loadingConfigsData, data: systemConfigData } = useQuery('configs', fetchConfigs)


    const { isLoading: loadingRoles, data: rolesData } = useQuery('roles', fetchRoles)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [representativeID, setRepresentativeID] = useState()



    const [selectedUser, setSelectedUser] = useState({})
    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingUser } = useMutation(addMemberToAssociation, {
        onMutate: (error, variables, context) => {
            setAddUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added Creative Soul')
            queryClient.invalidateQueries('association_members')
            reset()
        },
    })

    const editUserMutation = useMutation(editDepartmentMembers, {
        onMutate: (error, variables, context) => {
            setEditUserDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited Creative Soul')
            queryClient.invalidateQueries('association_members')
            reset()
        },
    })

    const deleteUserMutation = useMutation(deleteMemberFromAssociation, {
        onMutate: (error, variables, context) => {
            setAddUserDrawerOpen(false)
        },
        //
        onSuccess: (data, variables, context) => {
            console.log('Deleted Creative Soul')
            queryClient.invalidateQueries('association_members')
        },
    })


    const { register, handleSubmit, reset, setValue } = useForm()

    const columns = [

        {
            field: 'name',
            headerName: 'Name',
            width: 170,
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
            field: 'phone',
            headerName: 'Phone Number',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['phone']}</Typography>

                )
            }
        },

        // {
        //     field: 'role',
        //     headerName: 'Role',
        //     width: 190,
        //     renderCell: (cellValue) => {
        //         return (

        //             rolesData ? <Grid container sx={{ backgroundColor: '#f0f0f0', borderRadius: 3, p: 1 }} direction='row' alignItems='center'>
        //                 <Grid item>
        //                     <Check sx={{ fontSize: 13, color: '#444', mr: 1 }} />
        //                 </Grid>
        //                 <Grid item>
        //                     <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>{getRoleNameFromId(cellValue['row']['role'], rolesData) && getRoleNameFromId(cellValue['row']['role'], rolesData).name}</Typography>
        //                 </Grid>
        //             </Grid> : <Typography></Typography>

        //         )
        //     }
        // },

        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['createdAt']}</Typography>

                )
            }

        },
        // {
        //     field: 'status',
        //     headerName: 'Status',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Grid container justifyContent='space-evenly' alignItems='center' sx={{ backgroundColor: kGreenLight, py: 1, borderRadius: 1 }}>
        //                 <Check sx={{ fontSize: 13, color: kGreenColor }} />
        //                 <Typography sx={{ color: kGreenColor, fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['status'] === 'active' ? 'Active' : 'Inactive'}</Typography>
        //                 <Switch color={cellValue['row']['status'] === 'active' ? 'success' : 'error'} checked={cellValue['row']['status'] === 'active'} onChange={(e) => { console.log(e.target.checked) }} size='small' sx={{ size: 15 }} />

        //             </Grid>
        //         )
        //     }
        // },
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
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Creative Soulr</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Creative Soul</Typography>

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
                            <IconButton onClick={() => {
                                setDeleteModalOpen(true)
                                console.log(cellValue['row'])
                            }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => { setDeleteModalOpen(false) }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete Creative Soul?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete Creative Soul?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {
                                        // console.log(cellValue['row']['id'])
                                        setDeleteModalOpen(false)

                                        deleteUserMutation.mutate({ userid: cellValue['row']['id'], associationid })
                                        // console.log(`User id id ${cellValue['row']['id']}`)
                                        // console.log(`Association id ${associationid}`)
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
        console.log(JSON.stringify({ associationid, username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, bank: data.bank, account_number: data.account_number, representative: representativeID, gender: data.gender, birthdate: data.birthdate, }))

        mutate({ associationid, username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, bank: data.bank, account_number: data.account_number, representative: representativeID, gender: data.gender, birthdate: data.birthdate, })
    }

    const handleEditUser = (data) => {
        console.log(data)
        editUserMutation.mutate({ memberid: selectedUser['id'], username: data.username, email: data.email, phone: data.phone, password: data.password, confirm_password: data.confirm_password, role: data.role, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name })
        // editUserForm.reset()
    }

    const [editUserDrawerOpen, setEditUserDrawerOpen] = useState(false)
    const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false)


    const createRowsDataFromResponse = (data) => {
        return data.map(user => {
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

    const allUsersRow = (data) => {
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

    if (isLoading || loadingRoles || deleteUserMutation.isLoading || isAddingUser || editUserMutation.isLoading || loadingAllUsers) {
        return <FullPageLoading />
    }

    else if (isError) {
        return 'Error Loading...'
    }
    else if (!isLoading && isSuccess && associationMembersData) {
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
                            Add Creative Soul
                        </Button>

                        <Drawer open={addUserDrawerOpen} onClose={() => { setAddUserDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Creative Soul</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Creative Soul by giving a Role</Typography>


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
                                        options={allUsersRow(usersData)}
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
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Creative Soul</Button>
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
                    rows={createRowsDataFromResponse(associationMembersData)}
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

export default AssociationMembersComponent