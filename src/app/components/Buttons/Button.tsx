interface props {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, className, onClick, disabled }: props) => {
  return (
    <button disabled={disabled} onClick={onClick} className={`${className} px-5 py-3 rounded-lg font-medium`}>
      {children}
    </button>)
}

export default Button



