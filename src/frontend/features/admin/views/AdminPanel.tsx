"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeft,
  Boxes,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { ProductDraft, type Product } from "../../products/types/types";
import { ProductFormDialog } from "./ProductFormDialog";
import { categoryName } from "../../products/lib/products";
import { productService } from "../../products/services/product.service";
import NextImage from "next/image";

const orders = [
  {
    id: "#1042",
    customer: "Lucía Fernández",
    items: 3,
    total: 41.39,
    status: "Enviado",
  },
  {
    id: "#1041",
    customer: "Marco Díaz",
    items: 1,
    total: 19.99,
    status: "Pendiente",
  },
  {
    id: "#1040",
    customer: "Ana Torres",
    items: 5,
    total: 78.5,
    status: "Entregado",
  },
  {
    id: "#1039",
    customer: "Pablo Ruiz",
    items: 2,
    total: 23.4,
    status: "Pendiente",
  },
];

const drawerWidth = 260;

export function AdminPanel() {
  const [view, setView] = useState<View>("productos");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { logout, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "Administrador")) {
      router.replace("/");
    }
  }, [isAuthenticated, user, isLoading, router]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(false);
      setItems(data);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Error al cargar inventario";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await productService.getAllProducts(false);
        if (isMounted) {
          setItems(data);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const msg =
            error instanceof Error
              ? error.message
              : "Error al cargar inventario";
          toast.error(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false; // Evita fugas de memoria si el componente se desmonta antes de terminar la petición
    };
  }, []);

  const totalStock = useMemo(
    () => items.reduce((sum, p) => sum + p.stock, 0),
    [items],
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const remove = async (product: Product) => {
    try {
      await productService.disableProduct(product.id);
      toast.success(`"${product.name}" deshabilitado correctamente`);
      await fetchProducts(); // Recarga la lista desde la BD
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al eliminar";
      toast.error(msg);
    }
  };

  const save = async (draft: ProductDraft, id?: string) => {
    try {
      if (id) {
        await productService.updateProduct(id, draft);
        toast.success("Producto actualizado");
      } else {
        await productService.createProduct(draft);
        toast.success("Producto agregado exitosamente");
      }
      setFormOpen(false);
      await fetchProducts(); // Recarga la lista actualizada desde la BD
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al guardar";
      toast.error(msg);
    }
  };

  const SidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.paper",
      }}
    >
      {/* Brand Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          height: 64,
          px: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 40,
            height: 40,
            placeItems: "center",
            borderRadius: 0,
          }}
        >
          {/* <Scissors className="w-4 h-4" /> */}
          <NextImage
            src="/Verdicienta-logo.png"
            alt="Logo Verdicienta Admin"
            fill
            sizes="32px"
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", letterSpacing: -0.5 }}
        >
          Verdicienta Admin
        </Typography>
      </Box>

      {/* Navigation Buttons */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <NavButton
          icon={Package}
          label="Productos"
          active={view === "productos"}
          onClick={() => setView("productos")}
        />
        <NavButton
          icon={ShoppingCart}
          label="Órdenes"
          active={view === "ordenes"}
          onClick={() => setView("ordenes")}
        />
      </Box>

      {/* Footer Return Action */}
      <Box
        sx={{
          mt: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Info usuario opcional */}
        {user && (
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontWeight: 500 }}
            >
              Administrador
            </Typography>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
              {user.name || user.email}
            </Typography>
          </Box>
        )}

        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 1.5,
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Box>

        <Box
          component="button"
          onClick={handleLogout}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 2,
            border: "none",
            bgcolor: "transparent",
            cursor: "pointer",
            color: "error.main",
            "&:hover": { bgcolor: "action.hover" },
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Box>
      </Box>
    </Box>
  );

  if (isLoading || !isAuthenticated) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "rgba(0,0,0,0.02)" }}
    >
      {/* Sidebar para Escritorio (Desktop) */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {SidebarContent}
        </Drawer>
      </Box>

      {/* Layout de Contenido Principal */}
      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Topbar Móvil / Acciones */}
        <AppBar
          position="sticky"
          color="default"
          sx={{
            boxShadow: "none",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Toolbar
            sx={{
              px: { xs: 2, sm: 3 },
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 1, display: { md: "none" } }}
              >
                <Menu className="w-5 h-5" />
              </IconButton>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", textTransform: "capitalize" }}
              >
                {view}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Ver tienda
              </Button>

              <Button
                variant="text"
                color="error"
                size="small"
                onClick={handleLogout}
                startIcon={<LogOut className="w-4 h-4" />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Vistas Dinámicas */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
          {view === "productos" ? (
            loading ? (
              <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
                <CircularProgress size={36} />
              </Box>
            ) : (
              <ProductsView
                items={items}
                totalStock={totalStock}
                onCreate={openCreate}
                onEdit={openEdit}
                onRemove={remove}
              />
            )
          ) : (
            <OrdersView />
          )}
        </Box>
      </Box>

      {/* Drawer desplegable para Móviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {SidebarContent}
      </Drawer>

      {/* Formulario de producto */}
      <ProductFormDialog
        key={editing?.id || "new-product-form"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSave={save}
      />
    </Box>
  );
}

/* ==========================================================================
    COMPONENTES AUXILIARES INTERNOS REUTILIZABLES (MUI)
   ========================================================================== */

type View = "productos" | "ordenes";

function NavButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      variant={active ? "contained" : "text"}
      color={active ? "primary" : "inherit"}
      startIcon={<Icon className="w-4 h-4" />}
      sx={{
        justifyContent: "flex-start",
        px: 2,
        py: 1.2,
        borderRadius: 2,
        textTransform: "none",
        fontSize: "0.875rem",
        fontWeight: active ? 600 : 500,
        color: active ? "primary.contrastText" : "text.secondary",
        bgcolor: active ? "primary.main" : "transparent",
        "&:hover": { bgcolor: active ? "primary.dark" : "action.hover" },
      }}
    >
      {label}
    </Button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  colorIntent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  colorIntent: "primary" | "secondary" | "error";
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 4,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "grid",
          width: 44,
          height: 44,
          placeItems: "center",
          borderRadius: 2.5,
          bgcolor: `${colorIntent}.light`,
          color: `${colorIntent}.main`,
          opacity: 0.95,
        }}
      >
        <Icon className="w-5 h-5" />
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

function ProductsView({
  items,
  totalStock,
  onCreate,
  onEdit,
  onRemove,
}: {
  items: Product[];
  totalStock: number;
  onCreate: () => void;
  onEdit: (p: Product) => void;
  onRemove: (p: Product) => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={Package}
            label="Productos"
            value={String(items.length)}
            colorIntent="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={Boxes}
            label="Unidades en Stock"
            value={String(totalStock)}
            colorIntent="secondary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={ShoppingCart}
            label="Agotados"
            value={String(items.filter((p) => p.stock === 0).length)}
            colorIntent="error"
          />
        </Grid>
      </Grid>

      {/* Contenedor de la Tabla de Productos */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden", borderColor: "divider" }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Inventario de Manualidades
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={onCreate}
            sx={{ borderRadius: 5, textTransform: "none", fontWeight: 600 }}
          >
            Agregar producto
          </Button>
        </Box>
        <TableContainer>
          <Table aria-label="tabla de productos">
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Producto
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Categoría
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Precio
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Stock
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((p) => (
                <TableRow
                  key={p.id}
                  hover
                  sx={{ opacity: p.isActive === false ? 0.5 : 1 }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "action.hover",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Image
                          src={p.images[0] || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {p.name}
                        </Typography>
                        {p.isActive === false && (
                          <Chip
                            label="Deshabilitado"
                            size="small"
                            color="default"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <Chip
                      label={categoryName(p.category)}
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(p.price)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {p.stock === 0 ? (
                      <Chip
                        label="Agotado"
                        size="small"
                        sx={{
                          bgcolor: "error.light",
                          color: "error.contrastText",
                          fontWeight: "bold",
                        }}
                      />
                    ) : (
                      `${p.stock} uds`
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onEdit(p)}
                        aria-label={`Editar ${p.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemove(p)}
                        aria-label={`Eliminar ${p.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

function OrdersView() {
  const statusColor: Record<string, "secondary" | "warning" | "success"> = {
    Enviado: "secondary",
    Pendiente: "warning",
    Entregado: "success",
  };

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 4, overflow: "hidden", borderColor: "divider" }}
    >
      <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Órdenes recientes
        </Typography>
      </Box>
      <TableContainer>
        <Table aria-label="tabla de ordenes">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Pedido
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Cliente
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Artículos
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Total
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  Estado
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{o.id}</TableCell>
                <TableCell>
                  <Typography variant="body2">{o.customer}</Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {o.items}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {/* ─── MEJORA 5: FORMATEO ECONÓMICO EN LA VISTA DE ÓRDENES ───────────── */}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(o.total * 4200)}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={o.status}
                    color={statusColor[o.status]}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
