import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useApi from "../hooks/useApi";
import { useForm } from "react-hook-form";

interface LoginData {
    email: string;
    password: string;
}

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
    const navigate = useNavigate();
    const { postApi } = useApi();
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { setEmployee, setAttendanceReports, setIsReportExists } = authContext;

    const onSubmit = async (data: LoginData) => {
        try {
            const response = await postApi("api/Auth/login", data);
            const { token, employee, attendanceReports, isReportExists } = response;

            localStorage.setItem("token", token);
            setEmployee(employee);
            setAttendanceReports(attendanceReports);
            setIsReportExists(isReportExists);

            if (response.token) {
                navigate("/dashboard")
            };

        } catch (error) {
            alert("Invalid login credentials.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <div className="mb-4">
                <input {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    {...register("password", { required: "Password is required", minLength: 6 })}
                    placeholder="Password"
                    className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">Sign In</button>
        </form>
    );
}
export default LoginForm;