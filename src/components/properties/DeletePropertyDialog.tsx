import React from 'react';
import { Property } from '../../types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from 'sonner';

interface DeletePropertyDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (propertyId: string) => void;
}

const DeletePropertyDialog: React.FC<DeletePropertyDialogProps> = ({
  property,
  open,
  onOpenChange,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(property.id);
    onOpenChange(false);
    toast.success('Propiedad eliminada exitosamente');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la propiedad
            <strong> "{property.name}"</strong> y todos los datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertyDialog;