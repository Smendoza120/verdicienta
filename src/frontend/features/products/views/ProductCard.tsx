'use client';

import Image from 'next/image';
import { Card, Box, Typography, IconButton, Chip } from '@mui/material';
import { Plus } from 'lucide-react';
import { useCart } from '../../cart/context/CartContext';
import { ProductCardProps } from '../types/product';


export function ProductCard({ product, onOpen }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    addToCart(product, 1);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 1, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 0,
        '&:hover': { boxShadow: 3 },
        transition: 'box-shadow 0.3s ease',
        height: '100%'
      }}
    >
      {/* Contenedor de Imagen de la Tarjeta */}
      <Box 
        component="button"
        onClick={() => onOpen(product)}
        aria-label={`Ver detalle de ${product.name}`}
        sx={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '1/1', 
          bgcolor: 'action.hover',
          border: 'none',
          p: 0,
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        <Image
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
        />
        <Chip 
          label={product.category} 
          size="small"
          sx={{ position: 'absolute', left: 10, top: 10, bgcolor: 'background.paper', fontWeight: 600 }}
        />
        {outOfStock && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.6)' }}>
            <Typography variant="button" sx={{ fontWeight: 'bold', color: 'error.main' }}>Agotado</Typography>
          </Box>
        )}
      </Box>

      {/* Contenido de Textos */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
        <Box 
          component="button" 
          onClick={() => onOpen(product)}
          sx={{ textLeft: 'left', textAlign: 'left', border: 'none', bgcolor: 'transparent', p: 0, cursor: 'pointer', flexGrow: 1 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3, '&:hover': { color: 'primary.main' } }}>
            {product.name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
            ${product.price.toLocaleString('es-CO')}
          </Typography>
          <IconButton 
            disabled={outOfStock}
            color="primary"
            onClick={handleAddToCart}
            sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' }, p: 1 }}
            aria-label="Añadir al carrito"
          >
            <Plus className="w-4 h-4" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}