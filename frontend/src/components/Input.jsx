// TEMPORARY 
const Input = ({ label, ...props }) => {
    return (
        <div className="flex flex-col">
            <label className="ml-2">
                {label}
            </label>

            <input className="border px-2" {...props}/>
        </div>
    );

};

export default Input;