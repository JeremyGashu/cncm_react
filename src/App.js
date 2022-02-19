import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react'
import { kDashboardBlack, kGreenApp } from './config/colors';
import { textThemes } from './theme/theme';
import { Avatar, Badge, Divider, Grid } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import cncm_logo from './assets/cncm_logo.svg'




const drawerWidth = 240;

const App = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [userType, setUserType] = useState(Math.floor(Math.random() * 3))

  console.log(setUserType)



  //can change based on the user type
  const userPages = [
    {
      name: 'Inbox',
      component: <Typography>Inbox</Typography>
    },
    {
      name: 'Starred',
      component: <Typography>Starred</Typography>
    },

    {
      name: 'Drafts',
      component: <Typography>Drafts</Typography>
    },
  ]

  const userPages2 = [

    {
      name: 'Starred',
      component: <Typography>Starred</Typography>
    },

    {
      name: 'Drafts',
      component: <Typography>Drafts</Typography>
    },
  ]

  const userPages3 = [
    {
      name: 'Inbox',
      component: <Typography>Inbox</Typography>
    },

  ]

  const pages = [userPages, userPages2, userPages3]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  };

  const drawer = (
    <Box>
      {/* <Toolbar /> */}
      <img height={50} style={{ padding: 5, margin: 3, textAlign: 'center', cursor: 'pointer' }} src={cncm_logo} alt='CNCM Logo' />
      <Divider />
      <List>
        {pages[userType].map((menu, index) => (
          <ListItem onClick={() => {
            setSelectedIndex(index)
          }} button key={menu.name} sx={{ backgroundColor: selectedIndex === index ? kGreenApp : 'white', my: 1, py: 1, '&:hover': { backgroundColor: selectedIndex === index ? kGreenApp : 'white', } }}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText disableTypography primary={<Typography sx={{ ...textThemes.dashboardTexts, color: selectedIndex === index ? 'white' : 'black' }}>{menu.name}</Typography>} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
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
                Users
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
        {
          pages[userType][selectedIndex]['component']
        }
      </Box>
    </Box>
  )
}


export default App