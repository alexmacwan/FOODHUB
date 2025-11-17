import { FoodDeliveryHome } from "./components/FoodDeliveryHome";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <>
      <FoodDeliveryHome />
      <Toaster position="top-center" />
    </>
  );
}