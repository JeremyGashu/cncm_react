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
import { fetchAllAssociations } from '../../controllers/associations';
import { fetchNotificatins, sendNotifiationGroup } from '../../controllers/notifications';
import { fetchDepartments } from '../../controllers/departments';
import { fetchConfigs } from '../../controllers/configs';


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

        // {
        //     field: 'type',
        //     headerName: 'Type',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Typography sx={{ fontSize: 13, }}>{cellValue['row']['type']}</Typography>

        //         )
        //     }
        // },
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
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['priority']}</Typography>

                )
            }
        },

        {
            field: 'time',
            headerName: 'Time',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['time']}</Typography>
                )
            }
        },

        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Typography sx={{ fontSize: 13, }}>{cellValue['row']['status']}</Typography>
                )
            }
        },


        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     width: 150,
        //     renderCell: (cellValue) => {
        //         return (
        //             <Grid container>
        //                 <Grid item>
        //                     <Drawer open={editNotificationDrawerOpen} onClose={() => { setEditNotificationDrawerOpen(false) }} anchor='right' >
        //                         <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
        //                             <Grid item >
        //                                 <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Notification</Typography>
        //                                 <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Notification</Typography>

        //                             </Grid>

        //                             <Grid item>
        //                                 <IconButton onClick={() => setEditNotificationDrawerOpen(false)} ><CloseOutlined /></IconButton>
        //                             </Grid>
        //                         </Grid>

        //                         <form onSubmit={handleSubmit(handleEditNotification)} style={{ width: 400 }}>



        //                             <input
        //                                 placeholder='Name'
        //                                 style={{ ...textInputFieldStyle }}

        //                                 {...register('name')}
        //                             />

        //                             <input
        //                                 placeholder='Address'
        //                                 style={{ ...textInputFieldStyle }}
        //                                 {...register('address')}
        //                             // defaultValue={selectedUser['middle_name']}

        //                             />

        //                             <input
        //                                 placeholder='Phone'
        //                                 style={{ ...textInputFieldStyle }}
        //                                 {...register('[phone]')}
        //                             // defaultValue={selectedUser['last_name']}

        //                             />

        //                             <input
        //                                 placeholder='Email'
        //                                 style={{ ...textInputFieldStyle }}
        //                                 {...register('email')}
        //                             // defaultValue={selectedUser['phone']}

        //                             />

        //                             <input
        //                                 placeholder='License Number'
        //                                 style={{ ...textInputFieldStyle }}
        //                                 {...register('license_number')}
        //                             />

        //                             <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
        //                                 <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Notification</Button>
        //                             </Box>


        //                         </form>

        //                     </Drawer>
        //                     <IconButton onClick={() => {
        //                         setValue('name', cellValue['row']['name'])
        //                         setValue('license_number', cellValue['row']['license_number'])
        //                         setValue('email', cellValue['row']['email'])
        //                         setValue('phone', cellValue['row']['phone'])
        //                         setValue('address', cellValue['row']['address'])
        //                         // setValue('phone', cellValue['row']['phone'])

        //                         setSelectedNotification(cellValue['row'])
        //                         setEditNotificationDrawerOpen(true)
        //                     }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
        //                     <IconButton onClick={() => { setDeleteModalOpen(true) }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
        //                     <Dialog
        //                         open={deleteModalOpen}
        //                         onClose={() => { setDeleteModalOpen(false) }}

        //                     >
        //                         <DialogTitle id="alert-dialog-title">
        //                             {'Delete Notification?'}
        //                         </DialogTitle>
        //                         <DialogContent>
        //                             <DialogContentText id="alert-dialog-description">
        //                                 {`Are you sure you want to Delete Notifiation ${cellValue['row']['title']}?`}
        //                             </DialogContentText>
        //                         </DialogContent>
        //                         <DialogActions>
        //                             <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
        //                             <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {

        //                                 setDeleteModalOpen(false)
        //                                 deleteNotificationMutation.mutate({ associationid: cellValue['row']['id'], departmentid })
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

    const handleAddNotification = (data) => {

        const { association_id, body, department_id, priority, type, title} = data

        // console.log(JSON.stringify({ id: departmentid, name: data.name, email: data.email, address: data.address, phone: data.phone, license_number: data.license_number, license_document: data.license[0] }))

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
                // address: notification.address,
                // license_number: notification.licenseNumber
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