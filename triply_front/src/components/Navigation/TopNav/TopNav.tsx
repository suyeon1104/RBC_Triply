import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import IconButton from '../../Button/IconButton/IconButton';
import './TopNav.css';

interface TopNavProps {
  title: string;
  showRightButton?: boolean;
  onRightButtonClick?: () => void;
  rightButtonIcon?: React.ReactNode;
}

const TopNav = ({ title, showRightButton = false, onRightButtonClick, rightButtonIcon }: TopNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="TopNav">
      <IconButton variant="subtle" size="l" shape="horizontal" onClick={() => navigate(-1)}>
        <ChevronLeft color="var(--gray-950)" />
      </IconButton>

      <h2 className="TopNav-title">{title}</h2>

      {showRightButton && (
        <IconButton variant="assistive" size="l" shape="horizontal" onClick={onRightButtonClick}>
          {rightButtonIcon}
        </IconButton>
      )}
    </div>
  );
};

export default TopNav;
