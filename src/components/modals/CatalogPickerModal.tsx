import { useState } from 'react';
import { X, Search, Leaf, Carrot, Flower2, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CATALOG, type CatalogItem } from '@/store/plantStore';

interface CatalogPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: CatalogItem) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Все', icon: null },
  { id: 'cannabis', label: 'Каннабис', icon: Leaf, color: 'text-green-400' },
  { id: 'vegetables', label: 'Овощи', icon: Carrot, color: 'text-orange-400' },
  { id: 'herbs', label: 'Травы', icon: Sparkles, color: 'text-emerald-400' },
  { id: 'flowers', label: 'Цветы', icon: Flower2, color: 'text-pink-400' },
];

export function CatalogPickerModal({
  open,
  onOpenChange,
  onSelect,
}: CatalogPickerModalProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'cannabis' && item.category.startsWith('cannabis'));
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (item: CatalogItem) => {
    onSelect(item);
    onOpenChange(false);
    setSearch('');
    setActiveCategory('all');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-popover border-border max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <DialogTitle className="text-lg font-semibold">
            Выберите растение из каталога
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="pl-10 form-input"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? '' : cat.color}`} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog items */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Ничего не найдено
            </div>
          )}
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="catalog-card w-full text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="pill pill-primary text-xs">Каннабис</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-primary">
                    <span>💧 каждые {item.wateringDays}д</span>
                    <span>☀️ {item.lightHours}ч свет</span>
                    <span>📅 ~{item.growthDays}д</span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Manual entry button */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ввести вручную →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
