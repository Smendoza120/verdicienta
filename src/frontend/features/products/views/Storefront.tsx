"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Container, Grid, CircularProgress } from "@mui/material";
import { Scissors } from "lucide-react";
import { type Product } from "../types/types";

// Importación de componentes locales unificados
import { StoreHeader } from "./StoreHeader";
import { Hero } from "./Hero";
import { CategoryRow } from "./CategoryRow";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { CartDrawer } from "../../cart/views/CartDrawer";

// ─── MEJORA 1: IMPORTACIÓN DE NUESTROS DATOS SEED QUEMADOS Y HELPERS ───────────────────
// Traemos el listado con los 8 productos base y el helper para traducir los IDs de las categorías
import { categoryName } from "../lib/products";
import { productService } from "../services/product.service";

export function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Carga productos activos únicamente desde la BD
  useEffect(() => {
    productService
      .getAllProducts(true)
      .then(setProducts)
      .catch((err) => console.error("Error al cargar productos:", err))
      .finally(() => setLoading(false));
  }, []);

  // Lógica de filtrado en memoria
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    // ─── CAMBIO: Operamos sobre el estado 'products' cargado mediante API
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  const openProduct = (product: Product) => {
    setSelected(product);
    setDialogOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <StoreHeader
        query={query}
        onQueryChange={setQuery}
        activeCategory={category}
        onCategoryChange={setCategory}
        onOpenCart={() => setCartOpen(true)}
      />

      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        <Hero
          onCta={() =>
            document
              .getElementById("catalogo")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />
        <CategoryRow active={category} onChange={setCategory} />

        {/* Sección de Catálogo */}
        <Container
          id="catalogo"
          maxWidth="lg"
          sx={{ scrollMarginTop: 96, pt: 5, px: { xs: 2, sm: 3 } }}
        >
          <Box sx={{ mb: 3 }}>
            {/* ─── MEJORA 3: TÍTULO DINÁMICO DE CATEGORÍA CON FORMATO ESTÉTICO ─────────── */}
            {/* Reemplazamos el texto estático "Sección Seleccionada" utilizando 'categoryName(category)' */}
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
              {category === "all"
                ? "Catálogo completo"
                : `Sección: ${categoryName(category)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto disponible"
                : "productos disponibles"}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
              <CircularProgress size={36} />
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Box
              sx={{
                mt: 5,
                borderRadius: 4,
                border: "1px dashed",
                borderColor: "divider",
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                No encontramos productos
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Prueba con otra búsqueda o categoría de manualidades.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {filteredProducts.map((product) => (
                <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <ProductCard product={product} onOpen={openProduct} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Pie de Página */}
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "action.hover",
          py: 4,
          mt: "auto",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
            }}
          >
            <Box
              sx={{
                display: "grid",
                width: 28,
                height: 28,
                placeItems: "center",
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <Scissors className="w-4 h-4" />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Verdicienta
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Tu tienda de manualidades hecha con cariño.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            © {new Date().getFullYear()} Verdicienta. Todos los derechos
            reservados.
          </Typography>
        </Container>
      </Box>

      {/* Modales y Drawers Globales de Estado */}
      <ProductDialog
        key={selected?.id || "empty-dialog"}
        product={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
}
