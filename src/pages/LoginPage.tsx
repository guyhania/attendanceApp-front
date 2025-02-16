import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import Modal from "../components/Modal";

export default function LoginPage() {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">

            <LoginForm />

            <p className="mt-4">
                Don't have an account?{" "}
                <button onClick={() => setShowSignUp(true)} className="text-blue-500 underline">
                    Sign Up
                </button>
            </p>
            <br></br>

            <Modal isOpen={showSignUp} onClose={() => setShowSignUp(false)}>
                <SignUpForm />
            </Modal>
        </div>
    );
}


