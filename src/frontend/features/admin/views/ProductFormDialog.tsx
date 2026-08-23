"use client";

import React, { useEffect, useRef, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { ImagePlus, X } from "lucide-react";
import { categories } from "../../products/lib/products";
import {
  ProductDraft,
  ProductFormDialogProps,
} from "../../products/types/product";

interface LocalImagePreview {
  file?: File;
  previewUrl: string;
  isExistingUrl: boolean;
}

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
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [prevInitial, setPrevInitial] = useState(initial);
  const [prevOpen, setPrevOpen] = useState(open);

  const [draft, setDraft] = useState<ProductDraft>(() =>
    initial
      ? {
          name: initial.name,
          price: initial.price,
          category: initial.category,
          description: initial.description || "",
          stock: initial.stock,
          images: [...initial.images],
        }
      : empty,
  );

  const [imagesList, setImagesList] = useState<LocalImagePreview[]>(() =>
    initial
      ? initial.images.map((url) => ({
          previewUrl: url,
          isExistingUrl: true,
        }))
      : [],
  );

  if (open !== prevOpen || initial !== prevInitial) {
    setPrevOpen(open);
    setPrevInitial(initial);

    if (open) {
      if (initial) {
        setDraft({
          name: initial.name,
          price: initial.price,
          category: initial.category,
          description: initial.description || "",
          stock: initial.stock,
          images: [...initial.images],
        });
        setImagesList(
          initial.images.map((url) => ({
            previewUrl: url,
            isExistingUrl: true,
          })),
        );
      } else {
        setDraft(empty);
        setImagesList([]);
      }
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPreviews: LocalImagePreview[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isExistingUrl: false,
    }));

    setImagesList((prev) => [...prev, ...newPreviews]);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImagesList((prev) => {
      const itemToRemove = prev[index];
      if (!itemToRemove.isExistingUrl && itemToRemove.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClose = () => {
    if (!uploading) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const finalImageUrls: string[] = [];

      for (const item of imagesList) {
        if (item.isExistingUrl) {
          finalImageUrls.push(item.previewUrl);
        } else if (item.file) {
          const base64Image = await fileToBase64(item.file);

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await response.json();

          if (response.ok && data.url) {
            finalImageUrls.push(data.url);
          } else {
            throw new Error(data.error || "Error al subir la imagen");
          }
        }
      }

      const updatedDraft: ProductDraft = {
        ...draft,
        images: finalImageUrls,
      };

      await onSave(updatedDraft, initial?.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error durante el guardado:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            maxHeight: "65vh",
            border: "none",
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
              {imagesList.map((item, i) => (
                <Box
                  key={`${item.previewUrl}-${i}`}
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
                    src={item.previewUrl || "/placeholder.svg"}
                    alt={`Imagen ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <IconButton
                    size="small"
                    disabled={uploading}
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
                disabled={uploading}
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
                  cursor: uploading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: uploading ? "divider" : "primary.main",
                    color: uploading ? "text.secondary" : "primary.main",
                    bgcolor: uploading ? "transparent" : "action.hover",
                  },
                }}
                aria-label="Cargar imágenes"
              >
                {uploading ? (
                  <CircularProgress size={24} />
                ) : (
                  <ImagePlus className="w-5 h-5" />
                )}
              </Box>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => onFilesSelected(e.target.files)}
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
            disabled={uploading}
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
