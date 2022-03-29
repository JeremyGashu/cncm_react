import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, FilledInput, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { SearchOutlined, Visibility } from '@mui/icons-material';
import { kGreenColor, kGreenLight } from '../../theme/colors';
import { useQuery, } from 'react-query';

import { getAllAssets } from '../../controllers/assets';
import { getDateFormated } from '../system users/SystemUsers';
import FullPageLoading from '../LoadingPage';


const CompanyAssetsComponenet = () => {


    const { isLoading, isError, data, isSuccess } = useQuery(['assets'], () => getAllAssets())
    // const { isLoading: loadingUserData, data: usersData, isError: errorLoadingUsers } = useQuery('users', fetchUsers)
    // const { isLoading: loadingConfigsData, data: systemConfigData } = useQuery('configs', fetchConfigs)

    // const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    // const [selectedAsset, setSelectedAsset] = useState({})

    // const [editAssetDrawerOpen, setEditAssetDrawerOpen] = useState(false)
    // const [addAssetDrawerOpen, setAddAssetDrawerOpen] = useState(false)
    // const [collabsCount, setCollabsCount] = useState(1)
    // const [userId, setUserID] = useState()
    // const [collabs, setCollabs] = useState([{}])

    // const queryClient = useQueryClient()
    // const { mutate, isLoading: isAddingAsset } = useMutation(addAssetToDepartment, {
    //     onMutate: (error, variables, context) => {
    //         setAddAssetDrawerOpen(false)
    //     },
    //     onSuccess: (data, variables, context) => {
    //         console.log('Added Asset')
    //         queryClient.invalidateQueries('assets')
    //         reset()
    //     },
    // })

    // const editAssetMutation = useMutation(editAsset, {
    //     onMutate: (error, variables, context) => {
    //         setEditAssetDrawerOpen(false)
    //     },
    //     onSuccess: (data, variables, context) => {
    //         console.log('Edited Asset')
    //         queryClient.invalidateQueries('assets')
    //         reset()
    //     },
    // })

    // const deleteAssetMutation = useMutation(deleteAsset, {
    //     onMutate: (error, variables, context) => {
    //         setAddAssetDrawerOpen(false)
    //     },
    //     onSuccess: (data, variables, context) => {
    //         console.log('Deleted Asset')
    //         queryClient.invalidateQueries('assets')
    //     },
    // })


    // const { register, handleSubmit, reset, setValue } = useForm()

    // const createAllUserRows = (data) => {
    //     if (data && data.results && data.results.rows) {
    //         return data.results.rows.map(user => {
    //             return {
    //                 id: user.id,
    //                 email: user.email,
    //                 phone: user.phone,
    //                 first_name: user.first_name,
    //                 middle_name: user.middle_name,
    //                 last_name: user.last_name,
    //                 username: user.username,
    //                 role: user.role,
    //                 status: user.status,
    //                 createdAt: '12-12-2022'
    //             }
    //         })
    //     }
    //     return []

    // }

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
            field: 'owner',
            headerName: 'Owner',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['owner']}</Typography>

                )
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{getDateFormated(cellValue['row']['created_at'])}</Typography>

                )
            }
        },

        // {
        //     field: 'description',
        //     headerName: 'Desription',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Typography sx={{ fontSize: 13, }}>{cellValue['row']['phone']}</Typography>

        //         )
        //     }
        // },
        {
            field: 'statu',
            headerName: 'Status',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container justifyContent='space-evenly' alignItems='center' sx={{ backgroundColor: kGreenLight, py: 1, borderRadius: 1 }}>
                        <Typography sx={{ color: cellValue['row']['status'] === 'active' ? kGreenColor : 'yellowgreen', fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['status'] === 'active' ? 'Active' : 'Inactive'}</Typography>
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
                            <IconButton onClick={() => {

                            }}><Visibility sx={{ fontSize: 17 }} /></IconButton>
                            {/* <Drawer open={editAssetDrawerOpen} onClose={() => { setEditAssetDrawerOpen(false) }} anchor='right' >
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

                            </Drawer> */}
                            {/* <IconButton onClick={() => {
                                setValue('name', cellValue['row']['name'])
                                setValue('license_number', cellValue['row']['license_number'])
                                setValue('email', cellValue['row']['email'])
                                setValue('phone', cellValue['row']['phone'])
                                setValue('address', cellValue['row']['address'])
                                setSelectedAsset(cellValue['row'])
                                setEditAssetDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton> */}
                            {/* <IconButton onClick={() => setDeleteModalOpen(true)}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton> */}
                            {/* <Dialog
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
                            </Dialog> */}
                        </Grid>
                    </Grid>
                )
            }
        },

    ];

    // const handleAddAsset = (data) => {
    //     console.log(collabs)

    //     const { name, description } = data

    //     let metaData = {
    //         contributors: collabs
    //     }

    //     console.log(JSON.stringify({ userid: userId, name, type: departmentid, description, metaData, }))

    //     mutate({ userid: userId, name, type: departmentid, description, metaData, })
    // }

    // const handleEditAsset = (data) => {
    //     console.log(data)
    //     editAssetMutation.mutate({ departmentid, associationid: selectedAsset['id'], name: data.name, email: data.email, phone: data.phone, license_number: data.licence_number, address: data.address })
    // }




    const createRowsDataFromResponse = (data) => {
        return data.map(asset => {
            return {
                id: asset.id,
                name: asset.name,
                description: asset.descriptin,
                status: asset.status,
                owner: asset.owner_user && asset.owner_user.name,
                created_at: asset.createdAt
            }
        })
    }

    // const getCollabSelectors = () => {
    //     const collabsElement = []
    //     for (let i = 0; i < collabsCount; i++) {
    //         collabsElement.push(
    //             <Grid container alignItems='flex-end' justifyContent='space-evenly'>
    //                 <Grid item sx={{ mb: 1.5 }}>
    //                     <Autocomplete
    //                         id="tags-standard"
    //                         options={createAllUserRows(usersData)}
    //                         onChange={(e, newValue) => {
    //                             if (newValue !== null) {
    //                                 let newCollab = collabs
    //                                 newCollab[i]['userid'] = newValue['id']
    //                                 setCollabs(newCollab)
    //                             }
    //                         }}
    //                         sx={{ border: '', width: 200 }}
    //                         getOptionLabel={(option) => option.name}
    //                         renderInput={(params) => (
    //                             <TextField
    //                                 {...params}
    //                                 variant="standard"
    //                                 label="Collaborators"
    //                                 placeholder="Collaborators"
    //                             />
    //                         )}
    //                     />
    //                 </Grid>

    //                 <Grid item >
    //                     <input
    //                         placeholder='Percent Amount'
    //                         type='number'
    //                         min={0}
    //                         max={100}
    //                         style={{ ...textInputFieldStyle, width: 160 }}
    //                         onChange={(e) => {
    //                             let newCollab = collabs
    //                             newCollab[i]['percent'] = e.target.value
    //                             setCollabs(newCollab)
    //                         }}
    //                     />
    //                 </Grid>

    //                 {!loadingConfigsData && systemConfigData && <select onChange={(e) => {
    //                     let newCollab = collabs
    //                     newCollab[i]['role'] = e.target.value
    //                     setCollabs(newCollab)
    //                 }} style={{ ...textInputFieldStyle, width: 160 }} placeholder='Role'>
    //                     {
    //                         systemConfigData['contributor-roles'].map(role => {
    //                             return <option key={role.value} value={role.value}>{role.name}</option>
    //                         })
    //                     }
    //                 </select>}
    //             </Grid>


    //         )
    //     }
    //     return collabsElement
    // }

    if (isLoading) {
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
                    {/* <Grid item sx={{ mb: 1 }}>
                        <Button onClick={() => {
                            setAddAssetDrawerOpen(true)
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Asset
                        </Button>

                        <Drawer open={addAssetDrawerOpen} onClose={() => { setAddAssetDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Asset</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Asset</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddAssetDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddAsset)} style={{ width: 700 }}>



                                <Grid container alignItems='flex-end' justifyContent='space-around'>
                                    <Grid item>
                                        <input
                                            placeholder='name'
                                            style={{ ...textInputFieldStyle, width: 200 }}
                                            {...register('name')}
                                        />
                                    </Grid>

                                    <Grid item>
                                        <input
                                            placeholder='Description'
                                            style={{ ...textInputFieldStyle }}
                                            {...register('description')}
                                        />
                                    </Grid>
                                </Grid>

                                {
                                    !loadingUserData && usersData && <Box sx={{ mx: 3, my: 2, pb: 2, width: 200 }}>
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
                                } */}

                    {/* {
                                    !loadingUserData && usersData &&
                                    <Box sx={{ mx: 3, my: 2, pb: 2 }}>
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
                                } */}

                    {/* {
                                    getCollabSelectors()
                                }

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', m: 2 }}>
                                    <IconButton onClick={() => {

                                        console.log(collabsCount)
                                        setCollabsCount(prev => prev + 1)
                                        setCollabs([...collabs, {}])
                                    }} sx={{ width: 50, height: 50, backgroundColor: 'black', borderRadius: '50%', color: 'white', '&:hover': { backgroundColor: 'black', } }}><AddOutlined /></IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Asset</Button>
                                </Box>

                            </form>




                        </Drawer> */}

                    {/* <Button sx={{ mr: 1, fontWeight: '600', color: kGreenColor, fontSize: 10 }} startIcon={<Download />} >
                            Export
                        </Button>
                        <Button sx={{ fontWeight: '600', color: kGreenColor, fontSize: 10 }} startIcon={<Tune />} >
                            Add Filter
                        </Button> */}
                    {/* </Grid> */}
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

export default CompanyAssetsComponenet