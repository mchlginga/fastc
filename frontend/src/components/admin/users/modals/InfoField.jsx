const InfoField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="text-gray-900">{value}</div>
    </div>
);

export default InfoField;
