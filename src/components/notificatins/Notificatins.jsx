import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FilledInput, Grid, IconButton, InputAdornment, Typography } from '@mui/material';
import { CloseOutlined, Delete, EditOutlined, SearchOutlined } from '@mui/icons-material';
import { kGreenColor } from '../../theme/colors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { textInputFieldStyle } from '../../theme/theme';
import { useForm } from 'react-hook-form';
// import { useParams } from 'react-router-dom';
import { deleteAssociation, editAssociation as editNotification } from '../../controllers/associations';
import { fetchNotificatins, sendNotifiation } from '../../controllers/notifications';
import { useParams } from 'react-router-dom';


const NotificationComponent = () => {

    const { departmentid } = useParams()

    const { isLoading, isError, data, isSuccess } = useQuery('notifications', fetchNotificatins)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedNotificatipn, setSelectedNotification] = useState({})

    const [editNotificationDrawerOpen, setEditNotificationDrawerOpen] = useState(false)
    const [addNotificationDrawerOpen, setAddNotificationDrawerOpen] = useState(false)


    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingNotification } = useMutation(sendNotifiation, {
        onMutate: (error, variables, context) => {
            setAddNotificationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Added')
            queryClient.invalidateQueries('notifications')
            reset()
        },
    })

    const editNotificationMutation = useMutation(editNotification, {
        onMutate: (error, variables, context) => {
            setEditNotificationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Edited ')
            queryClient.invalidateQueries('notifications')
            reset()
        },
    })

    const deleteNotificationMutation = useMutation(deleteAssociation, {
        onMutate: (error, variables, context) => {
            setAddNotificationDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            console.log('Deleted Notification')
            queryClient.invalidateQueries('notifications')
        },
    })


    const { register, handleSubmit, reset, setValue } = useForm()

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


        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (cellValue) => {
                return (
                    <Grid container>
                        <Grid item>
                            <Drawer open={editNotificationDrawerOpen} onClose={() => { setEditNotificationDrawerOpen(false) }} anchor='right' >
                                <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                                    <Grid item >
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Edit Notification</Typography>
                                        <Typography sx={{ fontSize: 17, mb: 2 }}>Edit Notification</Typography>

                                    </Grid>

                                    <Grid item>
                                        <IconButton onClick={() => setEditNotificationDrawerOpen(false)} ><CloseOutlined /></IconButton>
                                    </Grid>


                                </Grid>

                                <form onSubmit={handleSubmit(handleEditNotification)} style={{ width: 400 }}>



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
                                        <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Edit Notification</Button>
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

                                setSelectedNotification(cellValue['row'])
                                setEditNotificationDrawerOpen(true)
                            }}><EditOutlined sx={{ fontSize: 17 }} /></IconButton>
                            <IconButton onClick={() => { setDeleteModalOpen(true) }}><Delete sx={{ color: 'red', fontSize: 17 }} /></IconButton>
                            <Dialog
                                open={deleteModalOpen}
                                onClose={() => { setDeleteModalOpen(false) }}

                            >
                                <DialogTitle id="alert-dialog-title">
                                    {'Delete Notification?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {`Are you sure you want to Delete Notifiation ${cellValue['row']['title']}?`}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }} onClick={() => { setDeleteModalOpen(false) }}>Cancel</Button>
                                    <Button sx={{ color: 'white', mr: 1, backgroundColor: 'red', '&:hover': { backgroundColor: 'red', } }} onClick={() => {

                                        setDeleteModalOpen(false)
                                        deleteNotificationMutation.mutate({ associationid: cellValue['row']['id'], departmentid })
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

    const handleAddNotification = (data) => {

        console.log(data)

        mutate({ id: departmentid, name: data.name, email: data.email, address: data.address, phone: data.phone, license_number: data.license_number, license_document: data.license[0] })
    }

    const handleEditNotification = (data) => {
        console.log(data)
        editNotificationMutation.mutate({ departmentid, associationid: selectedNotificatipn['id'], name: data.name, email: data.email, phone: data.phone, license_number: data.licence_number, address: data.address })
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

    if (isLoading || deleteNotificationMutation.isLoading || isAddingNotification || editNotificationMutation.isLoading) {
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
                                    <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Notification</Button>
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

export default NotificationComponent