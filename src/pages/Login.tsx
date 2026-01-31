import { useState, type SyntheticEvent} from "react";
import { supabase } from "../libs/supabase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

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

    dispatch(setUser(data.user));
    navigate("/blogs"); 
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Email: </label>
      <input
        aria-label="" 
        value={email}
        onChange={e => setEmail(e.target.value)} 
        required/>

      <label>Password: </label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      {error && <p>{error}</p>}
      <button>Login</button>
    </form>
  );
}
