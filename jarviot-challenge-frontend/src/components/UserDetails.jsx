import { useNavigate } from "react-router-dom";
import baseAPI from "@/api/baseAPI.jsx";
import { eraseCookie } from "@/helpers/cookies.js";

const UserDetails = (props) => {
    const navigate = useNavigate();
    const revokeAccess = async () => {
        const result = await baseAPI.delete("/revokeAccess");
        if (result.data.success) {
            eraseCookie("token");
            navigate("/");
        }
    };

    return (
        <div className="user-details">
            <img src={props.imageUrl} alt="Profile Image" />
            <div className="revoke">
                <h2>{props.name}</h2>
                <button onClick={revokeAccess}>Revoke Access</button>
            </div>
        </div>
    );
};

export default UserDetails;