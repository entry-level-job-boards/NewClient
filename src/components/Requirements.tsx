import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
    show: boolean;
    password: string;
    tooltipRef: React.RefObject<HTMLDivElement>;
}

const hasUppercase = (password: string) => /[A-Z]/.test(password);
const hasNumber = (password: string) => /\d/.test(password);
const hasSpecialChar = (password: string) => /[^A-Za-z0-9]/.test(password);
const isProperLength = (password: string) => password.length >= 6 && password.length <= 32;

export const PasswordRequirements = ({ show, password, tooltipRef }: Props) => {
    if (!show) return null;

    const Requirement = ({
        valid,
        text,
    }: {
        valid: boolean;
        text: string;
    }) => (
        <li className="flex items-center text-sm">
            {valid ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={valid ? 'text-gray-700' : 'text-gray-500'}>{text}</span>
        </li>
    );

    return (
        <div ref={tooltipRef} className="absolute top-0 left-full ml-4 z-20 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Password must include:</h4>
            <ul className="space-y-1">
                <Requirement valid={hasUppercase(password)} text="At least one uppercase letter" />
                <Requirement valid={hasSpecialChar(password)} text="At least one special character" />
                <Requirement valid={hasNumber(password)} text="At least one number" />
                <Requirement valid={isProperLength(password)} text="6 to 32 characters in length" />
            </ul>
        </div>
    );
};