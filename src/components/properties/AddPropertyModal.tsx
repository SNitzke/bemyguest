import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PlusCircle, Building2, MapPin, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface AddPropertyModalProps {
  onAddProperty: (property: {
    name: string;
    address: string;
    units: number;
  }) => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onAddProperty }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    units: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || formData.units < 1) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    onAddProperty(formData);
    setFormData({ name: '', address: '', units: 1 });
    setOpen(false);
    toast.success('Propiedad agregada exitosamente');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle size={16} />
          Agregar Propiedad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Propiedad</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Ej: Residencial Los Pinos"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Calle, Ciudad, Estado, CP"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="units">Número de Unidades</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="units"
                type="number"
                min="1"
                placeholder="1"
                value={formData.units}
                onChange={(e) => setFormData(prev => ({ ...prev, units: parseInt(e.target.value) || 1 }))}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Agregar Propiedad
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};