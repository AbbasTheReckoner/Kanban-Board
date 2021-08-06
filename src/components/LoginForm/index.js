import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import './index.css'

const users = [
  {
    id: 'user-1',
    name: 'Shaik Abbas',
    email: 'shaikabbas101@gmail.com',
    password: '123456',
  },
  {
    id: 'user-2',
    name: 'Guru Dharani',
    email: 'guru123@gmail.com',
    password: '123456789',
  },
  {
    id: 'user-3',
    name: 'venkat',
    email: 'venkat100@gmail.com',
    password: '12345',
  },
]

class LoginForm extends Component {
  state = {
    validUsersList: users,
    email: '',
    password: '',
    showSubmitError: false,
    errorMsg: '*Invalid Credentials*',
    isEmailEmpty: false,
    isPasswordEmpty: false,
  }

  onChangeEmail = event => {
    this.setState({
      email: event.target.value,
      errorMsg: '',
      isEmailEmpty: false,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
      errorMsg: '',
      isPasswordEmpty: false,
    })
  }

  onSubmitSuccess = (token, validUser) => {
    const {history} = this.props
    localStorage.setItem('token', JSON.stringify(token))
    localStorage.setItem('loggedInUserDetails', JSON.stringify(validUser[0].id))
    alert(`Welcome ${validUser[0].name} you are successfully Logged in`)
    history.replace('/')
  }

  onSubmitFailure = () => {
    this.setState({showSubmitError: true, errorMsg: '*Invalid Credentials*'})
  }

  submitForm = async event => {
    event.preventDefault()
    const {email, password, validUsersList} = this.state
    email === ''
      ? this.setState({isEmailEmpty: true})
      : this.setState({isEmailEmpty: false})
    password === ''
      ? this.setState({isPasswordEmpty: true})
      : this.setState({isPasswordEmpty: false})

    const validUser = validUsersList.filter(
      eachUser => eachUser.email === email && eachUser.password === password,
    )
    if (validUser.length !== 0) {
      const token = Math.random().toString(36).substring(3)
      this.onSubmitSuccess(token, validUser)
    } else {
      this.onSubmitFailure()
    }
  }

  renderPasswordField = () => {
    const {password, isPasswordEmpty} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-filed"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
        {isPasswordEmpty && <p className="required-msg">*Required</p>}
      </>
    )
  }

  renderEmailField = () => {
    const {email, isEmailEmpty} = this.state
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="text"
          id="email"
          className="email-input-filed"
          value={email}
          onChange={this.onChangeEmail}
          placeholder="Email"
        />
        {isEmailEmpty && <p className="required-msg">*Required</p>}
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://res.cloudinary.com/dkr26vkii/image/upload/v1627464184/rekconsys_logo_ksujqs.jpg"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <img
          src="https://image.freepik.com/free-vector/devops-team-abstract-concept-vector-illustration-software-development-team-member-agile-workflow-devops-team-model-it-teamwork-project-management-integrated-practice-abstract-metaphor_335657-2299.jpg"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://res.cloudinary.com/dkr26vkii/image/upload/v1627464184/rekconsys_logo_ksujqs.jpg"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">{this.renderEmailField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
