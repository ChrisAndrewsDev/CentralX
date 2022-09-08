import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import AuthCard from '../../components/common/AuthCard';


const Signup = () => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Destructuring data state nested
  const { username, email, password} = user;

  // useRef Hook
  const passwordConfirmRef = useRef();

  // Form function
  const handleTextChange = (e) => {
      setUser({
        ...user,
        [e.target.name]: e.target.value
      })
  }

  const handleSubmit = async (e) => {
      
        e.preventDefault();
        setLoading(true);
        // early validation of password confirm
        if(password !== passwordConfirmRef.current.value){
          toast.error("Passwords do not match!");
          setLoading(false);
          return;
        }
        // API call to write user data
      try {
        const response = await axios.post('/api/auth/register', user)
        console.log(response.data)
        // adjust layer with context
      } catch (error) {
        console.log(error.response)
        toast.error(error.response.data)
      }
  }

  return (
    <AuthCard title="Sign up to CentralX">
    <div className='container'>
      {/* Username */}
      <Form onSubmit={handleSubmit} >
      <Form.Group className='mb-3'>
        <Form.Label>Enter your username</Form.Label>
        <Form.Control type="text" placeholder="Enter username.." name="username" value={username} onChange={handleTextChange}/>
      </Form.Group>
      {/* Email */}
      <Form.Group className='mb-3'>
        <Form.Label>Enter your email</Form.Label>
        <Form.Control type="email" placeholder="Enter email.." name='email' value={email} onChange={handleTextChange} />
        </Form.Group>
        {/* Initial Password */}
        <Form.Group className='mb-3'>
        <Form.Label>Enter your password</Form.Label>
        <Form.Control type="password" placeholder="Enter password.." name='password'  value={password} onChange={handleTextChange}/>
        </Form.Group>
        {/* Confirm Password */}
        <Form.Group className='mb-3'>
        <Form.Label>Confirm your password</Form.Label>
        <Form.Control type="password" placeholder="Confirm password.." className='mb-2' ref={passwordConfirmRef}/>
        <Form.Text className="text-muted">
          Already have an account? <Link to={'#'}>Sign in</Link>
        </Form.Text>
        </Form.Group>
        <Button variant="info" type='submit' disabled={loading} className={loading && "button-gradient-loading"}>{loading ? '...' : 'Submit'}</Button>
        </Form>
    </div>
    </AuthCard>
  )
}

export default Signup


// Form text 
// <Form.Text className="text-muted">
//           Forgot your username? <a href="#">Click here</a>
//         </Form.Text>