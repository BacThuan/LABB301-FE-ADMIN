import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api, apiClient } from "../../api/api";
import useInput from "../../hooks/use-input";
import banner1 from "../../assets/banner/banner1.jpg";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [messErr, setMessErr] = useState("");
  const {
    value: email,
    isValid: validEmail,
    errorMess: errEmail,
    hasError: errorEmail,
    handleChange: handleChangeEmail,
    inputBlur: blurEmail,
    reset: resetEmail,
  } = useInput("email");

  const {
    value: password,
    isValid: validPass,
    errorMess: errPass,
    hasError: errorPass,
    handleChange: handleChangePass,
    inputBlur: blurPass,
    reset: resetPass,
  } = useInput("password");

  useEffect(() => {
    document.title = "Admin Login";
  }, []);
  // valid form
  let formValid = false;

  if (validEmail && validPass) formValid = true;
  else formValid = false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const information = { email: email, password: password };
    try {
      const res = await axios.post(api + "/login?admin=true", information);
      const data = res.data;
      dispatch({
        type: "LOGIN",
        token: data.token,
        name: data.name,
        email: data.email,
        role: data.role.roleName,
      });

      navigate("/home");
    } catch (err) {
      console.log(err);
      setMessErr(err.response.data.message);
    }
  };

  return (
    <div>
      <img className="login_banner" src={banner1}></img>
      <form className="login" onSubmit={handleSubmit}>
        <div className="loginContainer">
          <div className="loginControl">
            <input
              type="text"
              id="email"
              onChange={handleChangeEmail}
              placeholder="Email"
              onBlur={blurEmail}
              value={email}
            />
            {errorEmail && <p className="loginError">{errEmail}</p>}
          </div>
          <div className="loginControl">
            <input
              type="password"
              id="password"
              onChange={handleChangePass}
              placeholder="Password"
              onBlur={blurPass}
              value={password}
            />
            {errorPass && <p className="loginError">{errPass}</p>}
          </div>
          {messErr && <p className="loginError">{messErr}</p>}
          <button type="submit" disabled={!formValid} className="loginButton">
            Login
          </button>

          <a href={apiClient} className="loginButton">
            Return to client page
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
