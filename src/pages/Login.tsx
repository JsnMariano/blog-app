import { useState, type SyntheticEvent} from "react";
import { supabase } from "../libs/supabase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      return;
    }

    if(data.user){
      dispatch(setUser(data.user));
      navigate("/blogs"); 
    }
  }

  return (
    <div className="container" style={{ maxWidth: "360px", marginTop: "4rem" }}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.currentTarget.value)} 
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
          required
        />

        {error && <p>{error}</p>}
        <button className="primary-btn">Login</button>
        <p style={{textAlign: "center"}}>or <Link to="/register" style={{color:"blue"}}>Click here to Register</Link></p>
      </form>
    </div>
  );
}
