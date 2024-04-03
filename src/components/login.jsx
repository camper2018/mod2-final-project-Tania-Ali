
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './login.module.css';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {logIn} from '../utilities/authServices';
import ErrorComponent from './displayError';

const Login = () => {

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  function handlePassword(value) {
    setCredentials({...credentials, password: value});
}
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  function handleEmail(value) {
    if (value.length > 0) {
        if (validateEmail(value)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    } else {
        setEmailValid(true);
    }
    setCredentials({...credentials, email: value })
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    if (credentials.email.length > 0 && !emailValid) {
        setFormErrors((prevErrors) => [...prevErrors, 'Email is invalid']);
    }
    if (credentials.email === '') {
        setFormErrors((prevErrors) => [...prevErrors, 'Email can\'t be blank']);
    }
    if (credentials.password === '') {
        setFormErrors((prevErrors) => [...prevErrors, 'Password can\'t be blank']);
    }
    if (
        credentials.email.length > 0 &&
        credentials.password.length > 0 &&
        emailValid
      ) {
        try {
            setIsLoading(true);
            // authenticate at backend using api
            const data = await logIn(credentials.email, credentials.password);
            if (data.success){
                localStorage.setItem('recipediajwt', data.jwt);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
              throw Error(data.error);
            }
        } catch (error) {
          setError(error.message);
        }
    }
  };
  if (error){
    return (<ErrorComponent error={error}/>)
  }
  return (
    <Container fluid>
      <Row className="vw-100 vh-100">
        <Col xs={12} md={6} className={`${styles.img} h-100`}></Col>
        <Col md={6} className={styles.rightContainer}>
          <Col className={styles.rightInnerContainer}>
            <form>
              <h2 className='mb-4'>Welcome to your Recipedia</h2>
              {formErrors.length > 0 && (
                    <ul className="list-group my-4">
                        {formErrors.map((err, idx) => (
                            <li key={idx} className='text-danger my-1 list-group-item list-group-item-warning border-0'>
                                {err}
                            </li>
                        ))}
                    </ul>
                )}
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                className={styles.emailInput}
                value={credentials["email"]}
                onChange={(e)=> {
                  handleEmail(e.target.value);
                }
              }
                type='email'
                name='email'
                placeholder='email'
                required
              ></input>
              <div className='mb-3 position-relative'>
                <label htmlFor='password'>Password</label>
                <input
                  id='password'
                  className={`${styles.passwordInput} position-relative`}
                  onChange={(e) => {
                    handlePassword(e.target.value), togglePasswordVisibility;
                  }}
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={credentials["password"]}
                  placeholder='password'
                  required
                ></input>
                <span
                  className={`${styles.passwordVisibility}`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye size={25} />

                  ) : (
                    <FaEyeSlash size={25} />
                  )}
                </span>
              </div>

              <button
                type="submit"
                className={`${styles.loginBtn} 
        ${isLoading ? styles.disabledLoginBtn : ''
                  } w-100`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div
                    className='spinner-border'
                    style={{ width: '1rem', height: '1rem', borderWidth: '.2em' }}
                    role='status'
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>
            <p className={`${styles.noAccountText} text-center`}>
              Don't have an account? <Link to="/register" className={`${styles.signupAnchor}`}>Sign up</Link>.
            </p>

          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
