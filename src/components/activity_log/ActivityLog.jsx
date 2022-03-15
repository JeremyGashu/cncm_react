import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, FilledInput, Grid, InputAdornment, Typography } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { useQuery } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { getActivityLog } from '../../controllers/activity_log';

const ActivityLogComponent = () => {

    const { isLoading, isError, data, isSuccess } = useQuery('activity_log', () => getActivityLog())
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
            field: 'role',
            headerName: 'Role',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['role']}</Typography>

                )
            }
        },
        {
            field: 'event',
            headerName: 'Event',
            width: 160,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['event']}</Typography>

                )
            }
        },
        {
            field: 'data',
            headerName: 'Data',
            width: 300,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, wordWrap : 'break-word' }}>{cellValue['row']['data']}</Typography>
                )
            }
        },

        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['status']}</Typography>

                )
            }
        },

        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13 }}>{cellValue['row']['date']}</Typography>

                )
            }
        },



    ];

    const createRowsDataFromResponse = (data) => {
        return data.map(log => {
            return {
                id: log.id,
                name: `${log.user.first_name} ${log.user.middle_name} ${log.user.last_name}`,
                date : log.createdAt,
                data : JSON.stringify(log.data)
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
                    rowHeight={100}
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

export default ActivityLogComponent