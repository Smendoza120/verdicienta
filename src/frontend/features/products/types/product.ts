export type ProductDraft = {
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  images: string[];
};

export type ProductFormDialogProps = {
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
