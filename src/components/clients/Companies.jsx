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
import { addCompanies, deleteCompany, editCompany, fetchCompanies } from '../../controllers/client';
import { kYellowLight } from '../../config/colors';
import { Link } from 'react-router-dom';



const CompaniesComponent = () => {


    const { isLoading, isError, data, isSuccess } = useQuery('companies', () => fetchCompanies())
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState({})

    const [editCompanyDrawerOpen, setEditCompanyDrawerOpen] = useState(false)
    const [addCompanyDrawerOpen, setAddCompanyDrawerOpen] = useState(false)
    const [companyDetailDrawerOpen, setCompanyDetailDrawerOpen] = useState(false)




    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingCompany } = useMutation(addCompanies, {
        onMutate: (error, variables, context) => {
            setAddCompanyDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added company')
            queryClient.invalidateQueries('companies')
            reset()
        },
    })

    const editCompanyMutation = useMutation(editCompany, {
        onMutate: (error, variables, context) => {
            setEditCompanyDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited company')
            queryClient.invalidateQueries('companies')
            reset()
        },
    })

    const deleteCompanyMutation = useMutation(deleteCompany, {
        onMutate: (error, variables, context) => {
            setAddCompanyDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted Company')
            queryClient.invalidateQueries('companies')
            reset()
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
        // {
        //     field: 'address',
        //     headerName: 'Address',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Typography sx={{ fontSize: 13, }}>{cellValue['row']['address']}</Typography>

        //         )
        //     }
        // },
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
            width: 160,
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
                                setSelectedCompany(cellValue['row'])
                                setCompanyDetailDrawerOpen(true)
                            }} ><Visibility sx={{ fontSize: 17 }} /></IconButton>
                        </Grid>

                        <Drawer open={companyDetailDrawerOpen} onClose={() => { setCompanyDetailDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '450px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Association Detail</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Association Detail</Typography>

                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setCompanyDetailDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <Grid container direction='column' alignItems='center' justifyContent='space-between' sx={{ p: 3 }}>
                                <Grid container direction='row' alignItems='center' justifyContent='space-between'>
                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Name</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedCompany && selectedCompany.name}</Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Email</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedCompany && selectedCompany.email}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container direction='row' alignItems='center' justifyContent='space-between'>
                                    <Grid item>
                                        <Typography sx={{ color: '#444', fontSize: 12 }}>Phone</Typography>
                                        <Typography sx={{ ml: 0.5, my: 1, color: '#444', fontSize: 13, fontWeight: 'bold' }}>{selectedCompany && selectedCompany.phone}</Typography>
                                    </Grid>


                                </Grid>


                            </Grid>

                            <Paper sx={{ m: 3, p: 1, cursor: 'pointer', backgroundColor: kYellowLight }}>
                                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item>
                                        <PersonOutlined sx={{ color: kGreenColor }} />
                                        <Typography sx={{ fontSize: 14, color: '#444', fontWeight: 'bold' }}>Members</Typography>
                                    </Grid>
                                    <Link to={`/dashboard/company_members/${cellValue['row']['id']}`}>
                                        <Grid item>
                                            <IconButton><Visibility /></IconButton>
                                        </Grid></Link>
                                </Grid>
                            </Paper>
                        </Drawer>



                        <Grid item>
                            <Drawer open={editCompanyDrawerOpen} onClose={() => {
                                setEditCompanyDrawerOpen(false)
                                reset()
                            }} anchor='right' >
                                <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item >
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Company</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Company</Typography>

                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={() => setEditCompanyDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                    </Grid>


                                </Grid>

                                <form onSubmit={handleSubmit(handleEditCompany)} style={{ width: 400 }}>



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
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Company</Button>
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

                                setSelectedCompany(cellValue['row'])
                                setEditCompanyDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => { setDeleteModalOpen(true) }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => {
                                    setDeleteModalOpen(false)
                                    reset()
                                }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete Company?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete Company ${cellValue['row']['name']}?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {

                                        setDeleteModalOpen(false)
                                        deleteCompanyMutation.mutate({ companyid: cellValue['row']['id'] })
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

    const handleAddCompany = (data) => {

        console.log(data)

        mutate({ name: data.name, email: data.email, address: data.address, phone: data.phone, license_number: data.license_number, license_document: data.license[0] })
    }

    const handleEditCompany = (data) => {
        console.log(data)
        editCompanyMutation.mutate({ companyid: selectedCompany['id'], name: data.name, email: data.email, phone: data.phone, license_number: data.licence_number, address: data.address })
    }




    const createRowsDataFromResponse = (data) => {
        return data.map(company => {
            return {
                id: company.id,
                name: company.name,
                email: company.email,
                phone: company.phone,
                address: company.address,
                license_number: company.license_number
            }
        })
    }

    if (isLoading || deleteCompanyMutation.isLoading || isAddingCompany || editCompanyMutation.isLoading) {
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
                            setAddCompanyDrawerOpen(true)
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Company
                        </Button>

                        <Drawer open={addCompanyDrawerOpen} onClose={() => {
                            setAddCompanyDrawerOpen(false)
                            reset()
                        }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Company</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Company</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddCompanyDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddCompany)} style={{ width: 400 }}>



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
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Company</Button>
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

export default CompaniesComponent