import { Container, Row, Col } from 'react-bootstrap';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.css';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { register } from '../utilities/authServices';
import ErrorComponent from './displayError';
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();
        setFormErrors([]);
        if (email.length > 0 && !emailValid) {
            setFormErrors((prevErrors) => [...prevErrors, 'Email is invalid']);
        }
        if (email === '') {
            setFormErrors((prevErrors) => [...prevErrors, 'Email can\'t be blank']);
        }
        if (password === '' || confirmPassword === '') {
            setFormErrors((prevErrors) => [...prevErrors, 'Password can\'t be blank']);
        }
        if (password !== confirmPassword) {
            setFormErrors((prevErrors) => [...prevErrors, 'Passwords don\'t match']);
        }
        if (
            email.length > 0 &&
            password.length > 0 &&
            confirmPassword.length > 0 &&
            emailValid &&
            password === confirmPassword
        ) {
            try {
                setIsLoading(true);
                const data = await register(email, password);
                if (data.success){
                    localStorage.setItem('recipediajwt', data.jwt);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    navigate('/');
                } else {
                    console.error("Error: ", data.error)
                    throw  Error(data.error);
                }
            } catch (error) {
               console.error('Registration Failed', error);
               setError(error.message);

            }
        }
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

        setEmail(value);
    }
    function handlePassword(value) {
        setPassword(value);
    }

    function handleConfirmPassword(value) {
        setConfirmPassword(value);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                        <h1 className='mb-4'>Let's get started,</h1>
                        {formErrors.length > 0 && (
                            <ul className="list-group">
                                {formErrors.map((err, idx) => (
                                    <li key={idx} className='text-danger my-1 text-danger my-1 list-group-item list-group-item-warning border-0'>
                                        {err}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <label htmlFor='signupEmail'></label>
                        <input
                            id='signupEmail'
                            className={styles.emailInput}
                            onChange={(e) => {
                                handleEmail(e.target.value);
                            }}
                            type='text'
                            name='signupEmail'
                            placeholder='email'
                            required
                        ></input>
                        <div className='mb-3 position-relative'>
                            <label htmlFor='signupPassword'></label>
                            <input
                                id='signupPassword'
                                className={`${styles.passwordInput} position-relative`}
                                onChange={(e) => {
                                    handlePassword(e.target.value), togglePasswordVisibility;
                                }}
                                type={showPassword ? 'text' : 'password'}
                                name='signupPassword'
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
                        <div className='mb-3 position-relative'>
                            <label htmlFor='confirmSignupPassword'></label>
                            <input
                                id='confirmSignupPassword'
                                className={`${styles.passwordInput} position-relative`}
                                onChange={(e) => {
                                    handleConfirmPassword(e.target.value),
                                        toggleConfirmPasswordVisibility;
                                }}
                                type={showConfirmPassword ? 'text' : 'password'}
                                name='signupConfirmPassword'
                                placeholder='confirm password'
                                required
                            ></input>
                            <span
                                className={`${styles.passwordVisibility}`}
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
                                    <FaEye size={25} />
                                ) : (
                                    <FaEyeSlash size={25} />

                                )}
                            </span>
                        </div>
                        <button
                            className={`${styles.loginBtn} 
                ${isLoading ? styles.disabledLoginBtn : ''
                                } w-100`}
                            onClick={handleRegistration}
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
                                'Create Account'
                            )}
                        </button>
                        <p className={`${styles.noAccountText} text-center`}>
                            Already have an account?{' '}
                            <a href='/login' className={`${styles.signupAnchor}`}>
                                {' '}
                                Login
                            </a>
                        </p>
                    </Col>
                </Col>
            </Row>
        </Container>
    );

}
export default Register;