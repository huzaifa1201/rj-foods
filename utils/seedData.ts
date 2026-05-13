
export const seedProducts = [
  // 1. Fast Food
  { name: "Zinger Burger", description: "Classic crispy chicken burger", price: 450, category: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { name: "Double Beef Burger", description: "Two juicy beef patties with cheese", price: 750, category: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500" },
  { name: "Crispy Chicken Wrap", description: "Fried chicken in a soft tortilla", price: 380, category: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500" },
  { name: "Chicken Nuggets (10pcs)", description: "Golden fried nuggets", price: 500, category: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500" },
  { name: "Onion Rings", description: "Crispy battered onion rings", price: 250, category: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1639024471283-035188835118?w=500" },

  // 2. Pizza
  { name: "Margherita Pizza", description: "Classic tomato and mozzarella", price: 900, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500" },
  { name: "Chicken Tikka Pizza", description: "Desi style spicy chicken pizza", price: 1100, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { name: "Vegetable Supreme", description: "Loaded with fresh vegetables", price: 950, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
  { name: "Pepperoni Passion", description: "Double pepperoni and cheese", price: 1300, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500" },
  { name: "BBQ Chicken Pizza", description: "Chicken with tangy BBQ sauce", price: 1200, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },

  // 3. Pasta
  { name: "Alfredo Pasta", description: "Creamy white sauce pasta", price: 850, category: "Pasta", imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500" },
  { name: "Spaghetti Bolognese", description: "Classic minced beef pasta", price: 950, category: "Pasta", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500" },
  { name: "Penne Arrabbiata", description: "Spicy tomato sauce pasta", price: 750, category: "Pasta", imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500" },
  { name: "Mac & Cheese", description: "Extra cheesy macaroni", price: 650, category: "Pasta", imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500" },
  { name: "Lasagna", description: "Layered pasta with meat and cheese", price: 1200, category: "Pasta", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500" },

  // 4. BBQ
  { name: "Chicken Seekh Kabab", description: "Spicy grilled minced chicken", price: 600, category: "BBQ", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
  { name: "Beef Boti", description: "Tender beef chunks grilled", price: 800, category: "BBQ", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
  { name: "Fish Tikka", description: "Grilled spicy fish fillets", price: 1200, category: "BBQ", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500" },
  { name: "Lamb Chops", description: "Premium grilled lamb chops", price: 1800, category: "BBQ", imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500" },
  { name: "Malai Boti", description: "Creamy grilled chicken", price: 750, category: "BBQ", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },

  // 5. Chinese
  { name: "Kung Pao Chicken", description: "Spicy chicken with peanuts", price: 950, category: "Chinese", imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500" },
  { name: "Egg Fried Rice", description: "Classic fried rice with egg", price: 550, category: "Chinese", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { name: "Chicken Chow Mein", description: "Stir fried noodles with chicken", price: 750, category: "Chinese", imageUrl: "https://images.unsplash.com/photo-1585032295866-2d2f3c05e19f?w=500" },
  { name: "Sweet & Sour Fish", description: "Crispy fish in tangy sauce", price: 1100, category: "Chinese", imageUrl: "https://images.unsplash.com/photo-1512058560366-cd2427ff06d3?w=500" },
  { name: "Beef with Chili", description: "Spicy stir fried beef", price: 1050, category: "Chinese", imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=500" },

  // 6. Desi (Traditional)
  { name: "Chicken Karahi", description: "Authentic spicy chicken curry", price: 1400, category: "Desi", imageUrl: "https://images.unsplash.com/photo-1603894584134-f1740097728a?w=500" },
  { name: "Mutton Biryani", description: "Fragrant rice with tender mutton", price: 950, category: "Desi", imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
  { name: "Daal Mash", description: "Traditional lentils with butter", price: 450, category: "Desi", imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500" },
  { name: "Butter Naan", description: "Soft tandoori bread with butter", price: 60, category: "Desi", imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500" },
  { name: "Nihari", description: "Slow cooked beef stew", price: 850, category: "Desi", imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },

  // 7. Seafood
  { name: "Grilled Prawns", description: "Jumbo prawns with garlic butter", price: 1800, category: "Seafood", imageUrl: "https://images.unsplash.com/photo-1559742811-8242895276c0?w=500" },
  { name: "Fish & Chips", description: "Crispy battered fish with fries", price: 1100, category: "Seafood", imageUrl: "https://images.unsplash.com/photo-1534604973900-c41ab4c5e636?w=500" },
  { name: "Seafood Platter", description: "Mixed grilled seafood", price: 2500, category: "Seafood", imageUrl: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=500" },
  { name: "Lobster Thermidor", description: "Premium baked lobster", price: 3500, category: "Seafood", imageUrl: "https://images.unsplash.com/photo-1559742811-8242895276c0?w=500" },
  { name: "Calamari Rings", description: "Fried squid rings", price: 950, category: "Seafood", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },

  // 8. Steaks
  { name: "Ribeye Steak", description: "Juicy grilled ribeye beef", price: 2200, category: "Steaks", imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500" },
  { name: "Peppercorn Steak", description: "Steak with spicy pepper sauce", price: 2300, category: "Steaks", imageUrl: "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=500" },
  { name: "Mushroom Steak", description: "Steak with creamy mushroom sauce", price: 2300, category: "Steaks", imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=500" },
  { name: "T-Bone Steak", description: "Classic thick cut T-Bone", price: 2500, category: "Steaks", imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500" },
  { name: "Chicken Steak", description: "Grilled chicken with sides", price: 1200, category: "Steaks", imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9ad1746?w=500" },

  // 9. Sandwiches
  { name: "Club Sandwich", description: "Triple decker with chicken and egg", price: 550, category: "Sandwiches", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500" },
  { name: "Grilled Cheese", description: "Extra melted cheese sandwich", price: 350, category: "Sandwiches", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500" },
  { name: "Roast Beef Sandwich", description: "Thin sliced beef with mustard", price: 650, category: "Sandwiches", imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500" },
  { name: "Tuna Sub", description: "Fresh tuna salad sub", price: 600, category: "Sandwiches", imageUrl: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500" },
  { name: "Veggie Panini", description: "Grilled vegetables and pesto", price: 500, category: "Sandwiches", imageUrl: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?w=500" },

  // 10. Salads
  { name: "Caesar Salad", description: "Fresh lettuce with parmesan", price: 700, category: "Salads", imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500" },
  { name: "Greek Salad", description: "Feta cheese and olives", price: 650, category: "Salads", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500" },
  { name: "Russian Salad", description: "Creamy potato and fruit salad", price: 550, category: "Salads", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },
  { name: "Chicken Apple Salad", description: "Grilled chicken and apples", price: 800, category: "Salads", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },
  { name: "Fruit Salad", description: "Fresh seasonal fruits", price: 450, category: "Salads", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },

  // 11. Beverages
  { name: "Fresh Lime", description: "Refreshing lemon drink", price: 150, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500" },
  { name: "Cold Coffee", description: "Blended coffee with ice cream", price: 350, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500" },
  { name: "Mint Margarita", description: "Refreshing mint and lime blend", price: 250, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500" },
  { name: "Soft Drink", description: "Coke, Sprite or Fanta", price: 100, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500" },
  { name: "Mineral Water", description: "Pure bottled water", price: 80, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1548964856-ac522a4a3415?w=500" },

  // 12. Desserts
  { name: "Chocolate Lava Cake", description: "Warm cake with molten center", price: 550, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500" },
  { name: "Gulab Jamun (2 Pcs)", description: "Sweet traditional dumplings", price: 180, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "New York Cheesecake", description: "Classic creamy cheesecake", price: 650, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500" },
  { name: "Brownie with Ice Cream", description: "Warm brownie with vanilla scoop", price: 450, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1564844536311-de546a28c87d?w=500" },
  { name: "Kheer", description: "Traditional rice pudding", price: 350, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500" },

  // 13. Appetizers
  { name: "French Fries", description: "Crispy golden potato fries", price: 300, category: "Appetizers", imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
  { name: "Garlic Bread", description: "Toasted bread with garlic", price: 250, category: "Appetizers", imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500" },
  { name: "Chicken Wings", description: "Spicy buffalo wings", price: 650, category: "Appetizers", imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500" },
  { name: "Nachos", description: "Loaded cheesy nachos", price: 750, category: "Appetizers", imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500" },
  { name: "Dynamite Shrimp", description: "Shrimp in spicy creamy sauce", price: 1200, category: "Appetizers", imageUrl: "https://images.unsplash.com/photo-1559742811-8242895276c0?w=500" },

  // 14. Breakfast
  { name: "Halwa Puri", description: "Traditional breakfast with chickpeas", price: 450, category: "Breakfast", imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
  { name: "Pancakes", description: "Fluffy pancakes with syrup", price: 600, category: "Breakfast", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=500" },
  { name: "Omelette", description: "Two eggs with veggies", price: 300, category: "Breakfast", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500" },
  { name: "Paratha", description: "Crispy tawa paratha", price: 80, category: "Breakfast", imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
  { name: "French Toast", description: "Sweet egg dipped bread", price: 400, category: "Breakfast", imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500" },

  // 15. Healthy Eats
  { name: "Quinoa Bowl", description: "Quinoa with roasted veggies", price: 950, category: "Healthy Eats", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },
  { name: "Grilled Salmon", description: "Salmon with steamed broccoli", price: 1800, category: "Healthy Eats", imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500" },
  { name: "Avocado Toast", description: "Mashed avocado on multigrain", price: 750, category: "Healthy Eats", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500" },
  { name: "Grilled Chicken Salad", description: "Lean protein salad", price: 850, category: "Healthy Eats", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },
  { name: "Smoothie Bowl", description: "Acai and fruit blend", price: 700, category: "Healthy Eats", imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500" },

  // 16. Sushi
  { name: "California Roll", description: "Crab and avocado roll", price: 1200, category: "Sushi", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500" },
  { name: "Salmon Nigiri", description: "Fresh salmon on rice", price: 1400, category: "Sushi", imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500" },
  { name: "Tempura Roll", description: "Crispy shrimp roll", price: 1100, category: "Sushi", imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500" },
  { name: "Miso Soup", description: "Traditional Japanese soup", price: 450, category: "Sushi", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
  { name: "Dragon Roll", description: "Eel and avocado premium roll", price: 1800, category: "Sushi", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500" },

  // 17. Tacos
  { name: "Beef Tacos", description: "Spicy minced beef in shells", price: 850, category: "Tacos", imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500" },
  { name: "Fish Tacos", description: "Grilled fish with cabbage slaw", price: 950, category: "Tacos", imageUrl: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=500" },
  { name: "Chicken Quesadilla", description: "Cheesy chicken grill", price: 750, category: "Tacos", imageUrl: "https://images.unsplash.com/photo-1599974579688-8dbdd335c7b8?w=500" },
  { name: "Burrito Bowl", description: "All burrito fillings in a bowl", price: 1050, category: "Tacos", imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500" },
  { name: "Shrimp Tacos", description: "Spicy grilled shrimp", price: 1200, category: "Tacos", imageUrl: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=500" },

  // 18. Soups
  { name: "Hot & Sour Soup", description: "Spicy and tangy Chinese soup", price: 450, category: "Soups", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
  { name: "Chicken Corn Soup", description: "Classic thick creamy soup", price: 400, category: "Soups", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
  { name: "Tomato Basil Soup", description: "Fresh tomato blend", price: 350, category: "Soups", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
  { name: "Mushroom Soup", description: "Creamy wild mushroom", price: 450, category: "Soups", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
  { name: "Lentil Soup", description: "Healthy yellow lentils", price: 300, category: "Soups", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },

  // 19. Shakes
  { name: "Oreo Shake", description: "Blended Oreo cookies", price: 350, category: "Shakes", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },
  { name: "Strawberry Shake", description: "Fresh strawberry blend", price: 350, category: "Shakes", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },
  { name: "Vanilla Shake", description: "Classic vanilla bean", price: 300, category: "Shakes", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },
  { name: "Chocolate Shake", description: "Rich Belgian chocolate", price: 350, category: "Shakes", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },
  { name: "Mango Shake", description: "Fresh seasonal mangoes", price: 400, category: "Shakes", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },

  // 20. Ice Cream
  { name: "Waffle Cone Scoop", description: "Choose any flavor", price: 250, category: "Ice Cream", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=500" },
  { name: "Banana Split", description: "Classic banana and 3 scoops", price: 650, category: "Ice Cream", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=500" },
  { name: "Hot Fudge Sundae", description: "Vanilla with warm fudge", price: 450, category: "Ice Cream", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=500" },
  { name: "Ice Cream Cake", description: "Slice of premium cake", price: 550, category: "Ice Cream", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=500" },
  { name: "Sorbet", description: "Dairy free fruit ice", price: 300, category: "Ice Cream", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=500" }
];

export const seedCategories = [
  { name: "Fast Food", imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500" },
  { name: "Pizza", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
  { name: "Pasta", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500" },
  { name: "BBQ", imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500" },
  { name: "Chinese", imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500" },
  { name: "Desi", imageUrl: "https://images.unsplash.com/photo-1603894584134-f1740097728a?w=500" },
  { name: "Seafood", imageUrl: "https://images.unsplash.com/photo-1559742811-8242895276c0?w=500" },
  { name: "Steaks", imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500" },
  { name: "Sandwiches", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500" },
  { name: "Salads", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500" },
  { name: "Beverages", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500" },
  { name: "Desserts", imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500" },
  { name: "Appetizers", imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
  { name: "Breakfast", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=500" },
  { name: "Healthy Eats", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" },
  { name: "Sushi", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500" },
  { name: "Tacos", imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=500" },
  { name: "Soups", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500" },
  { name: "Shakes", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" },
  { name: "Ice Cream", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?w=500" }
];
