import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      resv: [],
      first_name: "",
      id: "",
      errors: {},
    };

    this.deleteResv = this.deleteResv.bind(this);
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    this.setState({
      id: decoded._id,
      first_name: decoded.first_name,
    });

    axios
      .get("http://localhost:5000/users/profile?id=" + decoded._id)
      .then((res) => {
        this.setState({
          resv: res.data,
        });
      })
      .catch((err) => console.log(err));
  }

  deleteResv(id) {
    axios
      .delete("http://localhost:5000/users/profile/" + id)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    this.setState({
      resv: this.state.resv.filter((el) => el.id === this.state.id),
    });
  }

  render() {
    return (
      <div className="container">
        <div>
          <h1 className="text-center mt-2 text-dark">
            Welcome {this.state.first_name} !
          </h1>
        </div>
        <div className="col-sm-8 mx-auto">
          <div>
            <button type="button" className="btn btn-danger m-3">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={{
                  pathname: "/profile/add",
                  state: { userId: this.state.id },
                }}
              >
                Add Booking
              </Link>
            </button>
          </div>
          <table className="table m-3">
            <thead className="thead-dark">
              <tr>
                <th>
                  Customer Name<div style={{ height: 13 }}></div>
                </th>
                <th>
                  Age<div style={{ height: 13 }}></div>
                </th>
                <th>
                  Gender<div style={{ height: 13 }}></div>
                </th>
                <th>
                  Booking Date
                  <div style={{ fontSize: 12, height: 13 }}>(YYYY-MM-DD)</div>
                </th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.resv.map((resv) => {
                return (
                  <tr>
                    <th>{resv.customerName}</th>
                    <th>{resv.age}</th>
                    <th>{resv.gender}</th>
                    <th>{resv.date}</th>
                    <th>
                      <a
                        href="/profile"
                        onClick={() => this.deleteResv(resv._id)}
                      >
                        Delete
                      </a>
                    </th>
                    <th>
                      <button type="button" className="btn btn-info">
                        <Link
                          style={{ textDecoration: "none", color: "white" }}
                          to={{
                            pathname: "/profile/edit",
                            state: { userId: resv._id },
                          }}
                        >
                          Edit
                        </Link>
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Profile;
