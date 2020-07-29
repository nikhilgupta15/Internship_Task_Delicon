import React, { Component } from "react";
import axios from "axios";

export default class EditSurvey extends Component {
  constructor(props) {
    super(props);

    this.changeCustomerName = this.changeCustomerName.bind(this);
    this.onChangeAge = this.onChangeAge.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      customerName: "",
      age: 0,
      gender: "",
      date: new Date().toLocaleString(),
      id: props.location.state.userId,
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/users/" + this.state.id)
      .then((response) => {
        this.setState({
          customerName: response.data.customerName,
          age: response.data.age,
          gender: response.data.gender,
          date: response.data.date,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  changeCustomerName(e) {
    this.setState({
      customerName: e.target.value,
    });
  }

  onChangeAge(e) {
    this.setState({
      age: e.target.value,
    });
  }

  onChangeGender(e) {
    this.setState({
      gender: e.target.value,
    });
  }

  onChangeDate(e) {
    console.log(e.target.value.toLocaleString());
    this.setState({
      date: e.target.value.toLocaleString(),
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const resv = {
      customerName: this.state.customerName,
      age: this.state.age,
      gender: this.state.gender,
      date: this.state.date,
    };

    console.log(resv);

    axios
      .post("http://localhost:5000/users/profile/update/" + this.state.id, resv)
      .then((res) => console.log(res.data));

    window.location = "/profile";
  }

  render() {
    return (
      <div>
        <form className="mt-5" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Customer Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.customerName}
              onChange={this.changeCustomerName}
            />
          </div>
          <div className="form-group">
            <label>Age: </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.age}
              onChange={this.onChangeAge}
            />
          </div>
          <div className="form-group">
            <label>Gender: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.gender}
              onChange={this.onChangeGender}
            />
          </div>
          <div>
            <label>Booking Date: </label>
            <input
              type="date"
              className="form-control"
              onChange={this.onChangeDate}
              value={this.state.date}
            ></input>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Edit"
              className="btn btn-primary mt-3"
            />
          </div>
        </form>
      </div>
    );
  }
}
