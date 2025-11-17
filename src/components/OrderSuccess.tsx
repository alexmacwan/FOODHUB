import { Check, Home } from "lucide-react";
import { Button } from "./ui/button";

interface OrderSuccessProps {
  onBackToHome: () => void;
}

export function OrderSuccess({ onBackToHome }: OrderSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order. Your delicious food is being prepared.
          </p>
          <p className="text-gray-600 mb-8">
            Estimated delivery time: <span className="text-orange-500">30-40 minutes</span>
          </p>
          <div className="bg-orange-50 rounded-2xl p-6 mb-8">
            <div className="text-sm text-gray-600 mb-1">Order Number</div>
            <div className="text-2xl text-orange-500">
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>
          <Button
            onClick={onBackToHome}
            className="w-full bg-orange-500 hover:bg-orange-600 py-6"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
