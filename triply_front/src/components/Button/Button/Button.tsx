import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'assistive' | 'outlined' | 'subtle';
  size?: 's' | 'm' | 'l';

  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;

  children: React.ReactNode;

  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ variant = 'primary', size = 'm', leadingIcon, trailingIcon, children, onClick, disabled = false }: ButtonProps) => {
  return (
    <button className={`button ${variant} ${size}`} onClick={onClick} disabled={disabled}>
      {leadingIcon && <span className="button-icon">{leadingIcon}</span>}

      <span>{children}</span>

      {trailingIcon && <span className="button-icon">{trailingIcon}</span>}
    </button>
  );
};

export default Button;
