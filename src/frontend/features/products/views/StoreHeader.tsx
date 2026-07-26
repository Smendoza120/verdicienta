"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  InputBase,
  Drawer,
  Badge,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { LogIn, LogOut, Menu, Scissors, Search, ShoppingBag } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";

const categories = [
  { id: "lanas", name: "Lanas y Hilados" },
  { id: "pinturas", name: "Pinturas y Pinceles" },
];

type StoreHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onOpenCart: () => void;
};

export function StoreHeader({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  onOpenCart,
}: StoreHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // Assuming you have a useAuth hook to get user info and auth status
  const count = 0; // Mock temporal del contador

  const SearchField = (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 14,
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
          color: "text.secondary",
        }}
      >
        <Search className="w-4 h-4" />
      </Box>
      <InputBase
        placeholder="Buscar lanas, pinturas, herramientas..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        inputProps={{ "aria-label": "Buscar productos" }}
        sx={{
          width: "100%",
          bgcolor: "action.hover",
          borderRadius: 5,
          pl: 5,
          pr: 2,
          py: 0.5,
          height: 40,
          fontSize: "0.875rem",
          border: "1px solid transparent",
          "&:focus-within": {
            borderColor: "primary.main",
            bgcolor: "background.paper",
          },
        }}
      />
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: 40,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          maxWidth: "lg",
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Menú Mobile Hamburgesa */}
        <IconButton
          color="inherit"
          aria-label="Abrir menú"
          onClick={() => setMobileMenuOpen(true)}
          sx={{ display: { md: "none" } }}
        >
          <Menu className="w-5 h-5" />
        </IconButton>

        {/* Logo de la Marca */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "text.primary",
          }}
        >
          <Box
            sx={{
              display: "grid",
              width: 36,
              height: 36,
              placeItems: "center",
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Scissors className="w-5 h-5" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              tracking: -0.5,
              display: { xs: "none", sm: "block" },
            }}
          >
            Verdicienta
          </Typography>
        </Box>

        {/* Buscador Escritorio */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "block" },
            mx: { md: 2, lg: 4 },
          }}
        >
          {SearchField}
        </Box>

        {/* Acciones del Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isAuthenticated ? (
            <>
              {user?.role === "Administrador" && (
                <Button
                  component={Link}
                  href="/admin"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 5,
                    textTransform: "none",
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  Panel Admin
                </Button>
              )}

              <Button
                variant="text"
                size="small"
                color="inherit"
                onClick={() => logout()}
                startIcon={<LogOut className="w-4 h-4" />}
                sx={{
                  borderRadius: 5,
                  textTransform: "none",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              href="/login"
              variant="contained"
              size="small"
              startIcon={<LogIn className="w-4 h-4" />}
              sx={{
                borderRadius: 5,
                textTransform: "none",
                fontWeight: "bold",
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              Iniciar Sesión
            </Button>
          )}

          <IconButton
            onClick={onOpenCart}
            aria-label="Abrir carrito"
            color="inherit"
          >
            <Badge badgeContent={count} color="primary">
              <ShoppingBag className="w-5 h-5" />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Buscador en Pantalla Móvil */}
      <Box sx={{ px: 2, pb: 1.5, display: { xs: "block", md: "none" } }}>
        {SearchField}
      </Box>

      {/* Menú Lateral Desplegable (Mobile Navigation) */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }} role="presentation">
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, pl: 1 }}
          >
            <Box
              sx={{
                display: "grid",
                width: 32,
                height: 32,
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <Scissors className="w-4 h-4" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Verdicienta
            </Typography>
          </Box>

          <List component="nav" disablePadding>
            <ListItemButton
              selected={activeCategory === "all"}
              onClick={() => {
                onCategoryChange("all");
                setMobileMenuOpen(false);
              }}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    Todos los productos
                  </Typography>
                }
              />
            </ListItemButton>

            {categories.map((c) => (
              <ListItemButton
                key={c.id}
                selected={activeCategory === c.id}
                onClick={() => {
                  onCategoryChange(c.id);
                  setMobileMenuOpen(false);
                }}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      {c.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
