import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button, PageLoader, Badge, ImageWithFallback } from '../components/UI';
import { Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      navigate('/cart');
    }
  };

  if (loading) return <PageLoader />;
  
  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Button onClick={() => navigate('/')} className="mt-4">Back to Menu</Button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="h-96 md:h-auto bg-gray-100 relative">
          <ImageWithFallback 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Badge color="bg-primaryLight text-primary mb-4 w-fit">{product.category || 'Special'}</Badge>
          <h1 className="text-4xl font-bold text-darkGray mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">PKR {product.price}</p>
          <p className="text-gray-500 leading-relaxed mb-8">{product.description}</p>
          
          <div className="border-t border-gray-100 pt-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-200">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full py-4 text-lg">
              <ShoppingBag className="mr-2" /> Add {quantity} to Cart - PKR {product.price * quantity}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};