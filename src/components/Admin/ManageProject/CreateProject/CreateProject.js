import React, { Component, PropTypes } from 'react';
import Axios from 'axios';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import {cyan50, cyanA700 } from 'material-ui/styles/colors';

export default class CreateProject extends Component {
  static propTypes = {
    auth_jwt: PropTypes.string.isRequired,
    handleRefreshProjectList: PropTypes.func,
  }

  constructor(props) {
    super();

    this.axios = Axios.create({
      headers: {'Authorization' : props.auth_jwt}
    });
  }

  state = {
    title: '',
    shortDescription: '',
    date: '',
    status: '',
    nbrPeople: '',
    tags: [],
    statusValue: [],
    create_error: false,
  }

  // Delete a tag
  handleRequestDeleteTags = (tag) => {
    this.setState(s => {
      return {tags: [...s.tags.filter(t => t !== tag)]}
    });
  }

  // Add a tag
  handleAddTag = (event) => {
    event.preventDefault();

    if (this.tagField.input.value) {
      this.setState(s => ({
        tags: [...s.tags, this.tagField.input.value]
      }), () => {
        this.tagField.input.value = ''
      });
    }
  }

  // Define the different status that the user can choose for the creation for a project
  handleStatusChange = (event, index, statusValue) => {
    let selectedStatus = '';

    switch (statusValue) {
      case 0:
        statusValue = '';
        break;
      case 1:
        selectedStatus = 'in_progress';
        break;
      case 2:
        selectedStatus = 'canceled';
        break;
      case 3:
        selectedStatus = 'finished';
        break;
      default:
        statusValue = '';
        break;
    }
    this.setState({statusValue, selectedStatus});
  }

  // Create a project
  createProject = (e) => {
    e.preventDefault();

    // If there is a empty value -> error
    if (!this.title.input.value ||
        !this.shortDescription.input.refs.input.value ||
        !this.date.state.date ||
        !this.state.statusValue ||
        !this.state.tags.join(', ') ||
        !this.nbrPeople.input.value)
    {
      this.setState({create_error: true});
    }
    // Recover the values of the fields and add the values in the database for the project created
    else
    {
      this.axios.post("https://markal.servehttp.com/dashboard/admin/projects", {
        project: {
          title: this.title.input.value,
          short_description: this.shortDescription.input.refs.input.value,
          status: this.state.selectedStatus,
          deadline: moment(this.date.state.date).format("YYYY-MM-DD"),
          tags: this.state.tags.join(', '),
          nbr_people: this.nbrPeople.input.value,
        }
      })
        .then((response) => {
        console.log("Send", response);
          this.setState({
            statusValue: 0,
            selectedStatus: "",
            tags: [],
            create_error: false
          }, () => {
            // Clear the form
            this.form.reset();

            // Clean props 
            if (this.props.handleRefreshProjectList != undefined) {
              this.props.handleRefreshProjectList()
            }
          });
        })
        .catch((error) => {
          this.setState({create_error: true});
          console.error("Create project, Sending error", error);
        })
    }
  }

  render() {
    const style = {
      marginRight: 20,
    };

    const chip = {
      margin: 4,
    };

    // Add the different tags
    let tags = this.state.tags.map((tag, index) => (
      <Chip
        style={chip}
        backgroundColor={cyanA700}
        onRequestDelete={this.handleRequestDeleteTags.bind(null, tag)}
      >{tag}</Chip>
    ));

    // Form to create a project, display a error if the field is empty
    return (
      <form
        onSubmit={this.createProject}
        ref={(form) => this.form = form}
      >
        <h2>Créer un projet</h2>
        <TextField
          floatingLabelText="Titre"
          errorText={(this.state.create_error && this.title.input.value == "") ? "Le champ est vide": ""}
          ref={(title) => { this.title = title; }}
        /><br />
        <TextField
          floatingLabelText="Courte description / objectifs"
          multiLine={true}
          errorText={(this.state.create_error && this.shortDescription.input.refs.input.value == "") ? "Le champ est vide": ""}
          ref={(shortDescription) => { this.shortDescription = shortDescription; }}
        /><br />
        <SelectField
          floatingLabelText="Status"
          value={this.state.statusValue}
          errorText={(this.state.create_error && this.state.statusValue == "") ? "Sélectionnez une valeur": ""}
          onChange={this.handleStatusChange}
        >
          <MenuItem value={0} primaryText="<None>" />
          <MenuItem value={1} primaryText="En cours" />
          <MenuItem value={2} primaryText="Annulé" />
          <MenuItem value={3} primaryText="Terminé" />
        </SelectField>
        <br />
        <DatePicker
          hintText="Date d'échéance"
          mode="landscape"
          ref={(date) => { this.date = date; }}
        />
        <TextField
          floatingLabelText="Tags"
          errorText={(this.state.create_error && this.state.tags == "") ? "Ajoutez au moins une tag": ""}
          ref={(tagField) => { this.tagField = tagField; }}
        />
        <RaisedButton
          label="Ajouter"
          primary={true}
          onClick={this.handleAddTag}
          />
        {/* Display the tags */}
        <div>
          {tags}
        </div><br />
        <TextField
          floatingLabelText="Nombre de personnes"
          errorText={(this.state.create_error && this.nbrPeople.input.value == "") ? "Le champ est vide": ""}
          ref={(nbrPeople) => { this.nbrPeople = nbrPeople; }}
        /><br />
        <RaisedButton
          backgroundColor={cyan50}
          type="submit"
          label="Créer"
          style={style} />
      </form>
    );
  }
}
