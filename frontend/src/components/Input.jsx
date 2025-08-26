// TEMPORARY 
const Input = ({ label, ...props }) => {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <input className="p-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none" {...props}/>
        </div>
    );

};

export default Input;