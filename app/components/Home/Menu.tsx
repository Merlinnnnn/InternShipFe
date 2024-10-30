import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon, Collapse, Divider, IconButton, useTheme, Toolbar, Typography, Avatar, ListItemButton, Popover, MenuItem } from '@mui/material';
import { Settings as SettingsIcon, FiberManualRecord, ExpandLess, ExpandMore, Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import styles from './HomePage.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/AuthContext';
import apiService from '@/app/untils/api';

interface MenuProps {
  drawerWidth: number;
  open: boolean;
  handleDrawerToggle: () => void;
}

interface Dept {
  id: number;
  departmentName: string;
  level: number;
}
interface Row {
  reportId: number;
  statusName: string;
  departmentName: string;
  level: number;
  startTime: string;
  endTime: string;
  reportPeriod: string;
  createAt: string;
  createName: string;
}

interface ApiResponse {
  code: number;
  data: {
    currentPage: number;
    items: Row[];
    nextPage: number | null;
    prevPage: number | null;
    total: number;
  };
  message: string;
}
const Menu: React.FC<MenuProps> = ({ drawerWidth, open, handleDrawerToggle }) => {
  const theme = useTheme();
  const [openSubMenu, setOpenSubMenu] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();
  const [dept, setDept] = useState<Dept | null>(null);
  const [notifiApproval, setNotifiApproval] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const storedAvatar = localStorage.getItem('avatar');
    const storedFullName = localStorage.getItem('fullName');
    const storedDept = localStorage.getItem('dept');

    if (storedDept) {
      setDept(JSON.parse(storedDept) as Dept);
    }
    setAvatar(storedAvatar);
    setFullName(storedFullName);
    const accLv = localStorage.getItem('accLv') || '0';
    if (accLv == '1') {
      fetchRowLv1();
    }
  }, []);

  const fetchRowLv1 = async () => {
    try {
      const accLv = localStorage.getItem('accLv') || '0';
      const dept = localStorage.getItem('dept')
      if (dept) {
        const dept_id = JSON.parse(dept)?.id;
        const res = await apiService.get<ApiResponse>(`/report/department-approve/${dept_id}`);
        console.log(res);
        const data = res.data.data.items;
        const filteredRows = data.filter(row => row.level >= parseInt(accLv));
        setNotifiApproval(filteredRows.length.toString())
        console.log(filteredRows.length.toString())
      }
    } catch (error) {
      console.error("Failed to fetch rows:", error);
    }
  };

  const router = useRouter();

  const handleClick = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogOut = async () => {
    logout();
  };

  const handlePrintInfo = async () => {
    console.log(localStorage.getItem('permission'));
    console.log(localStorage.getItem('dept'));
    console.log(localStorage.getItem('access_token'));
  };

  const handleArrowClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? 'simple-popover' : undefined;

  if (!isMounted) {
    return null;
  }

  return (
    <Box
      sx={{
        width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
          boxSizing: 'border-box',
          backgroundColor: '#14317f',
        },
        height: '100vh',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        backgroundColor: '#14317f',
        position: 'relative',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          backgroundColor: '#14317f',
          gap: '5px',
          height: '90px'
        }}
      >
        {open && (
          <>
            <Avatar className={styles.logo} src="/logo.png" alt="Logo" />
            <div></div>
            <Typography variant="h6" noWrap component="div" className={styles.titleTxt} sx={{ color: '#ffffff' }}>
              Ủy ban nhân dân thành phố<br />Hồ Chí Minh
            </Typography>
          </>
        )}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ color: '#ffffff' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: '#ffffff' }} />
      <List>
        <ListItemButton onClick={handleClick} className={styles.item}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          {open && <ListItemText primary="System" />}
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        {open && (
          <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/department')}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                </ListItemIcon>
                <ListItemText primary="Department" />
              </ListItemButton>
              <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/permission')}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                </ListItemIcon>
                <ListItemText primary="Permission" />
              </ListItemButton>
              <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/role')}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                </ListItemIcon>
                <ListItemText primary="Role" />
              </ListItemButton>
              <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/user')}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                </ListItemIcon>
                <ListItemText primary="User" />
              </ListItemButton>
              {dept?.level === 1 && (
                <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/reportconfig')}>
                  <ListItemIcon>
                    <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Report Configuration" />
                </ListItemButton>
              )}
              <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/reportedit')}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                </ListItemIcon>
                <ListItemText primary="Report Manager" />
              </ListItemButton>
              {/* {dept?.level != 1 && (
                <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/report')}>
                  <ListItemIcon>
                    <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Report Edit" />
                </ListItemButton>
              )} */}
              {/* {dept?.level === 1 && (
                <ListItemButton sx={{ color: '#ffffff', position: 'relative' }} onClick={() => handleNavigation('/report')}>
                  <ListItemIcon>
                    <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Report Approved" />
                  {parseInt(notifiApproval) >= 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'red',
                        color: '#ffffff',
                        borderRadius: '50%',
                        padding: '2px 8px',
                        fontSize: '12px',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {notifiApproval}
                    </Box>
                  )}
                </ListItemButton>
              )} */}

            </List>
          </Collapse>
        )}
        {!open && (
          <>
            <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/department')}>
              <ListItemIcon>
                <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/permission')}>
              <ListItemIcon>
                <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/role')}>
              <ListItemIcon>
                <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton sx={{ color: '#ffffff' }} onClick={() => handleNavigation('/user')}>
              <ListItemIcon>
                <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton sx={{ color: '#ffffff' }}>
              <ListItemIcon>
                <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
              </ListItemIcon>
            </ListItemButton>
            {/* {dept?.level === 1 && (
              <ListItemButton sx={{ color: '#ffffff' }}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ color: '#ffffff', width: '4px', marginLeft: '10px' }} />
                </ListItemIcon>
              </ListItemButton>
            )} */}
          </>
        )}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, color: '#ffffff' }}>
        <Divider sx={{ borderColor: '#ffffff', width: '260px', marginLeft: '10px' }} />
        <Box sx={{ alignItems: 'center', flexDirection: 'row', display: 'flex' }}>
          <ListItem button sx={{ width: '230px' }}>
            <ListItemIcon>
              {avatar ? (
                <Avatar sx={{ height: '40px', width: '40px' }} src={avatar} alt="Avatar" />
              ) : (
                <PersonIcon sx={{ color: '#ffffff', height: '40px', width: '40px' }} />
              )}
            </ListItemIcon>
            {open && (
              <ListItemText primary={fullName || "Not Found"} />
            )}
          </ListItem>
          <IconButton onClick={handleArrowClick}>
            <ArrowForwardIosIcon sx={{ color: '#ffffff', height: '20px', width: '20px', marginLeft: '15px' }} />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#ffffff', width: '260px', marginLeft: '10px' }} />
      </Box>
      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List sx={{ width: '200px' }}>
          <ListItemButton onClick={handlePrintInfo}>
            <ListItemText primary="Print Info" />
          </ListItemButton>
          <ListItemButton onClick={handleLogOut}>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </List>
      </Popover>
    </Box>
  );
};

export default Menu;
