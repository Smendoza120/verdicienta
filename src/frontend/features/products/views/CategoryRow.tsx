'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import LocalMallIcon from '@mui/icons-material/LocalMall'; // Bolsos
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Aretes / Bisutería
import BookIcon from '@mui/icons-material/Book'; // Estuches para libros

// Mapeo dinámico de iconos de MUI basado en los productos de Verdicienta
const icons: Record<string, React.ElementType> = {
  all: AutoAwesomeIcon,
  bolsos: LocalMallIcon,
  aretes: AutoAwesomeIcon,
  estuches: BookIcon,
};

// Simulamos la lista de categorías del negocio (Bolsos, Aretes, Estuches)
const categories = [
  { id: 'bolsos', name: 'Bolsos' },
  { id: 'aretes', name: 'Aretes' },
  { id: 'estuches', name: 'Estuches para Libros' },
];

type CategoryRowProps = {
  active: string;
  onChange: (id: string) => void;
};

export function CategoryRow({ active, onChange }: CategoryRowProps) {
  return (
    <Box component="section" sx={{ mx: 'auto', maxWidth: 'lg', px: { xs: 2, sm: 3 }, pt: 4 }}>
      <Typography variant="subtitle1" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Explora por sección
      </Typography>
      
      {/* Contenedor con Scroll Horizontal nativo oculto */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1.5, 
          overflowX: 'auto', 
          pb: 1,
          '&::-webkit-scrollbar': { display: 'none' }, 
          scrollbarWidth: 'none',                      
        }}
      >        
        <CategoryButton
          id="all"
          name="Todos"
          icon={AutoAwesomeIcon}
          isActive={active === 'all'}
          onClick={onChange}
        />
        
        {/* Chips dinámicos */}
        {categories.map((c) => {
          const IconComponent = icons[c.id] || AutoAwesomeIcon;
          return (
            <CategoryButton
              key={c.id}
              id={c.id}
              name={c.name}
              icon={IconComponent}
              isActive={active === c.id}
              onClick={onChange}
            />
          );
        })}
      </Box>
    </Box>
  );
}

// Subcomponente atómico para los chips de botones
function CategoryButton({ 
  id, name, icon: Icon, isActive, onClick 
}: { 
  id: string; name: string; icon: React.ElementType; isActive: boolean; onClick: (id: string) => void;
}) {
  return (
    <Button
      variant={isActive ? "contained" : "outlined"}
      color={isActive ? "primary" : "inherit"}
      onClick={() => onClick(id)}
      startIcon={<Icon style={{ fontSize: 16 }} />}
      sx={{
        borderRadius: 6,
        textTransform: 'none',
        fontWeight: 600,
        px: 2.5,
        py: 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        borderColor: isActive ? 'transparent' : 'divider',
        bgcolor: isActive ? 'primary.main' : 'background.paper',
        '&:hover': {
          transform: 'scale(1.02)',
          bgcolor: isActive ? 'primary.dark' : 'action.hover',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {name}
    </Button>
  );
}