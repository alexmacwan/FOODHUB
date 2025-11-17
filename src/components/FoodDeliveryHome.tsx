import { Search, MapPin, ShoppingCart, Home, User, Clock, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { authService } from "../utils/auth";
import { api } from "../utils/api";
import { AuthModal } from "./AuthModal";
import { RestaurantDetail } from "./RestaurantDetail";
import { RestaurantsPage } from "./RestaurantsPage";
import { AboutPage } from "./AboutPage";
import { ContactPage } from "./ContactPage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";
import { OrderSuccess } from "./OrderSuccess";
import { toast } from "sonner@2.0.3";

const categories = [
  { id: 1, name: "All", icon: "🍽️" },
  { id: 2, name: "Pizza", icon: "🍕" },
  { id: 3, name: "Burger", icon: "🍔" },
  { id: 4, name: "Sushi", icon: "🍱" },
  { id: 5, name: "Pasta", icon: "🍝" },
  { id: 6, name: "Tacos", icon: "🌮" },
];

type Page = "home" | "restaurants" | "about" | "contact" | "restaurant-detail" | "cart" | "checkout" | "order-success";

interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function FoodDeliveryHome() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    checkSession();
    loadRestaurants();
  }, []);

  const checkSession = async () => {
    try {
      const session = await authService.getSession();
      if (session) {
        setUser(session.user);
      }
    } catch (error) {
      console.log("No active session");
    }
  };

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      let restaurantData = await api.getRestaurants();
      
      // If no restaurants, initialize them
      if (!restaurantData || restaurantData.length === 0) {
        await api.initRestaurants();
        restaurantData = await api.getRestaurants();
      }

      setRestaurants(restaurantData);
    } catch (error: any) {
      console.error("Error loading restaurants:", error);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleSelectRestaurant = async (id: string) => {
    try {
      const restaurant = await api.getRestaurant(id);
      setSelectedRestaurant(restaurant);
      setCurrentPage("restaurant-detail");
    } catch (error: any) {
      toast.error("Failed to load restaurant details");
    }
  };

  const handleAddToCart = (menuItem: any, quantity: number) => {
    if (!selectedRestaurant) return;

    const cartItemId = `${selectedRestaurant.id}-${menuItem.id}`;
    const existingItem = cartItems.find((item) => item.id === cartItemId);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        image: menuItem.image,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setCurrentPage("order-success");
  };

  const handleViewCart = () => {
    setCurrentPage("cart");
  };

  const renderHeader = () => (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-gray-900 text-2xl">FoodHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage("home")}
              className={`${
                currentPage === "home"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Home
            </button>
            <button
              onClick={() => setCurrentPage("restaurants")}
              className={`${
                currentPage === "restaurants"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`${
                currentPage === "about"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`${
                currentPage === "contact"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {currentPage === "home" && (
              <div className="hidden md:flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Deliver to</div>
                  <div className="text-orange-500">Downtown, Street 42</div>
                </div>
              </div>
            )}
            <div className="relative cursor-pointer" onClick={handleViewCart}>
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                  {cartCount}
                </Badge>
              )}
            </div>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-gray-700">
                  {user.user_metadata?.name || user.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex bg-orange-500 hover:bg-orange-600"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHomePage = () => (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl mb-4">Your Favorite Food Delivered Hot & Fresh</h1>
            <p className="text-xl text-orange-100 mb-8">
              Order from the best restaurants in your area. Fast delivery guaranteed.
            </p>
            {/* Search Bar */}
            <div className="relative bg-white rounded-lg shadow-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for restaurants or dishes..."
                className="pl-12 py-6 border-0 text-gray-900"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-gray-900 text-3xl mb-2">Popular Restaurants</h2>
          <p className="text-gray-600">Discover the best food around you</p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading restaurants...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant.id)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span className="text-gray-900">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-gray-900 text-xl mb-1">{restaurant.name}</div>
                      <div className="text-gray-500 flex items-center gap-1">
                        {restaurant.cuisine} • {restaurant.priceRange}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-gray-600 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.deliveryTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-8 right-8 z-20">
          <Button 
            onClick={handleViewCart}
            className="bg-orange-500 hover:bg-orange-600 shadow-2xl px-8 py-6 rounded-full text-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({cartCount})
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {(currentPage !== "cart" && currentPage !== "checkout" && currentPage !== "order-success") && renderHeader()}
      
      {currentPage === "home" && renderHomePage()}
      {currentPage === "restaurants" && (
        <RestaurantsPage
          restaurants={restaurants}
          onSelectRestaurant={handleSelectRestaurant}
        />
      )}
      {currentPage === "about" && <AboutPage />}
      {currentPage === "contact" && <ContactPage />}
      {currentPage === "restaurant-detail" && selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onBack={() => setCurrentPage("home")}
          onAddToCart={handleAddToCart}
        />
      )}
      {currentPage === "cart" && (
        <CartPage
          items={cartItems}
          onBack={() => setCurrentPage("home")}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={() => {
            if (!user) {
              toast.error("Please sign in to checkout");
              setIsAuthModalOpen(true);
            } else {
              setCurrentPage("checkout");
            }
          }}
        />
      )}
      {currentPage === "checkout" && (
        <CheckoutPage
          items={cartItems}
          onBack={() => setCurrentPage("cart")}
          onSuccess={handleCheckoutSuccess}
          accessToken={user?.access_token || null}
        />
      )}
      {currentPage === "order-success" && (
        <OrderSuccess onBackToHome={() => setCurrentPage("home")} />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => checkSession()}
      />
    </div>
  );
}
