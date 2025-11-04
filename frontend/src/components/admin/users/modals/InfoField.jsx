const InfoField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <div className="text-gray-900 text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
            {value}
        </div>
    </div>
);

export default InfoField;
