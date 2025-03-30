import { useEffect } from "react";

export const LogoutSuccess = () => {
    useEffect(() => {
        // Clear local storage or any other logout operations
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData'); // Clear user data if needed

        // Optionally redirect to home or login page after a timeout
        setTimeout(() => {
            window.location.href = "/"; // Redirect to home page
        }, 3000); // Redirect after 3 seconds
    }, []);

    return (
        <div className="container mx-auto text-center p-6">
            <h1 className="text-2xl font-semibold">You have successfully logged out.</h1>
            <p className="mt-4">Redirecting to home page...</p>
        </div>
    );
}