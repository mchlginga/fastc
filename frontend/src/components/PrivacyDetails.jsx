import { useState } from "react";
import { Link } from "react-router-dom";

const PrivacyDetails = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="ml-7">
      <Link
        to="#"
        onClick={toggleDetails}
        className="text-blue-600 hover:text-blue-500 underline"
      >
        Privacy Policy
      </Link>
      <div
        id={id}
        className={`mt-2 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100 ${isOpen ? "block" : "hidden"}`}
      >
        <p>I hereby allow FAST-C to use my personal information including contact details, name, email, and other provided data for:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Employment facilitation and job matching</li>
          <li>Certificate verification and validation</li>
          <li>Communication regarding training and opportunities</li>
          <li>Other related purposes as outlined in our full Privacy Policy</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyDetails;