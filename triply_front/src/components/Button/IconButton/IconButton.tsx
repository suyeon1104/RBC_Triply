import './IconButton.css';

interface IconButtonProps {
  variant?: 'primary' | 'assistive' | 'outlined' | 'subtle';
  size?: 's' | 'l';
  shape?: 'horizontal' | 'vertical';

  children: React.ReactNode;

  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const IconButton = ({ variant = 'primary', size = 'l', shape = 'horizontal', children, onClick, style, className = '' }: IconButtonProps) => {
  return (
    <button className={`icon-button ${variant} ${shape} ${size} ${className}`} onClick={onClick} style={style}>
      <span className="button-icon">{children}</span>
    </button>
  );
};

export default IconButton;
