import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link } from '@mui/material';

const Navbar = () =>  {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{background: "#4f5d75"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            📑
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PDF Merge
          </Typography>
          
          <IconButton>
            <Link href='https://github.com/rayansailani/pdf-merge'>
            <GitHubIcon />
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;