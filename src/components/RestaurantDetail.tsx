import { ArrowLeft, MapPin, Clock, Star, Phone, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  cuisine: string;
  priceRange: string;
  description: string;
  address: string;
  phone: string;
  menu: MenuItem[];
}

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function RestaurantDetail({ restaurant, onBack, onAddToCart }: RestaurantDetailProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleIncrement = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    onAddToCart(item, quantity);
    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    toast.success(`Added ${quantity} ${item.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Restaurants
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-white p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
            <span className="text-xl">{restaurant.rating}</span>
            <span className="mx-2">•</span>
            <span>{restaurant.cuisine}</span>
            <span className="mx-2">•</span>
            <span>{restaurant.priceRange}</span>
          </div>
          <h1 className="text-5xl mb-2">{restaurant.name}</h1>
          <p className="text-xl text-gray-200">{restaurant.description}</p>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-gray-500">Delivery Time</div>
                <div className="text-gray-900">{restaurant.deliveryTime} min</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-gray-500">Address</div>
                <div className="text-gray-900">{restaurant.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-gray-500">Phone</div>
                <div className="text-gray-900">{restaurant.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div>
          <h2 className="text-3xl text-gray-900 mb-6">Menu</h2>
          <div className="space-y-4">
            {restaurant.menu.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full md:w-40 h-40 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="text-xl text-gray-900 mb-2">{item.name}</div>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-orange-500">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-3">
                        {quantities[item.id] > 0 ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecrement(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-lg w-8 text-center">
                              {quantities[item.id]}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIncrement(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIncrement(item.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={!quantities[item.id] && quantities[item.id] !== undefined}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
