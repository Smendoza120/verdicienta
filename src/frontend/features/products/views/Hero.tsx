'use client';

import Image from 'next/image';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  colorBg: string;
  colorFg: string;
  accentBg: string;
  image: string;
};

const slides: Slide[] = [
  {
    eyebrow: 'Hecho a mano',
    title: 'Crea algo único con tus propias manos',
    text: 'Lanas, pinturas y herramientas seleccionadas para que cada proyecto sea especial.',
    cta: 'Ver catálogo',
    colorBg: '#1565c0', // Azul primario Verdicienta
    colorFg: '#ffffff',
    accentBg: 'rgba(255, 255, 255, 0.2)',
    image: '/products/hero-1.png',
  },
  {
    eyebrow: 'Nueva colección',
    title: 'Colores vibrantes para tus pinturas',
    text: 'Acrílicos y acuarelas de alta pigmentación que dan vida a tus ideas.',
    cta: 'Descubrir pinturas',
    colorBg: '#2e7d32', // Verde secundario
    colorFg: '#ffffff',
    accentBg: 'rgba(255, 255, 255, 0.2)',
    image: '/products/hero-2.png',
  },
];

export function Hero({ onCta }: { onCta: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const slide = slides[index];

  return (
    <Box component="section" sx={{ mx: 'auto', maxWidth: 'lg', px: { xs: 2, sm: 3 }, pt: 3 }}>
      <Box 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: 2, 
          bgcolor: slide.colorBg, 
          color: slide.colorFg,
          transition: 'background-color 0.5s ease',
        }}
      >
        <Box 
          sx={{ 
            display: 'grid', 
            alignItems: 'center', 
            gap: 3, 
            p: { xs: 4, md: 7 }, 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } 
          }}
        >
          {/* Textos del Slide */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, zIndex: 10 }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1, 
                borderRadius: 5, 
                px: 2, 
                py: 0.5, 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                bgcolor: slide.accentBg 
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {slide.eyebrow}
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              {slide.title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400, fontSize: '0.9rem' }}>
              {slide.text}
            </Typography>
            <Button 
              variant="contained" 
              onClick={onCta}
              sx={{ 
                mt: 1, 
                borderRadius: 5, 
                bgcolor: '#ffffff', 
                color: '#121212', 
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
            >
              {slide.cta}
            </Button>
          </Box>

          {/* Imagen optimizada con AspectRatio */}
          <Box sx={{ position: 'relative', width: '100%', height: { xs: 220, sm: 300, md: 350 }, overflow: 'hidden', borderRadius: 4 }}>
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </Box>
        </Box>

        {/* Controles de Navegación del Carrusel */}
        <Box sx={{ absolute: 'absolute', position: 'absolute', bottom: 16, left: { xs: 32, md: 56 }, zIndex: 10, display: 'flex', gap: 1 }}>
          {slides.map((_, i) => (
            <Box
              component="button"
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir al slide ${i + 1}`}
              sx={{
                height: 8,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                p: 0,
                transition: 'all 0.3s ease',
                width: i === index ? 24 : 8,
                bgcolor: i === index ? '#ffffff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </Box>

        <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10, display: 'flex', gap: 1 }}>
          <IconButton onClick={() => go(-1)} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}>
            <ChevronLeft className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={() => go(1)} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}>
            <ChevronRight className="w-5 h-5" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}