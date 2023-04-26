import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import "./Signup.css";
const Swal = require("sweetalert2");

const minPasswordLength = 6;

export class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: "",
      lastname: "",
      username: "",
      emailID: "",
      mobileNumber: "",
      password: "",
      cpassword: "",
      signedup: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Update state when values are changed.
   * @param {*} event
   */
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  /**
   * When user submits the form.
   *
   * @TODO sanitize the data, notify user of errors, and make a post request here to create a new user.
   */
  handleSubmit(event) {
    event.preventDefault();
    const letters = /^[A-Za-z]+$/;

    if (
      !this.state.firstname ||
      !this.state.lastname ||
      !this.state.firstname.match(letters) ||
      !this.state.lastname.match(letters)
    ) {
      // alert('Must enter in a valid first and last name.');
      Swal.fire("", "Must enter in a valid first and last name.", "question");
    } else if (
      !this.state.password ||
      this.state.password.length < minPasswordLength
    ) {
      // alert(
      // 	'Enter in a password! Anything you like, it just has to be longer than 6 characters.'
      // );
      Swal.fire(
        "",
        "Enter in a password! Anything you like, it just has to be longer than 6 characters.",
        "question"
      );
    } else if (this.state.cpassword !== this.state.password) {
      // alert('Please re-enter the same password');
      Swal.fire("", "Please re-enter the same password", "question");
    } else {
      console.log("post request for new user");

      // Make the post request
      const uri = `https://poolnride-api.onrender.com/user/signup`;

      const formdata = JSON.stringify(this.state);

      const self = this;

      fetch(uri, {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (response.status === 200) {
            self.setState({
              signedup: true,
            });
            // alert('Signup Successful! Please Signin');
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Signup Successful! Please Signin",
              showConfirmButton: false,
              timer: 1500,
            });
            // window.location.reload();
          }
        })
        .catch(function (err) {
          console.log("Request failed", err);
        });
    }
  }

  render() {
    if (this.state.signedup) {
      return <Navigate to="/signin" />;
    }
    return (
      <div>
        <NavBar />
        <div className="UserAccountContainer">
          {/* <h1 className="formInput">Signup</h1> */}
          {/* <form className="UserAccountForm" onSubmit={this.handleSubmit}>
						<label className="UserAccountFormInput">First name</label>
						<input
							type="text"
							name="firstname"
							value={this.state.firstname}
							onChange={this.handleChange}
						/>

						<label className="UserAccountFormInput">Last name</label>
						<input
							type="text"
							name="lastname"
							value={this.state.lastname}
							onChange={this.handleChange}
						/>

						<label className="UserAccountFormInput">User name</label>
						<input
							type="text"
							name="username"
							value={this.state.username}
							onChange={this.handleChange}
						/>

						<label className="UserAccountFormInput">Email Address</label>
						<input
							type="text"
							name="emailID"
							value={this.state.emailID}
							onChange={this.handleChange}
						/>

						<label className="UserAccountFormInput">Mobile Number</label>
						<input
							type="text"
							name="mobileNumber"
							value={this.state.mobileNumber}
							onChange={this.handleChange}
						/>

						<label className="UserAccountFormInput">Password</label>
						<input
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
						/>

						<label className="UserAccountFormInput">Confirm Password</label>
						<input
							type="password"
							name="cpassword"
							value={this.state.cpassword}
							onChange={this.handleChange}
						/>

						<input
							className="UserAccountFormInput"
							type="submit"
							value="Submit"
						/>
					</form> */}
          <div className="signup-box">
            <h2>Sign up</h2>
            <Form noValidate onSubmit={this.handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationFormik01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={this.state.firstname}
                    onChange={this.handleChange}
                    // isValid={touched.firstName && !errors.firstName}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik02">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={this.state.lastname}
                    onChange={this.handleChange}
                    // isValid={touched.lastName && !errors.lastName}
                  />

                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="4"
                  controlId="validationFormikUsername"
                >
                  <Form.Label>Username</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      aria-describedby="inputGroupPrepend"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      // isInvalid={!!errors.username}
                    />
                    {/* <Form.Control.Feedback type="invalid">
										{errors.username}
									</Form.Control.Feedback> */}
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFormik03">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="emailid"
                    name="emailID"
                    value={this.state.emailID}
                    onChange={this.handleChange}
                    // isInvalid={!!errors.city}
                  />

                  {/* <Form.Control.Feedback type="invalid">
									{errors.city}
								</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormik04">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    name="mobileNumber"
                    value={this.state.mobileNumber}
                    onChange={this.handleChange}
                    // isInvalid={!!errors.state}
                  />
                  {/* <Form.Control.Feedback type="invalid">
									{errors.state}
								</Form.Control.Feedback> */}
                </Form.Group>
                {/* <Form.Group as={Col} md="3" controlId="validationFormik05">
								<Form.Label>Zip</Form.Label>
								<Form.Control
									type="text"
									placeholder="Zip"
									name="zip"
									value={values.zip}
									onChange={handleChange}
									isInvalid={!!errors.zip}
								/>

								<Form.Control.Feedback type="invalid">
									{errors.zip}
								</Form.Control.Feedback>
							</Form.Group> */}
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFormik05">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    // isInvalid={!!errors.city}
                  />
                  <Form.Text className="text-muted">
                    Password must be longer than 6 characters.
                  </Form.Text>

                  {/* <Form.Control.Feedback type="invalid">
									{errors.city}
								</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormik06">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="re-enter the password"
                    name="cpassword"
                    value={this.state.cpassword}
                    onChange={this.handleChange}
                    // isInvalid={!!errors.state}
                  />
                  {/* <Form.Control.Feedback type="invalid">
									{errors.state}
								</Form.Control.Feedback> */}
                </Form.Group>
                {/* <Form.Group as={Col} md="3" controlId="validationFormik05">
								<Form.Label>Zip</Form.Label>
								<Form.Control
									type="text"
									placeholder="Zip"
									name="zip"
									value={values.zip}
									onChange={handleChange}
									isInvalid={!!errors.zip}
								/>

								<Form.Control.Feedback type="invalid">
									{errors.zip}
								</Form.Control.Feedback>
							</Form.Group> */}
              </Row>
              <Form.Group className="mb-3">
                <Form.Check
                  required
                  name="terms"
                  label="Agree to terms and conditions"
                  // onChange={handleChange}
                  // isInvalid={!!errors.terms}
                  // feedback={errors.terms}
                  feedbackType="invalid"
                  id="validationFormik0"
                />
              </Form.Group>
              <Button type="submit">Submit form</Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
