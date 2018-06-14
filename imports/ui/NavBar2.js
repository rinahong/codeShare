import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Meteor } from 'meteor/meteor'

import { Link } from 'react-router-dom'
 
const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function NavBar(props) {
  const {onSignOut = () => {}} = props;
  const { classes } = props;
  const LoginLink = props => <Link to="/signin" {...props} />;
  const EditorLink = props => <Link to="/document/1" {...props} />
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>

          {
        Meteor.userId() ? ([  // Should be wrapped in the array
          <Typography variant="title" color="inherit" className={classes.flex} key='1' style={{marginRight: '20px'}}>Welcome to CodeShare, {Meteor.userId()}</Typography>,
          <Button color="inherit" component={EditorLink}>Editor</Button>,
          <Button color="inherit" key='2' href="/" onClick={onSignOut}>Sign Out </Button>
        ]) : (
          <Button color="inherit" component={LoginLink}>Login</Button>
        )
      }
        </Toolbar>
        
      </AppBar>
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);