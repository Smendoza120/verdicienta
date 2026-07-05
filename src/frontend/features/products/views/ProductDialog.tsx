'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { type Product } from '../types/types';

type ProductDialogProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDialog({ product, open, onOpenChange }: ProductDialogProps) {
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const images = product.images || ['/placeholder.svg'];
  const outOfStock = product.stock === 0;
  const go = (dir: number) => setActive((i) => (i + dir + images.length) % images.length);

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, maxHeight: '88vh' }}>
          
          {/* Panel Izquierdo: Carrusel de Fotos */}
          <Box sx={{ bgcolor: 'action.hover', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Image
                src={images[active]}
                alt={`${product.name} - ${active + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <IconButton onClick={() => go(-1)} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}>
                    <ChevronLeft className="w-5 h-5" />
                  </IconButton>
                  <IconButton onClick={() => go(1)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}>
                    <ChevronRight className="w-5 h-5" />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Miniaturas */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {images.map((img, i) => (
                <Box
                  component="button"
                  key={i}
                  onClick={() => setActive(i)}
                  sx={{
                    position: 'relative', width: 56, height: 56, borderRadius: 2, overflow: 'hidden', p: 0, cursor: 'pointer',
                    border: '2px solid', borderColor: i === active ? 'primary.main' : 'transparent',
                  }}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Panel Derecho: Detalles Técnicos del Negocio */}
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Chip label={product.category} size="small" color="secondary" sx={{ mb: 1, fontWeight: 'bold' }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                {product.name}
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mt: 1 }}>
                ${product.price.toLocaleString('es-CO')} COP
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              {product.description || 'Producto artesanal elaborado con materiales de alta calidad en el taller de Verdicienta.'}
            </Typography>

            {/* Disponibilidad de Inventario */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: outOfStock ? 'error.main' : 'success.main' }} />
              <Typography variant="caption" sx={{ color: outOfStock ? 'error.main' : 'text.secondary', fontWeight: 500 }}>
                {outOfStock ? 'Sin stock disponible' : `${product.stock} unidades disponibles`}
              </Typography>
            </Box>

            {/* Controles del Formulario de Compra */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
              {!outOfStock && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Cantidad</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 5, p: 0.3 }}>
                    <IconButton size="small" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></IconButton>
                    <Typography sx={{ width: 32, textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{qty}</Typography>
                    <IconButton size="small" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><Plus className="w-4 h-4" /></IconButton>
                  </Box>
                </Box>
              )}
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={outOfStock}
                startIcon={<ShoppingBag className="w-4 h-4" />}
                sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold' }}
              >
                {outOfStock ? 'Agotado' : 'Añadir al carrito'}
              </Button>
            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}