import './IconButton.css';

interface IconButtonProps {
  variant?: 'primary' | 'assistive' | 'outlined' | 'subtle';
  size?: 's' | 'l';
  shape?: 'horizontal' | 'vertical';

  children: React.ReactNode;

  onClick?: () => void;
  className?: string;
}

const IconButton = ({ variant = 'primary', size = 'l', shape = 'horizontal', children, onClick, className = '' }: IconButtonProps) => {
  return (
    <button className={`icon-button ${variant} ${shape} ${size} ${className}`} onClick={onClick}>
      <span className="button-icon">{children}</span>
    </button>
  );
};

export default IconButton;
