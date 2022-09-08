import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import AuthCard from "../../components/common/AuthCard";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { loginSaveUser } = useAuth();
  const navigate = useNavigate();
  // HOOK: State init
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Destructuring data state nested object properties
  const { email, password } = user;

  // FORM FUNCTIONS
  const handleTextChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // API Call to Write User Data
    try {
      const response = await axios.post(
        '/api/auth/login',
        user
      );
      // ADJUST LATER WITH CONTEXT API
      loginSaveUser(response.data);
      navigate('/dashboard')

    } catch(err) {
      console.log(err.response);
      toast.error(err.response.data);
    } 
  }

  return (
    <AuthCard title='Login'>
      <Form onSubmit={ handleSubmit }>
        {/* EMAIL */}
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type='email' 
            placeholder='Email' 
            name="email"
            value={email}
            onChange={ handleTextChange }
          />
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type='password' 
            placeholder='Password' 
            name="password"
            value={password}
            onChange={ handleTextChange }
          />
        </Form.Group>
        
        <Button 
          variant='primary' 
          type='submit'
          disabled={loading}
          className={loading && "button-gradient-loading"}
        >
          {loading ? '...' : 'Submit'}
        </Button>
      </Form>
    </AuthCard>
  );
};

export default Login;