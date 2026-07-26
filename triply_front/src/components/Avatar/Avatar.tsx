import React, { useMemo } from 'react';
import ImageFrame from '../ImageFrame/ImageFrame';
import './Avatar.css';

interface AvatarProps {
  size?: 'xs' | 's' | 'm' | 'l';
  src?: string;
  userId?: string | number;
  onClick?: () => void;
  className?: string;
}

const AVATAR_COLORS = {
  darkGray: '#2C2C2C',
  purple: '#4F27B3',
  red: '#E1251B',
  orange: '#FFA000',
  pink: '#FFA3C5',
  green: '#009A10',
  lightGray: '#D6D6D6',
  blue: '#4E8CFF',
  teal: '#00B8A9',
  yellow: '#FFD166',
  deepNavy: '#1D2D50',
  coral: '#FF6B6B',
  lime: '#84D225',
  violet: '#8B5CF6',
  cyan: '#00C4FF',
} as const;

const COLOR_NAMES = Object.keys(AVATAR_COLORS) as (keyof typeof AVATAR_COLORS)[];

const getMappedColor = (id?: string | number): string => {
  const targetId = id !== undefined && id !== null && id !== '' ? String(id) : String(Math.random());

  let hash = 0;
  for (let i = 0; i < targetId.length; i++) {
    hash = targetId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % COLOR_NAMES.length;
  return AVATAR_COLORS[COLOR_NAMES[index]];
};

export default function Avatar({ size = 's', src, userId, onClick, className = '' }: AvatarProps) {
  const backgroundColor = useMemo(() => getMappedColor(userId), [userId]);

  const avatarSrc = src || '/assets/avatar.svg';

  return (
    <div className={`Avatar ${className}`} onClick={onClick}>
      <ImageFrame
        size={size}
        src={avatarSrc}
        style={{ backgroundColor }} // 배경색을 ImageFrame 자체에 적용
        className={`Avatar-frame ${!src ? 'Avatar-frame--default' : ''}`}
      />
    </div>
  );
}
