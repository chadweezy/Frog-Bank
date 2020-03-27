import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import './Login.css'
import {Button} from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.setRoleUser = this.setRoleUser.bind(this);
    this.setRoleAdmin = this.setRoleAdmin.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      role: '',
      email: '',
      password: '',
      loginError: '',
      isLoading: false,
      redirTo: '/login',
      forget:false,
      sent:false,
      user: {}
    };
  }

  //Controls page display based on user actions
  setRoleUser = () => this.setState({role: 'User'});
  setRoleAdmin = () => this.setState({role: 'Admin'});
  resetRole = () => this.setState({role: '', loginError: ''});

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  //Logic for forgetting password
  //TODO: Send an actual email when emailSent() gets called
  forgetP = () => this.setState({ forget:true });
  emailSent = () => {
    this.setState({forget:false})
    this.setState({sent:true})
  }

  //Upon submitting a login form, call the appropriate route
  onSubmit(e) {
    this.setState({isLoading: true});
    e.preventDefault();

    const { email, password, role } = this.state;
    const user = {
      email,
      password,
      role
    };

    //User login
    if (role === 'User') {
      this.props.login('/users/login', user, data => {
        if (data.success) {
          this.setState({
            email: '',
            password: '',
            loginError: '',
            isLoading: false,
            redirTo: "/users"
          });

          this.props.setUserRole('user');
        } else {
          this.setState({
            email: '',
            password: '',
            loginError: 'Incorrect username or password. Please try again.',
            isLoading: false,
          });
        }
      });
    }

    //Vendor login
    else if (role === 'Admin') {
      this.props.login('/admins/login', user, data => {
        if (data.success) {
          this.setState({
            email: '',
            password: '',
            loginError: '',
            isLoading: false,
            redirTo: '/admins'
          });
          this.props.setUserRole('admin');
        } else {
          this.setState({
            email: '',
            password: '',
            loginError: 'Incorrect username or password. Please try again.',
            isLoading: false
          });
        }
      })
    }
  }

  //Render the appropriate input fields
  render() {

    if (this.props.loggedIn) return <Redirect to={this.state.redirTo}/>;
    if (this.state.isLoading) return <p>Loading...</p>

    if (!this.state.role) {
      return (
        <div>
          <center>
          <h1 className="login">Login Page</h1>
          <Button className="loginButton" onClick={this.setRoleUser}>User</Button>
          <Button className="loginButton" onClick={this.setRoleVendor}>Vendor</Button>
          </center>
        </div>
      );
    }

    return (
      <center>
      <div className="login-view-container">
        <div className="login-container">
          <div className="login-input-container">
            <h3 className="login">{this.state.role} Login</h3>
            <br />
            {this.state.sent? <p>Check your email to reset Password!</p> : null}
            {this.state.forget ?
              <Card  style={{backgroundColor: 'lightgreen'}}>
                <Card.Header>Forgot Password</Card.Header>
                  {this.state.notify ?
                  <Card.Title style={{backgroundColor: 'white'}}> Enter email</Card.Title>:null}
                <Card.Body>

                  <Card.Text>
                    <Form style={{
                    left:650}}>
                    <Form.Control placeholder="email@email.com" />
                      <Button onClick={this.emailSent}>
                          Submit
                          </Button>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
               : null}
          </div>
          {this.state.loginError ? <p>{this.state.loginError}</p> : null}
          <form
            onSubmit={e => this.onSubmit(e)}
            className="login-form-container"
          >
            <div className="login-input-container">
              <label htmlFor="email"></label>
              <label>Email: </label>
              <div className="col-sm-4">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                required
                className="form-control"
                value={this.state.email}
                onChange={e => this.onChange(e)}
              />
              </div>
            </div>
            <div className="login-input-container">
              <label htmlFor="password"></label>
              <label>Password: </label>
              <div className="col-sm-4">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                required
                className="form-control"
                value={this.state.password}
                onChange={e => this.onChange(e)}
              />
              </div>
            </div>
            <div className="login-input-container">
              <input type="submit" value="Login" className="loginButton" />
            </div>
            <Button className="loginButton" onClick={this.forgetP}>Forgot password?</Button>
            <Button className="loginButton" onClick={this.resetRole.bind(this)}>Return</Button>
          </form>
        </div>
        {/* {this.state.role === '' ? <div className = "wordloginimg">
              <img className="wordCloud" src={wordCloud} alt="Words" width="100%" height="200%"></img>
        </div> : null} */}
      </div>
      </center>

    );
  }
}

export default withRouter(Login);
