import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function AuthPage() {

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authMessage, setAuthMessage] = useState(null);
  const authContext = useContext(AuthContext);

  async function handleAuth(){

    if(!email.trim() || !password.trim()) return;

    const requestBodySignup = { 
      query: `
        mutation ($email: String!, $password: String!) {
          createUser(userInput: {email: $email, password: $password}) {
            _id
            email
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    const requestBodyLogin = {
      query: `
        query ($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {

        email: email,
        password: password
      }
    };

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: isLoginMode ? JSON.stringify(requestBodyLogin) : JSON.stringify(requestBodySignup),
      });

      const result = await res.json();

      if (isLoginMode && result.data?.login?.token) {
        authContext.login(result.data.login.token, result.data.login.userId, result.data.login.tokenExpiration);
        setAuthError(null);
        setAuthMessage(null);
      } 
      else if (!isLoginMode && result.data?.createUser?._id) {
        setIsLoginMode(true);
        setAuthError(null);
        setAuthMessage("Account created successfully! You can now log in.");
      }
      else if (result.errors && result.errors.length > 0) {
        setAuthError(result.errors[0].message);
        setAuthMessage(null);
      }

    } 
    catch (err) {
      setAuthError("Something went wrong. Please try again.");
      console.log(err);
    }
  }

  return (
  <>
    <div className="message-container">
      {authError && <p className="error-message">{authError}</p>}
      {authMessage && <p className="success-message">{authMessage}</p>}
    </div>
    <div className="auth-form">
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-submit" onClick={() => handleAuth()}>{isLoginMode?'Login':'Create Account'}</button>
      </div>
      <div className="form-switch">
        <p>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</p>
        <button type="button" className="btn-switch" onClick={() => setIsLoginMode(prev => !prev)}>
          {isLoginMode ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </div>
  </>
  )
}

export default AuthPage;