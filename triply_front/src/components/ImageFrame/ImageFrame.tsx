import React, { CSSProperties } from 'react';
import './ImageFrame.css';

interface ImageFrameProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 's' | 'm' | 'l';
  style?: CSSProperties;
  className?: string;
}

const ImageFrame = ({ src, alt = '이미지', size = 's', style, className = '' }: ImageFrameProps) => {
  const isDefault = !src;

  return (
    <div className={`image-frame image-frame-${size} ${isDefault ? 'is-default' : ''} ${className}`} style={style}>
      {!isDefault && <img src={src} alt={alt} className="frame-img" />}
    </div>
  );
};

export default ImageFrame;
