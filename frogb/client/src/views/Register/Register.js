import React from 'react'
import axios from 'axios'
import { Redirect, withRouter } from 'react-router-dom'
import './Register.css'

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            registerErrors: [],
            isLoading: false,
            redirTo: null
        };
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    //When submitting your registration info, call the appropriate route
    onSubmit = (e) => {
        this.setState({isLoading: true});
        e.preventDefault();

        const { name, email, password, password2 } = this.state;

        const user = {
            name,
            email,
            password,
            password2
        };

        axios.post('/users/register', user).then(res => {
            if (res.data.success) {
                this.setState({
                    name: '',
                    email: '',
                    password: '',
                    password2: '',
                    registerErrors: [],
                    isLoading: false,
                    redirTo: '/login'
                });
                this.props.history.push('/login');
            } else {
                this.setState({
                    password: '',
                    password2: '',
                    registerErrors: res.data.message,
                    isLoading: false
                });
            }
        })
    }

    //Renders forms for user input and appropriate error messages
    render() {
        if (this.props.loggedIn) return <Redirect to='/users'/>
        if (this.state.isLoading) return <p>Loading...</p>

        return (
            <div>
                <center>
                <h3 className = "register_title">User Registration</h3>
                {this.state.registerErrors ? this.state.registerErrors.length > 0
                    ? this.state.registerErrors.map((errMsg, index) => (
                            <p className="register-error-message" key={index}>
                                {errMsg.msg}
                            </p>
                        ))
                    : null : null}
                <form onSubmit={e => this.onSubmit(e)}>
                    <div className="form-group">
                        <label>Name: </label>
                        <div className="col-sm-4">
                        <input 
                        type="text" 
                        name="name"
                        placeholder = "Enter Name" 
                        required 
                        className="form-control" 
                        value={this.state.name} 
                        onChange={e => this.onChange(e)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <div className="col-sm-4">
                        <input 
                        type="email" 
                        name="email"
                        placeholder = "Enter Email" 
                        required 
                        className="form-control" 
                        value={this.state.email} 
                        onChange={e => this.onChange(e)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <div className="col-sm-4">
                        <input 
                        type="password" 
                        name="password" 
                        placeholder = "Enter Password" 
                        required className="form-control" 
                        value={this.state.password} 
                        onChange={e => this.onChange(e)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password: </label>
                        <div className="col-sm-4">
                        <input 
                        type="password" 
                        name="password2"
                        placeholder = "Re-enter Password"  
                        required className="form-control" 
                        value={this.state.password2} 
                        onChange={e => this.onChange(e)}/>
                        </div>
                    </div>
                    <center>
                    <div className="form-group">
                        <input 
                        type="submit" 
                        value="Register Now!" 
                        className="register-button"/>
                    </div>
                    </center>
                </form>
                </center>
            </div>
        );
    }
}

export default withRouter(Register);
