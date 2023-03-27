import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setCookie } from "@/helpers/cookies";

const CallBack = () => {
    const [searchParam, setSearchParam] = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    if (mounted) {
        const token = searchParam.get("token");
        if (token) {
            setCookie("token", token, 30);
            navigate("/dashboard");
        }
        navigate("/");
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    return <div>Getting Token</div>;
};

export default CallBack;
