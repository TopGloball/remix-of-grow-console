import { useState } from 'react';
import { X, BookOpen, Pencil, Leaf, Sparkles, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CatalogPickerModal } from './CatalogPickerModal';
import { usePlantStore, type CatalogItem } from '@/store/plantStore';
import { useToast } from '@/hooks/use-toast';

interface AddPlantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = 'catalog' | 'manual';

export function AddPlantModal({ open, onOpenChange }: AddPlantModalProps) {
  const { toast } = useToast();
  const { addPlant } = usePlantStore();
  const [tab, setTab] = useState<TabType>('catalog');
  const [catalogPickerOpen, setCatalogPickerOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [cultivar, setCultivar] = useState('');
  const [type, setType] = useState<'indoor' | 'outdoor' | 'greenhouse'>('indoor');
  const [stage, setStage] = useState<'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'curing'>('seedling');
  const [expectedHarvest, setExpectedHarvest] = useState('');
  const [notes, setNotes] = useState('');

  const handleCatalogSelect = (item: CatalogItem) => {
    setSelectedCatalog(item);
    setName(item.name);
    setCultivar(item.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название растения',
        variant: 'destructive',
      });
      return;
    }

    addPlant({
      name: name.trim(),
      cultivar: cultivar || name.trim(),
      category: selectedCatalog?.category || 'cannabis-photo',
      type,
      stage,
      expectedHarvest: expectedHarvest || null,
      notes,
      recommendation: 'Наблюдайте за ростом первые дни',
    });

    toast({
      title: 'Растение добавлено',
      description: `${name} успешно добавлено в список`,
    });

    // Reset form
    onOpenChange(false);
    setSelectedCatalog(null);
    setName('');
    setCultivar('');
    setType('indoor');
    setStage('seedling');
    setExpectedHarvest('');
    setNotes('');
  };

  const isValid = name.trim().length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm bg-popover border-border max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-0">
            <DialogTitle className="text-lg font-semibold">
              Добавить растение
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          {/* Tabs */}
          <div className="px-4 pt-3">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
              <button
                onClick={() => setTab('catalog')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  tab === 'catalog'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Из каталога
              </button>
              <button
                onClick={() => setTab('manual')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  tab === 'manual'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Pencil className="w-4 h-4" />
                Вручную
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Catalog selection (only in catalog mode) */}
            {tab === 'catalog' && (
              <div>
                {selectedCatalog ? (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {selectedCatalog.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedCatalog.description}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCatalogPickerOpen(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Изменить
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span>Программа полива и удобрений будет настроена автоматически</span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCatalogPickerOpen(true)}
                    className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground">Выбрать из каталога</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Нажмите, чтобы выбрать сорт
                    </p>
                  </button>
                )}
              </div>
            )}

            {/* Name */}
            <div className="form-field">
              <Label className="form-label">
                Название <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя вашего растения"
                className="form-input"
              />
            </div>

            {/* Cultivar (only in manual mode or editable) */}
            <div className="form-field">
              <Label className="form-label">Сорт</Label>
              <Input
                value={cultivar}
                onChange={(e) => setCultivar(e.target.value)}
                placeholder="Название сорта"
                className="form-input"
              />
            </div>

            {/* Type & Stage row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-field">
                <Label className="form-label">Тип</Label>
                <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                  <SelectTrigger className="form-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="indoor">Домашнее</SelectItem>
                    <SelectItem value="outdoor">Уличное</SelectItem>
                    <SelectItem value="greenhouse">Теплица</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Стадия роста</Label>
                <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
                  <SelectTrigger className="form-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="seedling">Рассада</SelectItem>
                    <SelectItem value="vegetative">Вегетация</SelectItem>
                    <SelectItem value="flowering">Цветение</SelectItem>
                    <SelectItem value="harvest">Урожай</SelectItem>
                    <SelectItem value="curing">Сушка</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expected Harvest */}
            <div className="form-field">
              <Label className="form-label">Ожидаемый урожай</Label>
              <Input
                type="date"
                value={expectedHarvest}
                onChange={(e) => setExpectedHarvest(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Notes */}
            <div className="form-field">
              <Label className="form-label">Заметки</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Дополнительная информация..."
                className="form-input min-h-[80px] resize-none"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 h-12"
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CatalogPickerModal
        open={catalogPickerOpen}
        onOpenChange={setCatalogPickerOpen}
        onSelect={handleCatalogSelect}
      />
    </>
  );
}
