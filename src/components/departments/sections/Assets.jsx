import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Autocomplete, TextField, Box, Button, Dialog, DialogActions, Switch, DialogContent, DialogContentText, DialogTitle, Drawer, FilledInput, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { AddOutlined, Check, CloseOutlined, Delete, EditOutlined, SearchOutlined } from '@mui/icons-material';
import { kGreenColor, kGreenLight } from '../../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../../theme/theme';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addAssetToDepartment, deleteAsset, editAsset, fetchAssetByDepartmentId } from '../../../controllers/assets';
import { fetchUsers } from '../../../controllers/users';


const AssetsComponenet = () => {

    const { departmentid } = useParams()

    const { isLoading, isError, data, isSuccess } = useQuery(['assets', departmentid], () => fetchAssetByDepartmentId(departmentid))
    const { isLoading: loadingUserData, data: usersData } = useQuery('users', fetchUsers)


    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState({})

    const [editAssetDrawerOpen, setEditAssetDrawerOpen] = useState(false)
    const [addAssetDrawerOpen, setAddAssetDrawerOpen] = useState(false)
    const [collaborators, setCollaborators] = useState([])
    const [userId, setUserID] = useState()


    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingAsset } = useMutation(addAssetToDepartment, {
        onMutate: (error, variables, context) => {
            setAddAssetDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added Asset')
            queryClient.invalidateQueries('assets')
            reset()
        },
    })

    const editAssetMutation = useMutation(editAsset, {
        onMutate: (error, variables, context) => {
            setEditAssetDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited Asset')
            queryClient.invalidateQueries('assets')
            reset()
        },
    })

    const deleteAssetMutation = useMutation(deleteAsset, {
        onMutate: (error, variables, context) => {
            setAddAssetDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted Asset')
            queryClient.invalidateQueries('assets')
        },
    })


    const { register, handleSubmit, reset, setValue } = useForm()

    const createAllUserRows = (data) => {
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
            field: 'description',
            headerName: 'Desription',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['phone']}</Typography>

                )
            }
        },
        {
            field: 'statuc',
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
                            <Drawer open={editAssetDrawerOpen} onClose={() => { setEditAssetDrawerOpen(false) }} anchor='right' >
                                <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item >
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Asset</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Asset</Typography>

                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={() => setEditAssetDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                    </Grid>


                                </Grid>

                                <form onSubmit={handleSubmit(handleEditAsset)} style={{ width: 400 }}>



                                    <input
                                        placeholder='Name'
                                        style={{ ...textInputFieldStyle }}

                                        {...register('name')}
                                    />

                                    <input
                                        placeholder='Address'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('address')}
                                    // defaultValue={selectedUser['middle_name']}

                                    />

                                    <input
                                        placeholder='Phone'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('[phone]')}
                                    // defaultValue={selectedUser['last_name']}

                                    />

                                    <input
                                        placeholder='Email'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('email')}
                                    // defaultValue={selectedUser['phone']}

                                    />

                                    <input
                                        placeholder='License Number'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('license_number')}
                                    />

                                    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Asset</Button>
                                    </Box>


                                </form>

                            </Drawer>
                            <IconButton onClick={() => {
                                setValue('name', cellValue['row']['name'])
                                setValue('license_number', cellValue['row']['license_number'])
                                setValue('email', cellValue['row']['email'])
                                setValue('phone', cellValue['row']['phone'])
                                setValue('address', cellValue['row']['address'])
                                setSelectedAsset(cellValue['row'])
                                setEditAssetDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => setDeleteModalOpen(true)}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => { setDeleteModalOpen(false) }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete Asset?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete Asset ${cellValue['row']['name']}?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {

                                        setDeleteModalOpen(false)
                                        deleteAssetMutation.mutate(cellValue['row']['id'])
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

    const handleAddAsset = (data) => {

        const { name, description } = data

        let metaData = {
            contributors: collaborators
        }

        mutate({ userid: userId, name, type: departmentid, description, metaData, })
    }

    const handleEditAsset = (data) => {
        console.log(data)
        editAssetMutation.mutate({ departmentid, associationid: selectedAsset['id'], name: data.name, email: data.email, phone: data.phone, license_number: data.licence_number, address: data.address })
    }




    const createRowsDataFromResponse = (data) => {
        return data.map(asset => {
            return {
                id: asset.id,
                name: asset.name,
                description: asset.descriptin,
                status: asset.status,
            }
        })
    }

    if (isLoading || deleteAssetMutation.isLoading || isAddingAsset || editAssetMutation.isLoading) {
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
                            setAddAssetDrawerOpen(true)
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Asset
                        </Button>

                        <Drawer open={addAssetDrawerOpen} onClose={() => { setAddAssetDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Asset</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Asset</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddAssetDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddAsset)} style={{ width: 400 }}>



                                <input
                                    placeholder='name'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('name')}
                                />

                                <input
                                    placeholder='Description'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('description')}
                                />

                                {
                                    !loadingUserData && usersData && <Box sx={{ mx: 3, my: 2, pb: 2 }}>
                                        <Autocomplete
                                            // multiple
                                            id="tags-standard"
                                            options={createAllUserRows(usersData)}
                                            onChange={(e, newValue) => {
                                                if (newValue !== null) {
                                                    setUserID(newValue['id'])
                                                }
                                            }}
                                            sx={{ border: '' }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Owner"
                                                    placeholder="Owner"
                                                />
                                            )}
                                        />
                                    </Box>
                                }

                                {
                                    !loadingUserData && usersData && <Box sx={{ mx: 3, my: 2, pb: 2 }}>
                                        <Autocomplete
                                            multiple
                                            id="tags-standard"
                                            options={createAllUserRows(usersData)}
                                            onChange={(e, newValue) => {
                                                if (newValue !== null) {
                                                    setCollaborators(newValue.map(c => c['id']))
                                                }
                                            }}
                                            sx={{ border: '' }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Collaborators"
                                                    placeholder="Collaborators"
                                                />
                                            )}
                                        />
                                    </Box>
                                }

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', m:2 }}>
                                    <IconButton sx={{ width: 50, height: 50, backgroundColor: 'black', borderRadius: '50%', color: 'white', '&:hover': { backgroundColor: 'black', } }}><AddOutlined /></IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Asset</Button>
                                </Box>

                            </form>




                        </Drawer>

                        {/* <Button sx={{ mr: 1, fontWeight: '600', color: kGreenColor, fontSize: 10 }} startIcon={<Download />} >
                            Export
                        </Button>
                        <Button sx={{ fontWeight: '600', color: kGreenColor, fontSize: 10 }} startIcon={<Tune />} >
                            Add Filter
                        </Button> */}
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

export default AssetsComponenet