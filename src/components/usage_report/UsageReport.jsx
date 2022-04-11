import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Drawer, FilledInput, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { CloseOutlined, SearchOutlined } from '@mui/icons-material';
import { kGreenColor } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { useForm } from 'react-hook-form';
import { fetchCompanies } from '../../controllers/client';
import { addBulkUsageReport, fetchAllUsageReports } from '../../controllers/usage_report';
import { toDateString } from '../../urls/date_converter';


const UsageReportComponent = () => {

    const { isLoading, isError, data, isSuccess } = useQuery('usage-reports', fetchAllUsageReports)
    const { isLoading: loadingCompanies, data: companies } = useQuery('companies', fetchCompanies)

    const [addUsageReportDrawerOpen, setAddUsageReportDrawerOpen] = useState(false)


    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingUsageReport } = useMutation(addBulkUsageReport, {
        onMutate: (error, variables, context) => {
            setAddUsageReportDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added')
            queryClient.invalidateQueries('usage-reports')
            reset()
        },
    })

    const { register, handleSubmit, reset } = useForm()

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
    ];

    const handleAddUsageReport = (data) => {

        console.log(data)

        mutate({ companyId: data.companyId, usage_report: data.usage_reports[0] })
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

    if (isLoading || isAddingUsageReport) {
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


                                {!loadingCompanies && companies && <select {...register('companyId')} style={{ ...textInputFieldStyle }} placeholder='Company'>
                                    {
                                        companies.map(role => {
                                            return <option key={role.id} value={role.id}>{role.name}</option>
                                        })
                                    }
                                </select>}

                                <input
                                    placeholder='Add Usga report in CSV format'
                                    type='file'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('usage_reports')}
                                />

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Usage Report</Button>
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

export default UsageReportComponent