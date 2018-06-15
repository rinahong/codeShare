import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

export class Landing extends Component{
  

  render () {

    return (
    <div >
    <List component="nav">
      <ListItem button>
        <ListItemText inset primary="Blah.p" secondary="Last Edit: Jan 21, 2018 12:58"/>
      </ListItem>
      <ListItem button>
        <ListItemText inset primary="untitleda.p" secondary="Last Edit: Jan 21, 2018 12:58" />
      </ListItem>
    </List>
  </div>
    );
  }
  
}



export default withStyles(styles)(Landing);