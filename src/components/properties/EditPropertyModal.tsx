
import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Property } from "../../types";
import { Edit } from "lucide-react";

interface EditPropertyModalProps {
  property: Property;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Property updated");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="mr-2 h-4 w-4" />
          Edit Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Make changes to the property information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Property Name
            </label>
            <Input
              id="name"
              defaultValue={property.name}
              placeholder="Enter property name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              defaultValue={property.address}
              placeholder="Enter address"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="units" className="text-sm font-medium">
              Number of Units
            </label>
            <Input
              id="units"
              type="number"
              defaultValue={property.units}
              placeholder="Enter number of units"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
