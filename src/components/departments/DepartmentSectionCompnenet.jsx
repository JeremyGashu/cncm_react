import { Box, Grid, Typography } from "@mui/material"
import { Link } from "react-router-dom"

const DepartmentSectionCompnenet = ({ title, icon, count, route_name }) => {

    return (
        <Grid sm={12} lg={2} md={4} item justifyContent='center' alignItems='center'>
            <Link style={{ textDecoration: 'none', color: '#444' }} to={route_name} >
                <Box sx={{
                    transition: '0.3s all ease', p: 2, backgroundColor: 'white', height: 150, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': {
                        backgroundColor: '#FAFFD7',
                    }
                }}>
                    <Grid sx={{ backgroundColor: '#fafafa', p: 1, borderRadius: 1 }} container direction='column' alignItems='center' justifyContent='center'>
                        <Grid item>
                            {icon}
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>{count}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>{title}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Link>
        </Grid>
    )
}

export default DepartmentSectionCompnenet