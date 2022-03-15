import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullPageLoading from '../LoadingPage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDepartment, deleteDepartment, editDepartment, fetchDepartments } from '../../controllers/departments';
import { Box, Grid, IconButton, Button, Drawer, Typography } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { kGreenColor } from '../../theme/colors';
import { textInputFieldStyle } from '../../theme/theme';
import DepartmentCard from './DepartmentCard';
import { fetchConfigs } from '../../controllers/configs';

const DepartmentsComponent = () => {

    //load clients, associations, assets and creative souls in each department

    const { isLoading, data, isError, isSuccess } = useQuery('departments', fetchDepartments)
    const { isLoading: loadingConfigsData, data: systemConfigData } = useQuery('configs', fetchConfigs)

    const queryClient = useQueryClient()
    const { mutate, isLoading: isAddingDepartment } = useMutation(addDepartment, {
        onMutate: (error, variables, context) => {
            setAddDepartmentDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            // console.log('Added roles')
            queryClient.invalidateQueries('departments')
            reset()
        },
    })


    const editDepartmentMutation = useMutation(editDepartment, {
        onMutate: (error, variables, context) => {
        },
        onSuccess: (data, variables, context) => {
            // console.log('Edited roles')
            queryClient.invalidateQueries('departments')
            reset()
        },
    })

    const deleteDepartmentMutation = useMutation(deleteDepartment, {
        onMutate: (error, variables, context) => {
            setAddDepartmentDrawerOpen(false)
        },
        onSuccess: (data, variables, context) => {
            // console.log('Deleted roles')
            queryClient.invalidateQueries('departments')
        },
    })


    const { register, handleSubmit, reset } = useForm()


    const handleAddDepartment = (data) => {
        console.log(data)
        mutate({ name: data.name, description: data.description, type: data.type, defaultPrice: data.defaultPrice })
    }


    const [addDepartmentDrawerOpen, setAddDepartmentDrawerOpen] = useState(false)


    if (isLoading || deleteDepartmentMutation.isLoading || isAddingDepartment || editDepartmentMutation.isLoading) {
        return <FullPageLoading />
    }

    else if (isError) {
        return 'Error Loading...'
    }
    else if (!isLoading && isSuccess && data) {
        return (
            // <Paper elevation={2} sx={{ p: 2 }}>
            <Box>

                <Grid container sx={{ mb: 1 }} justifyContent='flex-end'>
                    <Button onClick={() => {
                        reset()
                        setAddDepartmentDrawerOpen(true)
                    }} sx={{ color: 'white', mr: 1, backgroundColor: kGreenColor, '&:hover': { backgroundColor: 'green', } }}  >
                        Add Department
                    </Button>

                    <Drawer open={addDepartmentDrawerOpen} onClose={() => { setAddDepartmentDrawerOpen(false) }} anchor='right' >
                        <Grid sx={{ width: '400px', p: 3 }} container direction='row' justifyContent='space-between' alignItems='center'>
                            <Grid item >
                                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Add New department</Typography>
                                <Typography sx={{ fontSize: 17, mb: 2 }}>Add New Department</Typography>


                            </Grid>

                            <Grid item>
                                <IconButton onClick={() => setAddDepartmentDrawerOpen(false)} ><CloseOutlined /></IconButton>
                            </Grid>


                        </Grid>

                        <form onSubmit={handleSubmit(handleAddDepartment)} style={{ width: 400 }}>

                            <input
                                placeholder='Name'
                                style={{ ...textInputFieldStyle }}
                                {...register('name')}
                            />

                            <input
                                placeholder='Description'
                                style={{ ...textInputFieldStyle }}
                                {...register('description')}
                            />

                            <input
                                placeholder='Default Price'
                                type='number'
                                min='0'
                                style={{ ...textInputFieldStyle }}
                                {...register('defaultPrice')}
                            />

                            {!loadingConfigsData && systemConfigData && <select {...register('type')} style={{ ...textInputFieldStyle }} placeholder='Type'>
                                {
                                    systemConfigData['department-types'].map(role => {
                                        return <option key={role.value} value={role.value}>{role.name}</option>
                                    })
                                }
                            </select>}


                            <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', justifyContent: 'flex-end', p: 3 }} >
                                <Button type='submit' sx={{ color: 'white', backgroundColor: kGreenColor, '&:hover': { backgroundColor: kGreenColor } }}>Add Department</Button>
                            </Box>

                        </form>
                    </Drawer>
                </Grid>


                {data &&
                    data.map(department => {
                        return <DepartmentCard key={department.id} department={department} />
                    })

                }
            </Box>
            // </Paper>

        );
    }
    else {
        return <FullPageLoading />
    }
}


export default DepartmentsComponent