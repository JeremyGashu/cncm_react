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
import { fetchAllAssociations } from '../../controllers/associations';
import { fetchNotificatins, sendNotifiationGroup } from '../../controllers/notifications';
import { fetchDepartments } from '../../controllers/departments';
import { fetchConfigs } from '../../controllers/configs';
import { toDateString } from '../../urls/date_converter';

const NotificationComponent = () => {

    const { isLoading, isError, data, isSuccess } = useQuery('notifications', fetchNotificatins)
    const { isLoading: loadingDepartments, data: departmentData, isError: loadingDepartmentError } = useQuery('departments', fetchDepartments)
    const { isLoading: loadingAssociations, data: associationsData, isError: loadingAssociationError } = useQuery('all_associations', fetchAllAssociations)
    const { isLoading: loadingConfigsData, data: systemConfigData } = useQuery('configs', fetchConfigs)


    const [addNotificationDrawerOpen, setAddNotificationDrawerOpen] = useState(false)

    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingNotification } = useMutation(sendNotifiationGroup, {
        onMutate: (error, variables, context) => {
            setAddNotificationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added')
            queryClient.invalidateQueries('notifications')
            reset()
        },
    })



    const { register, handleSubmit, reset } = useForm()

    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['title']}</Typography>

                )
            }
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container justifyContent='space-evenly' alignItems='center' sx={{ backgroundColor: kGreenLight, py: 1, borderRadius: 1 }}>
                        <Typography sx={{ color: cellValue['row']['priority'] === 'high' ? 'red' : kGreenColor, fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['priority'][0].toUpperCase() + cellValue['row']['priority'].substring(1)}</Typography>
                    </Grid>
                )
            }
        },

        {
            field: 'time',
            headerName: 'Time',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{toDateString(new Date(cellValue['row']['time']))}</Typography>
                )
            }
        },

        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container justifyContent='space-evenly' alignItems='center' sx={{ backgroundColor: kGreenLight, py: 1, borderRadius: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>{cellValue['row']['status'][0].toUpperCase() + cellValue['row']['status'].substring(1)}</Typography>
                    </Grid>
                )
            }
        },
    ];

    const handleAddNotification = (data) => {

        const { association_id, body, department_id, priority, type, title } = data
        mutate({ type, title, priority, body: { body }, association_id, department_id })
    }

    const createRowsDataFromResponse = (data) => {
        return data.map(notification => {
            return {
                id: notification.id,
                priority: notification.priority,
                title: notification.title,
                time: notification.time,
                body: notification.toString(),
                status: notification.status,
            }
        })
    }

    if (isLoading || isAddingNotification || loadingAssociations || loadingDepartmentError || loadingConfigsData) {
        return <FullPageLoading />
    }

    else if (isError || loadingDepartmentError || loadingAssociationError) {
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
                            setAddNotificationDrawerOpen(true)
                        }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                            Add Notification
                        </Button>

                        <Drawer open={addNotificationDrawerOpen} onClose={() => { setAddNotificationDrawerOpen(false) }} anchor='right' >
                            <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                <Grid item >
                                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New Notification</Typography>
                                    <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Notification</Typography>


                                </Grid>

                                <Grid item>
                                    <IconButton onClick={() => setAddNotificationDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                </Grid>


                            </Grid>

                            <form onSubmit={handleSubmit(handleAddNotification)} style={{ width: 400 }}>



                                {!loadingDepartments && departmentData && <select {...register('department_id')} style={{ ...textInputFieldStyle }} placeholder='Department'>
                                    {
                                        departmentData.map(department => {
                                            return <option key={department.id} value={department.id}>{department.name}</option>
                                        })
                                    }
                                </select>}

                                {!loadingAssociations && associationsData && <select {...register('association_id')} style={{ ...textInputFieldStyle }} placeholder='Association'>
                                    {
                                        associationsData.map(association => {
                                            return <option key={association.id} value={association.id}>{association.name}</option>
                                        })
                                    }
                                </select>}

                                {!loadingConfigsData && systemConfigData && <select {...register('priority')} style={{ ...textInputFieldStyle }} placeholder='Priority'>
                                    {
                                        systemConfigData['notification-priority-levels'].map(priority => {
                                            return <option key={priority.value} value={priority.value}>{priority.name}</option>
                                        })
                                    }
                                </select>}

                                {!loadingConfigsData && systemConfigData && <select {...register('type')} style={{ ...textInputFieldStyle }} placeholder='Type'>
                                    {
                                        systemConfigData['notification-types'].map(priority => {
                                            return <option key={priority.value} value={priority.value}>{priority.name}</option>
                                        })
                                    }
                                </select>}

                                <input
                                    placeholder='Title'
                                    style={{ ...textInputFieldStyle }}
                                    {...register('title')}
                                />

                                <textarea
                                    placeholder='Notificatin'
                                    style={{ ...textInputFieldStyle, height: 100 }}
                                    {...register('body')}
                                />

                                <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Notification</Button>
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

export default NotificationComponent