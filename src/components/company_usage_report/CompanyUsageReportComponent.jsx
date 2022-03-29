import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Autocomplete, Box, Button, Drawer, FilledInput, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { kGreenColor } from '../../theme/colors';
import { getCompanyIdFromAuthData } from '../../config/check_user_type';
import { addUsageReportToCompany, fetchUsageReportByCompany } from '../../controllers/usage_report';
import { getAllAssets } from '../../controllers/assets';
import { textInputFieldStyle } from '../../theme/theme';
import { getDateFormated } from '../system users/SystemUsers';


const CompanyUsageReportComponent = () => {

    const { isLoading, isError, data, isSuccess } = useQuery('usage-reports', () => fetchUsageReportByCompany(getCompanyIdFromAuthData()))
    const { isLoading: loagingAssets, isError: errorLoadingAssets, data: assetsData, isSuccess: successLoadingAssets } = useQuery(['assets'], () => getAllAssets())

    const [addUsageReportDrawerOpen, setAddUsageReportDrawerOpen] = useState(false)
    const [assetId, setAssetId] = useState()


    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingUsageReport } = useMutation(addUsageReportToCompany, {
        onMutate: (error, variables, context) => {
            setAddUsageReportDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added')
            queryClient.invalidateQueries('usage-reports')
            reset()
        },
    })

    const createAssetsDataFromResponse = (data) => {
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

    const { register, handleSubmit, reset } = useForm()

    const columns = [
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

        // {
        //     field: 'source',
        //     headerName: 'Source',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Typography sx={{ fontSize: 13, }}>{cellValue['row']['source'][0].toUpperCase() + cellValue['row']['source'].substring(1)}</Typography>

        //         )
        //     }
        // },

        {
            field: 'frequency',
            headerName: 'Frequency',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['amount'][0].toUpperCase() + cellValue['row']['amount'].substring(1)}</Typography>

                )
            }
        },

        {
            field: 'usage_date',
            headerName: 'Usage Date',
            width: 200,
            renderCell: (cellValue) => {
                return (
                    <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
                        <Typography sx={{ fontSize: 13, }}>{getDateFormated(new Date(cellValue['row']['usage_date']))}</Typography>
                    </Box>


                )
            }
        },

        {
            field: 'reported_date',
            headerName: 'Reported Date',
            width: 200,
            renderCell: (cellValue) => {
                return (
                    <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
                        <Typography sx={{ fontSize: 13, }}>{getDateFormated(new Date(cellValue['row']['reported_date']))}</Typography>
                    </Box>


                )
            }
        },


    ];

    const handleAddUsageReport = (data) => {
        console.log({...data, assetId, companyid : getCompanyIdFromAuthData() })
        mutate({ ...data, assetId, companyid: getCompanyIdFromAuthData() })
    }

    const createRowsDataFromResponse = (data) => {
        console.log(data)

        return data.map(report => {
            return {
                id: report.id,
                company: report && report.company && report.company.name,
                asset: report && report.asset && report.asset.name,
                amount: report.amount,
                usage_date: report.usage_date,
                reported_date: report.reported_date,
                source: report.source,
            }
        })
    }

    if (isLoading || isAddingUsageReport || loagingAssets) {
        return <FullPageLoading />
    }

    else if (isError || errorLoadingAssets) {
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
                            setAddUsageReportDrawerOpen(true)

                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Usage Report
                        </Button>

                        <Drawer open={addUsageReportDrawerOpen} onClose={() => { setAddUsageReportDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Usage Report</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Usage Report</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddUsageReportDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddUsageReport)} style={{ width: 400 }}>

                                {
                                    !loagingAssets && successLoadingAssets && assetsData &&
                                    <Box sx={{ mx: 3, my: 2, pb: 2, width: 200 }}>
                                        <Autocomplete

                                            id="tags-standard"
                                            options={createAssetsDataFromResponse(assetsData)}
                                            onChange={(e, newValue) => {
                                                if (newValue !== null) {
                                                    setAssetId(newValue['id'])
                                                }
                                            }}
                                            sx={{ border: '', width: 340 }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Asset"
                                                    placeholder="Search Asset by Name"
                                                />
                                            )}
                                        />
                                    </Box>
                                }

                                <input
                                    placeholder='Frequency'
                                    type='number'
                                    minumum={1}
                                    style={{ ...textInputFieldStyle }}
                                    {...register('frequency')}
                                />

                                <input
                                    placeholder='Date of Asset Usage'
                                    type='date'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('date')}
                                />



                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Payment Usage Report</Button>
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

export default CompanyUsageReportComponent