import { useState } from "react";
import { Link } from "react-router-dom";

const PrivacyDetails = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="ml-1">
      <Link
        to="#"
        onClick={toggleDetails}
        className="text-blue-600 hover:text-blue-500 underline font-medium"
      >
        Privacy Policy
      </Link>
      <div
        id={id}
        className={`mt-2 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100 transition-all duration-300 ease-in-out ${
          isOpen ? "block opacity-100 max-h-96" : "hidden opacity-0 max-h-0"
        }`}
        data-aos="slide-down"
        data-aos-duration="400"
      >
        <p className="font-semibold">FAST-C Privacy Policy</p>
        <p className="mt-1">I hereby allow FAST-C to use my personal information including contact details, name, email, and other provided data for:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
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