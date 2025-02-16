import { useForm } from "react-hook-form";
import useApi from "../hooks/useApi";
import { useEffect, useState } from "react";

interface SignUpData {
    firstName: string;
    lastName: string;
    role: string;
    managerId?: number;
    email: string;
    password: string;
}

const SignUpForm = () => {
    const { getApi, postApi } = useApi();
    const [managers, setManagers] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
    const { register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SignUpData>({
        defaultValues: { managerId: 0 },
        mode: "onChange"
    });
    const [signUpStatus, setSignUpStatus] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchManagers = async () => {
            const data = await getApi("api/employees/managers");
            if (data) setManagers(data);
        };
        fetchManagers();
    }, []);

    const onSubmit = async (data: SignUpData) => {
        try {
            const response = await postApi("api/auth/register", data);
            if (response?.message) {
                setSignUpStatus('Registration Complete')
            } else {
                setSignUpStatus('Registration Failed, please try again.')

            }
        } catch (error) {
            setSignUpStatus(`Registration Failed, error: ${error}`);
        }
    };

    return (
        signUpStatus === undefined ? <>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow-lg rounded-md">
                <h2 className="text-xl font-semibold mb-4">Signup</h2>

                {/* First Name */}
                <div className="mb-4">
                    <label className="block text-gray-700">First Name</label>
                    <input {...register("firstName", { required: "First Name is required", maxLength: 50 })}
                        placeholder="First Name"
                        className={`border p-2 w-full rounded-md focus:ring-2 ${errors.firstName ? "border-red-500" : "border-gray-300"
                            }`} />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label className="block text-gray-700">Last Name</label>
                    <input {...register("lastName", { required: "Last Name is required", maxLength: 50 })}
                        placeholder="Last Name"
                        className={`border p-2 w-full rounded-md focus:ring-2 ${errors.lastName ? "border-red-500" : "border-gray-300"}`} />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>

                {/* Role Selection */}
                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select {...register("role", { required: "Role is required" })}
                        className={`border p-2 w-full rounded-md focus:ring-2 ${errors.role ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Role</option>
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                    </select>
                    {errors.role && <p className="text-red-500">{errors.role.message}</p>}
                </div>

                {/* Manager Selection (Default 0) */}
                <div>
                    <label className="block text-gray-700">Manager</label>
                    <select {...register("managerId")}
                        className="border p-2 w-full rounded-md focus:ring-2 border-gray-300">
                        <option value="0">No Manager</option>
                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                                {manager.firstName} {manager.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Enter a valid email",
                        }
                    })}
                        placeholder="Email"
                        className={`border p-2 w-full rounded-md focus:ring-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                            validate: {
                                hasUpperCase: (value) => /[A-Z]/.test(value) || "Must contain at least one uppercase letter.",
                                hasLowerCase: (value) => /[a-z]/.test(value) || "Must contain at least one lowercase letter.",
                                hasNumber: (value) => /[0-9]/.test(value) || "Must contain at least one number.",
                                hasSpecialChar: (value) => /[^A-Za-z0-9]/.test(value) || "Must contain at least one special character.",
                            },
                        })}
                        placeholder="Password"
                        className={`border p-2 w-full rounded-md focus:ring-2 ${errors.password ? "border-red-500" : "border-gray-300"
                            }`} />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={Object.keys(errors).length > 0}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </> : <div>{signUpStatus}</div>
    );
}

export default SignUpForm;