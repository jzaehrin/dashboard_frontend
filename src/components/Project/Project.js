import React, { Component, PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';

import formatProject from '../../utils/project_helper';

export default class Dashboard extends Component {
  static propTypes = {
    handleDetails: PropTypes.func,
    data: PropTypes.shape({
      title: PropTypes.string,
      short_description: PropTypes.string,
      status: PropTypes.string,
      deadline: PropTypes.string,
      tags: PropTypes.string,
      nbr_people: PropTypes.number,
      user: PropTypes.shape({
        email: PropTypes.string,
      }),
    }).isRequired,
  };

  constructor() {
    super();

    this.handleDetails = this.handleDetails.bind(this);
  }

  state = {};

  handleDetails() {
    if(this.props.handleDetails){
      this.props.handleDetails(this.props.data);
    }
  }


  render() {
    const style = {
      paddingBottom: 0,
    }
    let project = formatProject(this.props.data);

    return (
      <Card>
        <CardHeader
          title={project.status}
          subtitle={project.deadline}
          style={style}
          avatar={(<Avatar>{project.user.username.substring(0,2).toUpperCase()}</Avatar>)}
        />
        <CardTitle
          title={project.title}
          subtitle={project.short_description}
          style={style}
        />
        <CardActions>
          <FlatButton label="Details" onTouchTap={this.handleDetails}/>
        </CardActions>
      </Card>
    );
  }
}