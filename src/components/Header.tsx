import { supabase } from "../libs/supabase";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
        setEmail(session?.user?.email ?? null);
        }
    );

    return () => listener.subscription.unsubscribe();
    }, []);

    async function logout() {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate("/login");
    }

    const onAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
    <header className="header">
        <div className="header-inner">
        <Link to="/blogs" className="logo">Jsn's Blog App</Link>

        {email ? (
            <div className="header-user">
                <span className="meta">{email}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
        ):(
            !onAuthPage && (
                <div className="header-user">
                    <Link to="/login" style={{background:"red"}} className="primary-btn small-btn">Login</Link>
                    <Link to="/register" className="primary-btn small-btn">Signup</Link>
                </div>                
            )
        )}
        </div>
    </header>
    );
}
