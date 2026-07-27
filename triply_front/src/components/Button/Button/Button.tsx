import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'assistive' | 'outlined' | 'subtle';
  size?: 's' | 'm' | 'l';

  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;

  children: React.ReactNode;

  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const Button = ({ variant = 'primary', size = 'm', leadingIcon, trailingIcon, children, onClick, style, className = '' }: ButtonProps) => {
  return (
    <button className={`button ${variant} ${size} ${className}`} onClick={onClick} style={style}>
      {leadingIcon && <span className="button-icon">{leadingIcon}</span>}

      <span>{children}</span>

      {trailingIcon && <span className="button-icon">{trailingIcon}</span>}
    </button>
  );
};

export default Button;
