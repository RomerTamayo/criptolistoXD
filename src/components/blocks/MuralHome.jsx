import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import './blocks.css';

const MuralHome = ({ images }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollY(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cálculo de opacidad y escala según scroll
  const maxScroll = 600; // píxeles máximos a considerar
  const opacity = Math.max(1 - 2*scrollY / maxScroll, 0);
  const scale = Math.max(1 - scrollY / (2 * maxScroll), 0.85); // escala mínima 85%

  const style = {
    transform: `scale(${scale})`,
    opacity: opacity
  };

  if (!images || images.length === 0) return null;

  return (
    <>
    <div className="mural-container mb-4 fixed-top z-0" style={style}>
      <Carousel fade controls={false} indicators={true} interval={3000} pause={false}>
        {images.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block mural-img"
              src={img.url}
              alt={`Imagen ${idx + 1}`}
            />
            {img.caption && (
              <Carousel.Caption className="mural-caption">
                <h5>{img.caption}</h5>
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
    <div className="mural-space"></div>
    </>
    
  );
};

export default MuralHome;

