// TEMPORARY
const Button = ({ children, full, ...props }) => {
    return(
        <button className="border bg-blue-200 my-3 px-1 hover:bg-blue-500 cursor-pointer" {...props}>
            {children}
        </button>
    );
};

export default Button;