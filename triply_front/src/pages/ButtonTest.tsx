import Button from '../components/Button/Button/Button';
import IconButton from '../components/Button/IconButton/IconButton';
import { Plus, ChevronLeft } from 'lucide-react';

const ButtonTest = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '48px',
        padding: '24px',
      }}
    >
      {/* Button (아이콘 포함) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3>Button + Icon</h3>

        <Button variant="primary" size="s" leadingIcon={<Plus />} trailingIcon={<ChevronLeft />}>
          Primary S
        </Button>

        <Button variant="primary" leadingIcon={<Plus />} trailingIcon={<ChevronLeft />}>
          Primary M
        </Button>

        <Button variant="primary" size="l" leadingIcon={<Plus />} trailingIcon={<ChevronLeft />}>
          Primary L
        </Button>

        <Button variant="assistive" leadingIcon={<Plus />} trailingIcon={<ChevronLeft />}>
          Assistive
        </Button>

        <Button variant="outlined" leadingIcon={<Plus />} trailingIcon={<ChevronLeft />}>
          Outlined
        </Button>

        <Button variant="subtle" leadingIcon={<Plus />} trailingIcon={<ChevronLeft />}>
          Subtle
        </Button>
      </div>

      {/* IconButton - Horizontal */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3>IconButton (Horizontal)</h3>

        <IconButton variant="primary" size="s" shape="horizontal">
          <Plus />
        </IconButton>

        <IconButton variant="primary" size="l" shape="horizontal">
          <Plus />
        </IconButton>

        <IconButton variant="assistive" shape="horizontal">
          <ChevronLeft />
        </IconButton>

        <IconButton variant="outlined" shape="horizontal">
          <ChevronLeft />
        </IconButton>

        <IconButton variant="subtle" shape="horizontal">
          <ChevronLeft />
        </IconButton>
      </div>

      {/* IconButton - Vertical */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3>IconButton (Vertical)</h3>

        <IconButton variant="primary" size="s" shape="vertical">
          <Plus />
        </IconButton>

        <IconButton variant="primary" size="l" shape="vertical">
          <Plus />
        </IconButton>

        <IconButton variant="assistive" shape="vertical">
          <ChevronLeft />
        </IconButton>

        <IconButton variant="outlined" shape="vertical">
          <ChevronLeft />
        </IconButton>

        <IconButton variant="subtle" shape="vertical">
          <ChevronLeft />
        </IconButton>
      </div>
    </div>
  );
};

export default ButtonTest;
