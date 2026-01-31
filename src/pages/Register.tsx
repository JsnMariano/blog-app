import { useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Registration successful. You may now log in.");
    navigate("/login");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {message && <p>{message}</p>}
      <button type="submit">Register</button>
    </form>
  );
}
