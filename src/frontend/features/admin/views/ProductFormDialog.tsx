"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import { ImagePlus, X } from "lucide-react";

// Importación de tus tipos y catálogo de la tienda
import { categories } from "../../products/lib/products";

export type ProductDraft = {
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  images: string[];
};

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    stock: number;
    images: string[];
  } | null;
  onSave: (draft: ProductDraft, id?: string) => void;
};

const empty: ProductDraft = {
  name: "",
  price: 0,
  category: "tejidos",
  description: "",
  stock: 0,
  images: [],
};

export function ProductFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: ProductFormDialogProps) {
  const [draft, setDraft] = useState<ProductDraft>(() => {
    if (initial) {
      return {
        name: initial.name,
        price: initial.price,
        category: initial.category,
        description: initial.description || "",
        stock: initial.stock,
        images: [...initial.images],
      };
    }
    return empty;
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setDraft((d) => ({ ...d, images: [...d.images, ...urls] }));
  };

  const removeImage = (idx: number) =>
    setDraft((d) => ({ ...d, images: d.images.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft, initial?.id);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      fullWidth
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
      slotProps={{
        paper: {
          sx: { borderRadius: 2, px: 1 },
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Encabezado del Modal */}
        <Box sx={{ p: 3, pb: 1 }}>
          <DialogTitle
            id="form-dialog-title"
            sx={{ p: 0, fontWeight: "bold", fontSize: "1.25rem" }}
          >
            {initial ? "Editar producto" : "Agregar producto"}
          </DialogTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Completa la información del producto para tu catálogo artesanal.
          </Typography>
        </Box>

        {/* Formulario con Scroll Interno Controlado */}
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            maxHeight: "65vh", // Corregido: maxHeigh -> maxHeight
            border: "none", // Corregido: borderSide -> border
          }}
        >
          {/* Input: Nombre */}
          <TextField
            label="Nombre del Producto"
            required
            fullWidth
            variant="outlined"
            placeholder="Ej. Bolso tejido en trapillo"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />

          {/* Fila: Precio y Unidades */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Precio ($)"
              type="number"
              required
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: "1" } }}
              value={draft.price || ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  price: parseFloat(e.target.value) || 0,
                }))
              }
            />

            <TextField
              label="Stock"
              type="number"
              required
              fullWidth
              slotProps={{ htmlInput: { min: 0 } }}
              value={draft.stock || ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  stock: parseInt(e.target.value, 10) || 0,
                }))
              }
            />
          </Box>

          {/* Select: Categorías */}
          <TextField
            select
            label="Categoría"
            fullWidth
            value={draft.category}
            onChange={(e) =>
              setDraft((d) => ({ ...d, category: e.target.value }))
            }
          >
            {categories.map((c: { id: string; name: string }) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Textarea: Descripción */}
          <TextField
            label="Descripción"
            multiline
            rows={3}
            fullWidth
            placeholder="Describe el producto, materiales, dimensiones, alma o historia de la pieza..."
            value={draft.description}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
          />

          {/* Sección Dinámica: Carga y Gestión de Imágenes */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1, fontWeight: 600 }}
            >
              Imágenes del Producto
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {draft.images.map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Imagen ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(i)}
                    aria-label="Quitar imagen"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": {
                        bgcolor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    <X className="w-3 h-3" />
                  </IconButton>
                </Box>
              ))}

              {/* Botón Disparador de Archivos */}
              <Box
                component="button"
                type="button"
                onClick={() => fileRef.current?.click()}
                sx={{
                  display: "grid",
                  width: 80,
                  height: 80,
                  placeItems: "center",
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: "divider",
                  bgcolor: "transparent",
                  color: "text.secondary",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
                aria-label="Cargar imágenes"
              >
                <ImagePlus className="w-5 h-5" />
              </Box>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
            </Box>
          </Box>
        </DialogContent>

        {/* Acciones del Formulario */}
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => onOpenChange(false)}
            sx={{ textTransform: "none", borderRadius: 5, px: 3 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 5,
              px: 3,
              fontWeight: 600,
            }}
          >
            {initial ? "Guardar cambios" : "Agregar producto"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
