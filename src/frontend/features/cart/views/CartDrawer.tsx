"use client";

import Image from "next/image";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Button,
} from "@mui/material";
import { ShoppingBag, X, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CartDrawerProps } from "../types/cart.types";
import { buildWhatsAppUrl } from "@/src/frontend/shared/utils/whatsapp";

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, count, updateQuantity, removeFromCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    const whatsappUrl = buildWhatsAppUrl(items, total);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      // Optimización de Next: evita parpadeos en renderizado del lado del cliente
      ModalProps={{ keepMounted: true }}
    >
      <Box
        sx={{
          width: { xs: "100vw", sm: 400 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header del Carrito */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* SOLUCIÓN 1: Trasladamos display, alignItems y gap dentro del sx */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingBag className="w-5 h-5" style={{ color: "#1976d2" }} />
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Tu carrito {count > 0 && `(${count})`}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </Box>

        {/* Cuerpo / Listado de Productos */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {items.length === 0 ? (
            /* SOLUCIÓN 2: Trasladamos los atributos de diseño al objeto sx */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "70%",
                gap: 2,
                textAlign: "center",
                px: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: "action.hover",
                  p: 2,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </Box>
              {/* SOLUCIÓN 3: Trasladamos fontWeight dentro del sx de la tipografía */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Tu carrito está vacío
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Añade productos para empezar tu próximo proyecto creativo en
                Verdicienta.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {items.map((item) => (
                <ListItem
                  key={item.product.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 1.5,
                    mb: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 64,
                      height: 64,
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: "action.hover",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={item.product.images?.[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      priority={false}
                      className="object-cover"
                    />
                  </Box>
                  {/* SOLUCIÓN 4: Mover maquetación flex de este contenedor al sx */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", maxWidth: 180 }}
                        noWrap
                      >
                        {item.product.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Eliminar producto"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ my: 0.5, fontWeight: "bold" }}
                    >
                      ${item.product.price.toLocaleString("es-CO")}
                    </Typography>
                    {/* Controles de Cantidad */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 5,
                        width: "fit-content",
                        p: 0.2,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{
                          width: 24,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer del Carrito */}
        {items.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ${total.toLocaleString('es-CO')} COP
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large" 
              onClick={handleCheckout}
              sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold' }}
            >
              Completar pedido por WhatsApp
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
