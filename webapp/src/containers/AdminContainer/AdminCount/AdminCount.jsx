import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper, Box } from '@material-ui/core';

import CountComponent from './CountComponent/CountComponent';
import useStyles from './style';

const AdminDashboard = () => {
  const classes = useStyles();

  return (
    <Paper elevation={1} className={classes.paper}>
      <Grid container>
        <Grid item sm={3} xs={12}>
          <Box mx={2}>
            <CountComponent count={10} label='Total Employee' />
          </Box>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Box mx={2}>
            <CountComponent count={10} label='Total Employee' />
          </Box>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Box mx={2}>
            <CountComponent count={10} label='Total Employee' />
          </Box>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Box mx={2}>
            <CountComponent count={10} label='Total Employee' />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminDashboard;
