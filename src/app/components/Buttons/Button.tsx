interface props {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({ children, className, onClick, disabled, type }: props) => {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${className} px-5 py-3 rounded-lg font-medium`}>
      {children}
    </button>)
}

export default Button



