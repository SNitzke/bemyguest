
import React, { useState } from "react";
import { Property } from "../../types";
import { MapPin, DollarSign, Image } from "lucide-react";
import PropertyStatusBadge from "./PropertyStatusBadge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Mock images array - in a real app, these would come from the property data
  const images = [
    property.imageUrl,
    "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    "https://source.unsplash.com/random/800x600/?apartment",
    "https://source.unsplash.com/random/800x600/?house"
  ];

  return (
    <div className="space-y-6 pb-6 border-b">
      <div className="relative">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative aspect-video cursor-pointer group">
                      <img
                        src={image}
                        alt={`Property view ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Image className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <img
                      src={image}
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-heading font-semibold">{property.name}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address}
          </div>
          <div className="flex items-center font-medium mt-2">
            <DollarSign className="h-4 w-4 mr-1" />
            $1,200/month
          </div>
        </div>
        <PropertyStatusBadge status="available" />
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <span>{property.units} units</span>
      </div>
    </div>
  );
};

export default PropertyHeader;
