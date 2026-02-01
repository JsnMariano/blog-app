import { useState, type SyntheticEvent } from "react";
import { supabase } from "../libs/supabase";
import { Link, useNavigate } from "react-router-dom";

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
    <form className="container" style={{ maxWidth: "360px", marginTop: "4rem" }} onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.currentTarget.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} required />
      {message && <p>{message}</p>}
      <button className="primary-btn" type="submit">Register</button>
      <p style={{textAlign: "center"}}>or <Link to="/login" style={{color:"blue"}}>Click here to Login</Link></p>
    </form>
  );
}
