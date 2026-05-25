import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useHybridProducts();

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (productId: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Search products</DialogTitle>
          <DialogDescription>Search for your favorite car fragrances</DialogDescription>
        </VisuallyHidden>
        <div className="flex items-center border-b px-4">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            id="search-input"
            name="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto">
          {query.trim() && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No products found.</p>
          )}
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-md object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <p className="text-xs text-primary">{formatCurrency(product.price, product.currencyCode)}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
