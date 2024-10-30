import React, { ReactNode } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, ThemeProvider, createTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from './Home/HomePage.module.css';

const drawerWidth = 285;
const theme = createTheme();

const Menu = dynamic(() => import('./Home/Menu'), { ssr: false });

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [open, setOpen] = React.useState(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' , height: '100%'}}>
                <CssBaseline />
                <Menu drawerWidth={drawerWidth} open={open} handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Layout;
