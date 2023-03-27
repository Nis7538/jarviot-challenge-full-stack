import "./App.css";
import baseAPI from "./api/baseAPI";
import { getCookie } from "./helpers/cookies";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
    const signInWithGoogle = async () => {
        const result = await baseAPI.get("/");
        window.open(`${result.data.data}`, "_self", "noreferrer");
    };

    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    if (mounted) {
        const tokenCookie = getCookie("token");
        if (tokenCookie) {
            navigate("/dashboard");
        }
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="App">
            <div className="container">
                <h1>Google Drive Risk Report</h1>
                <div className="logo">
                    <img src="https://img.icons8.com/3d-fluency/94/null/google-logo.png" alt="Google logo" />
                </div>
                <h1>Sign in with Google</h1>
                <button className="google-signin-button" onClick={signInWithGoogle}>
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/google-logo--v1.png" alt="Google logo" />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};

export default App;
