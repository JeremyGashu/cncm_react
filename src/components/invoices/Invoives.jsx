import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FilledInput, Grid, IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import { CloseOutlined, Delete, EditOutlined, PersonOutlined, SearchOutlined, Visibility } from '@mui/icons-material';
import { kGreenColor } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addAssociationToDepartment, deleteAssociation, editAssociation, fetchAssociationsByDepartmentId } from '../../controllers/associations';
import { kYellowLight } from '../../config/colors';


const InvoiceComponent = () => {

    const { departmentid } = useParams()

    const { isLoading, isError, data, isSuccess } = useQuery(['associations', departmentid], () => fetchAssociationsByDepartmentId(departmentid))
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedAssociation, setSelectedAssociation] = useState({})

    const [editAssociationsDrawerOpen, setEditAssociationDrawerOpen] = useState(false)
    const [addAssociationDrawerOpen, setAddAssociationDrawerOpen] = useState(false)

    const [associationDetailDrawerOpen, setAssociationDetailDrawerOpen] = useState(false)


    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingAssociation } = useMutation(addAssociationToDepartment, {
        onMutate: (error, variables, context) => {
            setAddAssociationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added Association')
            queryClient.invalidateQueries('associations')
            reset()
        },
    })

    const editAssociationMutation = useMutation(editAssociation, {
        onMutate: (error, variables, context) => {
            setEditAssociationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited Association')
            queryClient.invalidateQueries('associations')
            reset()
        },
    })

    const deleteAssociationMutation = useMutation(deleteAssociation, {
        onMutate: (error, variables, context) => {
            setAddAssociationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted Association')
            queryClient.invalidateQueries('associations')
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
            field: 'address',
            headerName: 'Address',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['address']}</Typography>

                )
            }
        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['phone']}</Typography>

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
            field: 'license_number',
            headerName: 'License Number',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['license_number']}</Typography>

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
                                setSelectedAssociation(cellValue['row'])
                                setAssociationDetailDrawerOpen(true)
                            }} ><Visibility sx={{ fontSize: 17 }} /></IconButton>
                        </Grid>

                        <Drawer open={associationDetailDrawerOpen} onClose={() => { setAssociationDetailDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '450px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Association Detail</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Association Detail</Typography>

                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAssociationDetailDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <Grid container direction='column' alignItems='center' justifyContent='space-between' sx={{ p: 3 }}>
                                <Grid container direction='row' alignItems='center' justifyContent='space-between'>
                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Name</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedAssociation && selectedAssociation.name}</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Email</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedAssociation && selectedAssociation.email}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container direction='row' alignItems='center' justifyContent='space-between'>
                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Phone</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedAssociation && selectedAssociation.phone}</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Address</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedAssociation && selectedAssociation.address}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container direction='row' alignItems='center' justifyContent='space-between'>
                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>License Number</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedAssociation && selectedAssociation.license_number}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Paper sx={{ m: 3, p: 1, cursor: 'pointer', backgroundColor: kYellowLight }}>
                                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item>
                                        <PersonOutlined sx={{ color: kGreenColor }} />
                                        <Typography sx={{ fontSize: 14, color: '#444', fontWeight: 'bold' }}>190000 Creative Souls</Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton><Visibility /></IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Drawer>


                        <Drawer open={editAssociationsDrawerOpen} onClose={() => { setEditAssociationDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Association</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Association</Typography>

                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setEditAssociationDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleEditAssociation)} style={{ width: 400 }}>



                                <input
                                    placeholder='Name'
                                    style={{ ...textInputFieldStyle }}

                                    {...register('name')}
                                />

                                <input
                                    placeholder='Address'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('address')}
                                />

                                <input
                                    placeholder='Phone'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('[phone]')}
                                />

                                <input
                                    placeholder='Email'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('email')}
                                />

                                <input
                                    placeholder='License Number'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('license_number')}
                                />

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Association</Button>
                                </Box>


                            </form>

                        </Drawer>


                        <Grid item>
                            <Drawer open={editAssociationsDrawerOpen} onClose={() => { setEditAssociationDrawerOpen(false) }} anchor='right' >
                                <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item >
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Association</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Association</Typography>

                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={() => setEditAssociationDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                    </Grid>


                                </Grid>

                                <form onSubmit={handleSubmit(handleEditAssociation)} style={{ width: 400 }}>



                                    <input
                                        placeholder='Name'
                                        style={{ ...textInputFieldStyle }}

                                        {...register('name')}
                                    />

                                    <input
                                        placeholder='Address'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('address')}
                                    />

                                    <input
                                        placeholder='Phone'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('[phone]')}
                                    />

                                    <input
                                        placeholder='Email'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('email')}
                                    />

                                    <input
                                        placeholder='License Number'
                                        style={{ ...textInputFieldStyle }}
                                        {...register('license_number')}
                                    />

                                    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Association</Button>
                                    </Box>


                                </form>

                            </Drawer>
                            <IconButton onClick={() => {
                                setValue('name', cellValue['row']['name'])
                                setValue('license_number', cellValue['row']['license_number'])
                                setValue('email', cellValue['row']['email'])
                                setValue('phone', cellValue['row']['phone'])
                                setValue('address', cellValue['row']['address'])
                                // setValue('phone', cellValue['row']['phone'])

                                setSelectedAssociation(cellValue['row'])
                                setEditAssociationDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => { setDeleteModalOpen(true) }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => { setDeleteModalOpen(false) }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete Association?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete Association ${cellValue['row']['name']}?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {

                                        setDeleteModalOpen(false)
                                        deleteAssociationMutation.mutate({ associationid: cellValue['row']['id'], departmentid })
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

    const handleAddAssociation = (data) => {

        console.log(data)

        mutate({ id: departmentid, name: data.name, email: data.email, address: data.address, phone: data.phone, license_number: data.license_number, license_document: data.license[0] })
    }

    const handleEditAssociation = (data) => {
        console.log(data)
        editAssociationMutation.mutate({ departmentid, associationid: selectedAssociation['id'], name: data.name, email: data.email, phone: data.phone, license_number: data.licence_number, address: data.address })
    }




    const createRowsDataFromResponse = (data) => {
        return data.map(association => {
            return {
                id: association.id,
                name: association.name,
                email: association.email,
                phone: association.phone,
                address: association.address,
                license_number: association.licenseNumber
            }
        })
    }

    if (isLoading || deleteAssociationMutation.isLoading || isAddingAssociation || editAssociationMutation.isLoading) {
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
                            setAddAssociationDrawerOpen(true)
                            // setSelectedAssociation()
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Association
                        </Button>

                        <Drawer open={addAssociationDrawerOpen} onClose={() => { setAddAssociationDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Association</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Association</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddAssociationDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddAssociation)} style={{ width: 400 }}>



                                <input
                                    placeholder='name'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('name')}
                                />

                                <input
                                    placeholder='address'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('address')}
                                />

                                <input
                                    placeholder='Phone Number'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('phone')}
                                />

                                <input
                                    placeholder='Email'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('email')}
                                />

                                <input
                                    placeholder='License Number'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('license_number')}
                                />

                                <input
                                    placeholder='License Doument'
                                    type='file'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('license')}
                                />

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Association</Button>
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

export default InvoiceComponent