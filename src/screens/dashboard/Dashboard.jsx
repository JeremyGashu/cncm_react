import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react'
import { Avatar, Badge, Divider, Grid, Paper } from '@mui/material';
import { Dashboard, Edit, GroupOutlined, Logout, Notifications, Payment, PersonOutline, ReportOutlined, Settings } from '@mui/icons-material';
import cncm_logo from '../../assets/cncm_logo.svg'
import { kGreenColor } from '../../theme/colors';
import { textThemes } from '../../theme/theme';
import { kDashboardBlack } from '../../config/colors';
import SystemUsers from '../../components/system users/SystemUsers';
import { useAuth } from '../../contexts/auth';
import FullPageLoading from '../../components/LoadingPage';
import { Navigate, useNavigate } from 'react-router-dom';
import RolesComponent from '../../components/roles/Roles';




const drawerWidth = 240;

const DashboardPage = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { loadingAuthState, authData, logOut } = useAuth()
  const navigate = useNavigate()


  if (!loadingAuthState && !authData) {
    return <Navigate to='/' />
  }

  const dashboardElement = [
    {
      name: 'Dashboard',
      component: <Typography>DashBoard</Typography>,
      icon: <Dashboard />

    },
    {
      name: 'Systsem Users',
      component: <SystemUsers />,
      icon: <PersonOutline />
    },

    {
      name: 'Role',
      component: <RolesComponent />,
      icon: <PersonOutline />
    },
    {
      name: 'Department',
      component: <Typography>Drafts</Typography>,
      icon: <GroupOutlined />
    },
    {
      name: 'Configuration',
      component: <Typography>Starred</Typography>,
      icon: <Settings />
    },

    {
      name: 'Invoices',
      component: <Typography>Drafts</Typography>,
      icon: <Payment />
    },
    {
      name: 'Usage Report',
      component: <Typography>Drafts</Typography>,
      icon: <ReportOutlined />
    },
    {
      name: 'Activity Log',
      component: <Typography>Drafts</Typography>,
      icon: <Edit />
    },
    {
      name: 'Notification',
      component: <Typography>Drafts</Typography>,
      icon: <Notifications />
    },
  ]


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  };

  const drawer = (
    <Box>
      <img height={50} style={{ padding: 5, margin: 3, textAlign: 'center', cursor: 'pointer' }} src={cncm_logo} alt='CNCM Logo' />
      <Divider />
      <List>
        {dashboardElement.map((menu, index) => (
          <ListItem onClick={() => {
            setSelectedIndex(index)
          }} button key={menu.name} sx={{ backgroundColor: selectedIndex === index ? kGreenColor : 'white', my: 0, py: 1, '&:hover': { backgroundColor: selectedIndex === index ? kGreenColor : 'white', } }}>
            <ListItemIcon>
              {
                menu.icon
              }
            </ListItemIcon>
            <ListItemText disableTypography primary={<Typography sx={{ ...textThemes.dashboardTexts, color: selectedIndex === index ? 'white' : 'black', fontSize: 12, fontWeight: 'bold' }}>{menu.name}</Typography>} />
          </ListItem>
        ))}

        <ListItem onClick={() => {
        }} button key='logout' sx={{ backgroundColor: 'white', my: 1, py: 1 }}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText onClick={async () => {
            logOut()
            navigate('/')

          }} disableTypography primary={<Typography sx={{ ...textThemes.dashboardTexts, color: 'black', fontSize: 12, fontWeight: 'bold' }}>Log Out</Typography>} />
        </ListItem>

      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  if (loadingAuthState) {
    return <FullPageLoading />
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: kDashboardBlack,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Grid container justifyContent='space-between' alignItems='center'>
              <Grid item>
                <Typography sx={{ ...textThemes.normalText }} >
                  {dashboardElement[selectedIndex]['name']}
                </Typography>
              </Grid>
              <Grid item>

                <Grid container>
                  <Grid item>
                    <IconButton sx={{ mr: 1 }}>
                      <Badge badgeContent={<Typography sx={{ ...textThemes.smallText, color: 'white' }}>{4}</Typography>}>
                        <Notifications sx={{ color: 'white', fontSize: 25 }} />
                      </Badge>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Avatar />

                  </Grid>
                </Grid>

              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />

          <Paper elevation={3} sx={{ p: 2, pb: 10 }}>
            {
              dashboardElement[selectedIndex]['component']
            }
          </Paper>
        </Box>
      </Box>

    </>
  )
}


export default DashboardPage