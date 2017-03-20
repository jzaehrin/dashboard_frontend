import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';
import Axios from 'axios';
import JwtDecode from 'jwt-decode';
import RaisedButton from 'material-ui/RaisedButton';
import {cyan100} from 'material-ui/styles/colors';

export default class App extends Component {

  static propTypes = {
    auth_jwt: PropTypes.string.isRequired,
  }

  constructor(props) {
    super();

    this.axios = Axios.create({
      headers: {'Authorization' : props.auth_jwt}
    });
  }

  componentWillMount() {
    this.getProjectManager("");
  }

  state = {
    users: [],
  }

  getProjectManager(){
    this.axios.get('http://localhost:3000/admin/users')
      .then((response) => {
        console.log("Users", response.data[1]);
        this.setState({users: response.data});
      })
      .catch((error) => {
        console.error(error);
      })
  }

  createProjectManager = (e) => {
    e.preventDefault();
    let username = this.username.input.value;
    let email = this.email.input.value;

    if (!username &&
        !email &&
        !this.password.input.value)
    {
      this.setState({create_error: true})
    }
    else if(this.state.users.filter(u => u.username === username).length > 0 ){
      this.setState({create_error: true, create_error_message: "Ce Username existe déjà"})
    }
    else if(this.state.users.filter(u => u.email  === email).length > 0 ){
      this.setState({create_error: true, create_error_message: "Cette email existe déjà"})
    }
    else
    {
      this.axios.post("http://localhost:3000/admin/users", {
        user: {
          username: this.username.input.value,
          email: this.email.input.value,
          password: this.password.input.value,
          is_admin: this.isAdmin.state.switched,
        }
      })
        .then((response) => {
          this.email.input.value = "";
          this.username.input.value = "";
          this.password.input.value = "";
          this.setState({create_error: false})

          this.getProjectManager();
        })
        .catch((error) => {
          console.error("Create Project Manager Error :", error);
          this.setState({create_error: false, create_error_message: "Unable to create User"})
        })
    }
  }

  handleDeleteProjectManager = (user) => {
    this.axios.delete("http://localhost:3000/admin/users/" + user.id)
      .then((response) => {
        this.getProjectManager();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    console.log(this.state.users, JwtDecode(this.props.auth_jwt));

    let users = this.state.users.map((user, index) => (
      <Chip
        onRequestDelete={
          (user.id == JwtDecode(this.props.auth_jwt).user_id) ?
            null:
            this.handleDeleteProjectManager.bind(null, user)
        }
        backgroundColor={user.is_admin ? cyan100: ""}
      >{user.username} -- {user.email}</Chip>
    ));

    let create_error_message = ""
    if (this.state.create_error && this.state.create_error_message) {
      create_error_message = (<p>{this.state.create_error_message}</p>);
    }

    return (
      <div>
        <h2>Créer un chef de projet</h2>
        <TextField
          floatingLabelText="Username"
          errorText={(this.state.create_error && this.username.input.value == "") ? "Le champ est vide": ""}
          ref={(username) => this.username = username}
        /><br />
        <TextField
          floatingLabelText="Email"
          errorText={(this.state.create_error && this.email.input.value == "") ? "Le champ est vide": ""}
          ref={(email) => this.email = email}
        /><br />
        <TextField
          floatingLabelText="Mot de passe"
          type="password"
          errorText={(this.state.create_error && this.password.input.value == "") ? "Le champ est vide": ""}
          ref={(password) => this.password = password}
        /><br />
        <Toggle
          label="Admin"
          ref={(isAdmin) => this.isAdmin = isAdmin}
        /><br />
        {create_error_message}
        <RaisedButton
          label="Add"
          primary={true}
          onClick={this.createProjectManager}
        />

        <h2>Supprimer un chef de projet</h2>
        {users}
      </div>
    );
  }
}
