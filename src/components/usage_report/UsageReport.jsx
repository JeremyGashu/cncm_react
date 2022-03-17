import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Drawer, FilledInput, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import { kGreenColor, kGreenLight } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { useForm } from 'react-hook-form';
import { addPaymentConfig, deletePaymentConfig, editPaymentConfig } from '../../controllers/payment_config';
import { fetchConfigs } from '../../controllers/configs';
import { fetchCompanies } from '../../controllers/client';
import { fetchAllUsageReports } from '../../controllers/usage_report';
import { toDateString } from '../../urls/date_converter';


const UsageReportComponent = () => {


    const { isLoading, isError, data, isSuccess } = useQuery('usage-reports', fetchAllUsageReports)
    const { isLoading: loadingConfigsData, data: systemConfigData } = useQuery('configs', fetchConfigs)
    const { isLoading: loadingCompanies, data: companies } = useQuery('companies', fetchCompanies)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedConfig, setSelectedConfig] = useState({})

    const [editConfigDrawerOpen, setEditConfigDrawerOpen] = useState(false)
    const [addConfigDrawerOpen, setAddConfigDrawerOpen] = useState(false)


    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingUsageReport } = useMutation(addPaymentConfig, {
        onMutate: (error, variables, context) => {
            setAddConfigDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added')
            queryClient.invalidateQueries('usage-reports')
            reset()
        },
    })

    const editPaymentConfigMutation = useMutation(editPaymentConfig, {
        onMutate: (error, variables, context) => {
            setEditConfigDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited ')
            queryClient.invalidateQueries('usage-reports')
            reset()
        },
    })

    const deletePaymentConfigMutation = useMutation(deletePaymentConfig, {
        onMutate: (error, variables, context) => {
            setAddConfigDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted config')
            queryClient.invalidateQueries('usage-reports')
        },
    })


    const { register, handleSubmit, reset, setValue } = useForm()

    const columns = [
        {
            field: 'client',
            headerName: 'Client',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['company']}</Typography>

                )
            }
        },

        {
            field: 'asset',
            headerName: 'Asset',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['asset']}</Typography>

                )
            }
        },

        {
            field: 'source',
            headerName: 'Source',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['source'][0].toUpperCase() + cellValue['row']['source'].substring(1)}</Typography>

                )
            }
        },

        {
            field: 'amount',
            headerName: 'Amount',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['amount'][0].toUpperCase() + cellValue['row']['amount'].substring(1)}</Typography>

                )
            }
        },
        // {
        //     field: 'email',
        //     headerName: 'Email',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Typography sx={{ fontSize: 13, }}>{cellValue['row']['price']}</Typography>

        //         )
        //     }
        // },

        // {
        //     field: 'assetUsed',
        //     headerName: 'Asset Used',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
        //                 <Typography sx={{ fontSize: 13, }}>{cellValue['row']['type'][0].toUpperCase() + cellValue['row']['type'].substring(1)}</Typography>
        //             </Box>

        //         )
        //     }
        // // },
        // {
        //     field: 'total',
        //     headerName: 'Total',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
        //                 <Typography sx={{ fontSize: 13, }}>{cellValue['row']['type'][0].toUpperCase() + cellValue['row']['type'].substring(1)}</Typography>
        //             </Box>

        //         )
        //     }
        // },

        {
            field: 'date',
            headerName: 'Date',
            width: 200,
            renderCell: (cellValue) => {
                return (
                    <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
                        <Typography sx={{ fontSize: 13, }}>{toDateString(new Date(cellValue['row']['date']))}</Typography>
                    </Box>

                )
            }
        },

        // {
        //     field: 'frequency',
        //     headerName: 'Frequency',
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
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Grid container>
        //                 <Grid item>
        //                     <Drawer open={editConfigDrawerOpen} onClose={() => { setEditConfigDrawerOpen(false) }} anchor='right' >
        //                         <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
        //                             <Grid item >
        //                                 <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Usgae Report</Typography>
        //                                 <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Usage Report</Typography>

        //                             </Grid>

        //                             <Grid item>
        //                                 <IconButton onClick={() => setEditConfigDrawerOpen(false)} ><CloseOutlined /></IconButton>
        //                             </Grid>


        //                         </Grid>

        //                         <form onSubmit={handleSubmit(handleEditConfig)} style={{ width: 400 }}>

        //                             {!loadingConfigsData && systemConfigData && <select {...register('type')} style={{ ...textInputFieldStyle }} placeholder='Type'>
        //                                 {
        //                                     systemConfigData['payment-config-types'].map(role => {
        //                                         return <option key={role.value} value={role.value}>{role.name}</option>
        //                                     })
        //                                 }
        //                             </select>}

        //                             <input
        //                                 placeholder='Price'
        //                                 style={{ ...textInputFieldStyle }}
        //                                 {...register('price')}
        //                             />

        //                             <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
        //                                 <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Payment Configuration</Button>
        //                             </Box>


        //                         </form>

        //                     </Drawer>
        //                     <IconButton onClick={() => {
        //                         setValue('type', cellValue['row']['type'])
        //                         setValue('companyId', cellValue['row']['companyId'])
        //                         setValue('price', cellValue['row']['price'])
        //                         setSelectedConfig(cellValue['row'])
        //                         setEditConfigDrawerOpen(true)
        //                     }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
        //                     <IconButton onClick={() => { setDeleteModalOpen(true) }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
        //                     <Dialog
        //                         open={deleteModalOpen}
        //                         onClose={() => { setDeleteModalOpen(false) }}

        //                     >
        //                         <DialogTitle id="alert-dialog-title">
        //                             {'Delete Configuration?'}
        //                         </DialogTitle>
        //                         <DialogContent>
        //                             <DialogContentText id="alert-dialog-description">
        //                                 {`Are you sure you want to Delete this Usage Report?`}
        //                             </DialogContentText>
        //                         </DialogContent>
        //                         <DialogActions>
        //                             <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
        //                             <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {

        //                                 setDeleteModalOpen(false)
        //                                 deletePaymentConfigMutation.mutate(cellValue['row']['id'])
        //                             }} autoFocus>
        //                                 Delete
        //                             </Button>
        //                         </DialogActions>
        //                     </Dialog>
        //                 </Grid>
        //             </Grid>
        //         )
        //     }
        // },

    ];

    const handleAddConfig = (data) => {

        console.log(data)

        mutate({ type: data.type, companyId: data.companyId, price: data.price })
    }

    const handleEditConfig = (data) => {
        // console.log(selectedConfig)
        editPaymentConfigMutation.mutate({ id: selectedConfig['id'], type: data.type, companyId: selectedConfig['companyId'], price: data.price })
    }




    const createRowsDataFromResponse = (data) => {

        return data.map(report => {
            return {
                id: report.id,
                company: report && report.company && report.company.name,
                asset: report && report.asset && report.asset.name,
                amount: report.amount,
                date: report.reported_date,
                source: report.source,
            }
        })
    }

    if (isLoading || deletePaymentConfigMutation.isLoading || isAddingUsageReport || editPaymentConfigMutation.isLoading || loadingConfigsData) {
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
                            setAddConfigDrawerOpen(true)

                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Usage Report
                        </Button>

                        <Drawer open={addConfigDrawerOpen} onClose={() => { setAddConfigDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Configuration</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Configuration</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddConfigDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddConfig)} style={{ width: 400 }}>


                                {!loadingCompanies && companies && <select {...register('companyId')} style={{ ...textInputFieldStyle }} placeholder='Company'>
                                    {
                                        companies.map(role => {
                                            return <option key={role.id} value={role.id}>{role.name}</option>
                                        })
                                    }
                                </select>}



                                {!loadingConfigsData && systemConfigData && <select {...register('type')} style={{ ...textInputFieldStyle }} placeholder='Type'>
                                    {
                                        systemConfigData['payment-config-types'].map(role => {
                                            return <option key={role.value} value={role.value}>{role.name}</option>
                                        })
                                    }
                                </select>}

                                <input
                                    placeholder='Price'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('price')}
                                />

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Payment Configuration</Button>
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

export default UsageReportComponent