import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

import List from '@material-ui/core/List';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';



const drawerWidth = 240;
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbarBroadridgeLogo: {
    backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/en/d/d0/Broadridge_Financial_Solutions_Logo.svg")',
    // backgroundImage: 'url('+ BroadridgeLogo+')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

const LoginLink = props => <Link to="/signin" {...props} />;
const MyDocumentsLink = props => <Link to="/me/documents" {...props} />

class NavBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      username: ""
    };

    // this.getUsername = this.getUsername.bind(this);

  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Beginning of compoenet did update")
    // Typical usage (don't forget to compare props):
    if(Meteor.userId()) {
      this.getUsername()
      console.log("username",this.state.username)
      // this.setState({usesrname: this.getUsername()});
    }
    // if (this.state.username !== prevState.username) {

    // }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  getUsername() {
    const {username} = this.state;
    return () => {
      Meteor.call('getUsername', (error, result) => {
        if(error) {
          console.log("There was an error to retreive Document list");
        } else {
          console.log("Username returned: ", result.profile.username)
          this.setState({username: result.profile.username});
          // return result.profile.username;

        }
      });
    }
  }



  render() {
    // const {  } = this.props;
    const { classes, children, theme, onSignOut = () => { } } = this.props;
    const { username } = this.state;
    return (
      <div className={classes.root}>
        <AppBar
          color="primary"
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>

          <Toolbar disableGutters={!this.state.open}>


            { Meteor.userId() ? ([  // Should be wrapped in the array
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.state.open && classes.hide)}>
                <MenuIcon />
              </IconButton>,
              <Typography variant="title" color="inherit" className={classes.flex} key='1' style={{ marginRight: '20px' }}>Welcome to CodeShare, { username }</Typography>,
              <Button color="inherit" key='2' component={MyDocumentsLink}>My Documents</Button>,
              <Button color="inherit" key='3' href="/" onClick={onSignOut}>Sign Out </Button>
            ]) : (
                <Button key='1' color="inherit" component={LoginLink}>Login</Button>)}

          </Toolbar>
        </AppBar>

        {Meteor.userId() ? ([  // Should be wrapped in the array
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}>
            <div className={classes.toolbarBroadridgeLogo}>
              {/* <img src="" /> */}

              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <div>
                <ListItem button>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="New Document" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <GetAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Download" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="History" />
                </ListItem>
              </div>
            </List>
            <Divider />
            <List>

              <div>
                <ListItem button>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </ListItem>
              </div>
            </List>
          </Drawer>,
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
        ]) : (
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
          )}



      </div>
    );
  }


}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NavBar);
