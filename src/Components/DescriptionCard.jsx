import React from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
const DescriptionCard = () => {
    return <Box sx={{width: '100%', display: 'grid', placeItems: 'center', padding: '1rem', background: '#4f5d75'}}>
        <Card variant='outlined' sx={{width: '65vw'}}>
            <CardHeader sx={{textAlign:'center'}} title='Merge PDFs easily'/>
            <CardContent>
                <Typography sx={{textAlign:'center'}}>
                    Just upload PDFs and images to convert them in to a single PDF file!
                </Typography>
            </CardContent>
        </Card>
    </Box>
}

export default DescriptionCard;

// 4f5d75