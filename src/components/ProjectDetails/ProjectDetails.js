import React, { Component, PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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

  }

  state = {};

  render() {
    let project = formatProject(this.props.data);

    return (
      <Card>
        <CardHeader
          title={project.status}
          subtitle={project.deadline}
          avatar={(<Avatar>{project.user.username.substring(0,2).toUpperCase()}</Avatar>)}
        />
        <CardTitle title={project.title} subtitle={project.short_description} />
        <CardText>
          <p>
            <strong>Project manager:</strong> {project.user.username} - {project.user.email}
          </p>
          <p>
            <strong>Number of people:</strong> {project.nbr_people}
          </p>
          <p>
            <strong>Tags :</strong> {project.tags}
          </p>
        </CardText>
      </Card>
    );
  }
}