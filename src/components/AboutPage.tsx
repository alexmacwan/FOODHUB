import { Truck, Clock, Heart, Shield } from "lucide-react";

export function AboutPage() {
  const features = [
    {
      icon: <Truck className="w-12 h-12 text-orange-500" />,
      title: "Fast Delivery",
      description: "Get your favorite food delivered hot and fresh in 30 minutes or less.",
    },
    {
      icon: <Clock className="w-12 h-12 text-orange-500" />,
      title: "24/7 Service",
      description: "Order anytime, anywhere. We're always here to serve you.",
    },
    {
      icon: <Heart className="w-12 h-12 text-orange-500" />,
      title: "Quality Food",
      description: "We partner with the best restaurants to ensure top-quality meals.",
    },
    {
      icon: <Shield className="w-12 h-12 text-orange-500" />,
      title: "Safe & Secure",
      description: "Your data and payments are protected with industry-leading security.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <h1 className="text-6xl mb-6">About FoodHub</h1>
          <p className="text-2xl text-orange-100 max-w-3xl mx-auto">
            Your trusted partner in delivering happiness, one meal at a time
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Founded in 2020, FoodHub started with a simple mission: to connect people with
              the food they love from their favorite local restaurants.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              What began as a small startup has grown into a thriving platform serving
              thousands of happy customers every day. We've partnered with hundreds of
              restaurants to bring you the widest variety of cuisines.
            </p>
            <p className="text-lg text-gray-600">
              Our commitment to quality, speed, and customer satisfaction drives everything
              we do. We're not just delivering food – we're delivering experiences.
            </p>
          </div>
          <div className="bg-orange-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-5xl text-orange-500 mb-2">500+</div>
                <div className="text-gray-700">Restaurant Partners</div>
              </div>
              <div>
                <div className="text-5xl text-orange-500 mb-2">10K+</div>
                <div className="text-gray-700">Happy Customers</div>
              </div>
              <div>
                <div className="text-5xl text-orange-500 mb-2">50K+</div>
                <div className="text-gray-700">Orders Delivered</div>
              </div>
              <div>
                <div className="text-5xl text-orange-500 mb-2">4.8</div>
                <div className="text-gray-700">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-4xl text-gray-900 mb-12 text-center">Why Choose FoodHub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-4xl mb-6">Our Mission</h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            To revolutionize food delivery by creating seamless experiences that connect
            restaurants, delivery partners, and customers in a way that benefits everyone.
            We believe in supporting local businesses while providing exceptional service
            to our community.
          </p>
        </div>
      </div>
    </div>
  );
}
