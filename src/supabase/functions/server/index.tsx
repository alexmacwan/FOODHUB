import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Sign up route
app.post('/make-server-48248d63/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Sign up error during user creation:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get user profile
app.get('/make-server-48248d63/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ success: true, profile });
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get all restaurants
app.get('/make-server-48248d63/restaurants', async (c) => {
  try {
    const restaurants = await kv.getByPrefix('restaurant:');
    return c.json({ success: true, restaurants });
  } catch (error) {
    console.log('Error fetching restaurants:', error);
    return c.json({ error: 'Failed to fetch restaurants' }, 500);
  }
});

// Get restaurant by ID
app.get('/make-server-48248d63/restaurants/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const restaurant = await kv.get(`restaurant:${id}`);
    
    if (!restaurant) {
      return c.json({ error: 'Restaurant not found' }, 404);
    }

    return c.json({ success: true, restaurant });
  } catch (error) {
    console.log('Error fetching restaurant:', error);
    return c.json({ error: 'Failed to fetch restaurant' }, 500);
  }
});

// Initialize restaurants data
app.post('/make-server-48248d63/init-restaurants', async (c) => {
  try {
    const restaurants = [
      {
        id: '1',
        name: "Giuseppe's Pizzeria",
        image: "https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYzMzQ0MTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        deliveryTime: "25-35",
        distance: "1.2 km",
        cuisine: "Italian",
        priceRange: "₹₹",
        description: "Authentic Italian pizzeria serving wood-fired pizzas with fresh ingredients imported from Italy.",
        address: "123 Main Street, Downtown",
        phone: "+1 (555) 123-4567",
        menu: [
          { id: '1', name: 'Margherita Pizza', price: 12.99, description: 'Classic pizza with tomato, mozzarella, and basil', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
          { id: '2', name: 'Pepperoni Pizza', price: 14.99, description: 'Loaded with premium pepperoni', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
          { id: '3', name: 'Quattro Formaggi', price: 15.99, description: 'Four cheese pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
        ]
      },
      {
        id: '2',
        name: "Burger House",
        image: "https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc2MzI4NDcyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        deliveryTime: "20-30",
        distance: "0.8 km",
        cuisine: "American",
        priceRange: "₹",
        description: "Gourmet burgers made with 100% grass-fed beef and artisan buns.",
        address: "456 Oak Avenue, Downtown",
        phone: "+1 (555) 234-5678",
        menu: [
          { id: '1', name: 'Classic Burger', price: 9.99, description: 'Beef patty with lettuce, tomato, and special sauce', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
          { id: '2', name: 'Bacon Cheeseburger', price: 11.99, description: 'With crispy bacon and cheddar cheese', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400' },
          { id: '3', name: 'Veggie Burger', price: 10.99, description: 'Plant-based patty with fresh vegetables', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
        ]
      },
      {
        id: '3',
        name: "Tokyo Sushi Bar",
        image: "https://images.unsplash.com/photo-1730325559618-940c72290ef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlfGVufDF8fHx8MTc2MzMzMDkyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.9,
        deliveryTime: "30-40",
        distance: "2.5 km",
        cuisine: "Japanese",
        priceRange: "₹₹₹",
        description: "Traditional Japanese sushi restaurant with master chefs and premium ingredients.",
        address: "789 Sakura Lane, Downtown",
        phone: "+1 (555) 345-6789",
        menu: [
          { id: '1', name: 'Salmon Nigiri', price: 14.99, description: 'Fresh salmon over sushi rice', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
          { id: '2', name: 'California Roll', price: 12.99, description: 'Crab, avocado, and cucumber', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400' },
          { id: '3', name: 'Sashimi Platter', price: 24.99, description: 'Assorted fresh fish', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400' },
        ]
      },
      {
        id: '4',
        name: "Pasta Paradise",
        image: "https://images.unsplash.com/photo-1662197480393-2a82030b7b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGFzdGF8ZW58MXx8fHwxNzYzMzgyMTg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        deliveryTime: "25-35",
        distance: "1.5 km",
        cuisine: "Italian",
        priceRange: "₹₹",
        description: "Family-owned Italian restaurant specializing in handmade pasta.",
        address: "321 Pasta Street, Downtown",
        phone: "+1 (555) 456-7890",
        menu: [
          { id: '1', name: 'Spaghetti Carbonara', price: 13.99, description: 'Creamy pasta with pancetta', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
          { id: '2', name: 'Fettuccine Alfredo', price: 12.99, description: 'Rich and creamy Alfredo sauce', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400' },
          { id: '3', name: 'Lasagna', price: 15.99, description: 'Layers of pasta, meat, and cheese', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400' },
        ]
      },
      {
        id: '5',
        name: "Taco Fiesta",
        image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjb3N8ZW58MXx8fHwxNzYzMjkxNDUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.5,
        deliveryTime: "20-30",
        distance: "1.0 km",
        cuisine: "Mexican",
        priceRange: "₹",
        description: "Authentic Mexican street food with bold flavors and fresh ingredients.",
        address: "654 Fiesta Avenue, Downtown",
        phone: "+1 (555) 567-8901",
        menu: [
          { id: '1', name: 'Beef Tacos', price: 8.99, description: 'Three soft tacos with seasoned beef', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
          { id: '2', name: 'Chicken Burrito', price: 10.99, description: 'Grilled chicken with rice and beans', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
          { id: '3', name: 'Nachos Supreme', price: 9.99, description: 'Loaded nachos with all toppings', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400' },
        ]
      },
      {
        id: '6',
        name: "Noodle Kitchen",
        image: "https://images.unsplash.com/photo-1635685296916-95acaf58471f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG5vb2RsZXN8ZW58MXx8fHwxNzYzMzIzODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        deliveryTime: "25-35",
        distance: "1.8 km",
        cuisine: "Asian",
        priceRange: "₹₹",
        description: "Pan-Asian noodle house serving ramen, pho, and stir-fried noodles.",
        address: "987 Noodle Road, Downtown",
        phone: "+1 (555) 678-9012",
        menu: [
          { id: '1', name: 'Tonkotsu Ramen', price: 13.99, description: 'Rich pork bone broth with noodles', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
          { id: '2', name: 'Pad Thai', price: 11.99, description: 'Classic Thai stir-fried noodles', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400' },
          { id: '3', name: 'Beef Pho', price: 12.99, description: 'Vietnamese beef noodle soup', image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400' },
        ]
      },
    ];

    for (const restaurant of restaurants) {
      await kv.set(`restaurant:${restaurant.id}`, restaurant);
    }

    return c.json({ success: true, message: 'Restaurants initialized' });
  } catch (error) {
    console.log('Error initializing restaurants:', error);
    return c.json({ error: 'Failed to initialize restaurants' }, 500);
  }
});

// Submit contact form
app.post('/make-server-48248d63/contact', async (c) => {
  try {
    const { name, email, message } = await c.req.json();
    const contactId = `contact:${Date.now()}`;
    
    await kv.set(contactId, {
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.log('Error submitting contact form:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Create order
app.post('/make-server-48248d63/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { items, totalAmount, deliveryAddress, paymentMethod } = await c.req.json();
    const orderId = `order:${user.id}:${Date.now()}`;
    
    const order = {
      id: orderId,
      userId: user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(orderId, order);

    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get user orders
app.get('/make-server-48248d63/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orders = await kv.getByPrefix(`order:${user.id}:`);
    return c.json({ success: true, orders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

Deno.serve(app.fetch);