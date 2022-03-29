import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, FilledInput, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { SearchOutlined, Visibility } from '@mui/icons-material';
import { useQuery } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { getCompanyIdFromAuthData } from '../../config/check_user_type';
import { getDateFormated } from '../system users/SystemUsers';
import { fetchInvoicesByCompany } from '../../controllers/invoices';

const CompanyInvoicesComponent = () => {

    const { isLoading, isError, data, isSuccess } = useQuery('invoices', () => fetchInvoicesByCompany(getCompanyIdFromAuthData()))
    const columns = [
        {
            field: 'invoice_no',
            headerName: 'Invoice Number',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['invoice_number']}</Typography>

                )
            }
        },

        {
            field: 'bill',
            headerName: 'Bill',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['bill']}</Typography>

                )
            }
        },

        {
            field: 'created_at',
            headerName: 'Created At',
            width: 200,
            renderCell: (cellValue) => {
                return (
                    <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
                        <Typography sx={{ fontSize: 13, }}>{getDateFormated(new Date(cellValue['row']['created_at']))}</Typography>
                    </Box>


                )
            }
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (cellValue) => {
                return (
                    <IconButton>
                        <Visibility />
                    </IconButton>


                )
            }
        },
    ];

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

export default CompanyInvoicesComponent