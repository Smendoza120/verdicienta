export interface CategoryItem {
  id: string;
  name: string;
}

export interface StoreHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onOpenCart: () => void;
}