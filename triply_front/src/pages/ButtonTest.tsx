import Button from '../components/Button/Button/Button';
import { Plus } from 'lucide-react';

const ButtonTest = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '40px',
        padding: '24px',
      }}
    >
      {/* 텍스트 버튼 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
        }}
      >
        <h3>Text</h3>

        <Button variant="primary" size="s">
          Primary S
        </Button>
        <Button variant="primary" size="m">
          Primary M
        </Button>
        <Button variant="primary" size="l">
          Primary L
        </Button>

        <Button variant="assistive" size="m">
          Assistive
        </Button>

        <Button variant="outlined" size="m">
          Outlined
        </Button>

        <Button variant="subtle" size="m">
          Subtle
        </Button>
      </div>

      {/* 아이콘 버튼 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
        }}
      >
        <h3>Icon + Text</h3>

        <Button variant="primary" size="s" leadingIcon={<Plus size={16} />}>
          Primary S
        </Button>

        <Button variant="primary" size="m" leadingIcon={<Plus size={18} />}>
          Primary M
        </Button>

        <Button variant="primary" size="l" leadingIcon={<Plus size={20} />}>
          Primary L
        </Button>

        <Button variant="assistive" size="m" leadingIcon={<Plus size={18} />}>
          Assistive
        </Button>

        <Button variant="outlined" size="m" leadingIcon={<Plus size={18} />}>
          Outlined
        </Button>

        <Button variant="subtle" size="m" leadingIcon={<Plus size={18} />}>
          Subtle
        </Button>
      </div>
    </div>
  );
};

export default ButtonTest;
