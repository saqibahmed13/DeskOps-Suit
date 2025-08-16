import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
// import BackgroundImage from "../../assets/dashboard_bg.png";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage,setErrorMessage] =useState("")
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = () => {
  //   let errorMessage = "";
  
  //   if (inputUsername !== "M566486" && inputUsername !== "mdsaqib@viatris.com") {
  //     errorMessage = "Incorrect username";
  //   }
  
  //   if (inputPassword !== "Admin@13") {
  //     errorMessage = errorMessage ? "Incorrect username and password" : "Incorrect password";
  //   }

  //   if(inputUsername == "" && inputPassword== "" ){
  //     errorMessage = "Please enter username and password"
  //   }
  
  //   if (errorMessage) {
  //     setErrorMessage(errorMessage);
  //     setShow(true);
  //   } else {
  //     navigate('/dashboard');
  //   }
  // };
  
  const handleLogin = () => {
    
    if(inputPassword === '' && inputUsername === ''){
      setErrorMessage("Please enter username and password")
    }
    else if (inputUsername !== "M566486" && inputUsername !== "mdsaqib@viatris.com") {
      if (inputPassword !== "Admin@13") {
        setErrorMessage("Incorrect username and password");
      } else {
        setErrorMessage("Incorrect username");
      }
    } else if (inputPassword !== "Admin@13") {
      setErrorMessage("Incorrect password");
    }
     else {
      setErrorMessage(""); // Clear error if login is successful
      navigate("/home");
      return; // Prevent further state updates
    }
 
  
    setShow(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    delay(500);
    console.log(`Username: ${inputUsername}, Password: ${inputPassword}`);
    handleLogin();
    setLoading(false);
  };



  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div
      className="sign-in__wrapper"
      // style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <img className="mx-auto d-block mb-2" src={Logo} alt="logo" />
        <div className="h4 mb-2 text-center">Login</div>
        {/* Alert */}
        {show && errorMessage && (
        <Alert
          className="mb-2"
          variant="danger"
          onClose={() => setShow(false)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username: </Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        {/* <Form.Group className="input-btns" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group> */}

        {/* Button container to center the button */}
        <div className="btn-container">
         
            <Button className="input-btn" variant="primary" type="submit" onClick={handleLogin} >
              Log In
            </Button>
       
            
           {/* <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password?
          </Button>
        </div> */}
        </div>
      </Form>
    </div>
  );
};

export default Login;
