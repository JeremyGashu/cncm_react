import { Money, PersonSharp } from "@mui/icons-material"
import { Grid, Paper, Typography } from "@mui/material"
import DepartmentSectionCompnenet from "./DepartmentSectionCompnenet"
import photography_image from '../../assets/photography.svg'
import { kGreenColor } from "../../theme/colors"
import { useQuery } from "react-query"
import { fetchAggregate } from "../../controllers/aggregates"


const DepartmentCard = ({ department }) => {
    // const departmentid = department.id
    const { isLoading, data } = useQuery(['aggregates', department.id], () => fetchAggregate(department.id))

    return (
        <Paper elevation={3} sx={{ my: 3 }}>
            <Grid container justifyContent='space-between'>
                <Grid sm={12} lg={4} md={4} item justifyContent='space-between' alignItems='center'>
                    <Grid sx={{ backgroundColor: '#FAFFD7', height: 150 }} container direction='column' alignItems='center' justifyContent='center'>
                        <Grid item>
                            <img width={75} height={75} src={photography_image} alt='Department' />

                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontWeight: 'bold', fontSize: 15 }}>{department.name}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <DepartmentSectionCompnenet route_name={`souls/${department.id}`} title='Creative Souls' count={!isLoading && data && data.members.totalCount} icon={<PersonSharp sx={{ color: kGreenColor, fontSize: 30 }} />} />

                <DepartmentSectionCompnenet route_name={`assets/${department.id}`} title='Assets' count={!isLoading && data && data.assets.totalCount} icon={<Money sx={{ color: kGreenColor, fontSize: 30 }} />} />

                <DepartmentSectionCompnenet route_name={`associations/${department.id}`} title='Association' count={!isLoading && data && data.associations.totalCount} icon={<PersonSharp sx={{ color: kGreenColor, fontSize: 30 }} />} />


            </Grid>
        </Paper>
    )
}


export default DepartmentCard