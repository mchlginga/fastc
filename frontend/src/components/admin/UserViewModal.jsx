import React from "react";
import {
    X,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Briefcase,
    User,
} from "react-feather";

const UserViewModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50"
            onClick={onClose}
        >
            <div
                className="relative top-20 mx-auto p-5 border border-gray-200 w-full max-w-2xl shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            User Profile Details
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="mt-2 px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center">
                                <User
                                    className="mr-3 text-gray-500"
                                    size={20}
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Name
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {user.firstName} {user.surname}{" "}
                                        {user.role === "company" &&
                                            `(${user.companyName})`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail
                                    className="mr-3 text-gray-500"
                                    size={20}
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Email
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            {user.contactNumber && (
                                <div className="flex items-center">
                                    <Phone
                                        className="mr-3 text-gray-500"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Contact
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.contactNumber}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {user.address && (
                                <div className="flex items-center">
                                    <MapPin
                                        className="mr-3 text-gray-500"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Address
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {user.birthdate && (
                                <div className="flex items-center">
                                    <Calendar
                                        className="mr-3 text-gray-500"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Birthdate
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {new Date(
                                                user.birthdate
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Briefcase
                                    className="mr-3 text-gray-500"
                                    size={20}
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Role
                                    </p>
                                    <p className="text-sm text-gray-900 capitalize">
                                        {user.role}
                                    </p>
                                </div>
                            </div>
                            {user.position && (
                                <div className="flex items-center">
                                    <Award
                                        className="mr-3 text-gray-500"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Position
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.position}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {user.industryType && (
                                <div className="flex items-center">
                                    <Briefcase
                                        className="mr-3 text-gray-500"
                                        size={20}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Industry
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.industryType}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user.education && user.education.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-2">
                                    Education
                                </h4>
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {user.education.map((edu, idx) => (
                                        <li
                                            key={idx}
                                            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {edu.level} - {edu.school}
                                                </p>
                                                <p className="text-gray-500">
                                                    {edu.year}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {user.certificates && user.certificates.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-2">
                                    Certificates
                                </h4>
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {user.certificates.map((cert, idx) => (
                                        <li
                                            key={idx}
                                            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {cert.name} by {cert.issuer}
                                                </p>
                                                <p className="text-gray-500">
                                                    {new Date(
                                                        cert.date
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {user.representative && (
                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-2">
                                    Representative
                                </h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Name
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.representative.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Position
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.representative.position}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Contact
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {user.representative.contactNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserViewModal;
