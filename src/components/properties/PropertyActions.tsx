import React, { useState } from 'react';
import { Property } from '../../types';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import EditPropertyModal from './EditPropertyModal';
import DeletePropertyDialog from './DeletePropertyDialog';
import { useNavigate } from 'react-router-dom';

interface PropertyActionsProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  property,
  onEdit,
  onDelete,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/properties/${property.id}`)}>
            <Eye size={16} className="mr-2" />
            Ver Detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit size={16} className="mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 size={16} className="mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPropertyModal
        property={property}
        open={editOpen}
        onOpenChange={setEditOpen}
        onEdit={onEdit}
      />

      <DeletePropertyDialog
        property={property}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={onDelete}
      />
    </>
  );
};