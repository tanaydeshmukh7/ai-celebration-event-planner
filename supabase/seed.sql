-- ==============================================================================
-- AI Celebration & Event Planner: Seed Data
-- ==============================================================================

-- Sample Vendors Directory (Public/Vetted realistic Indian market vendors)
INSERT INTO public.vendors (name, category, city, price_range, starting_price, rating, review_count, contact_email, contact_phone, address, website, image_url, description, highlights, is_sample)
VALUES
-- Venues
('The Royal Palace Banquets & Lawns', 'venue', 'Pune', '₹₹₹', 75000, 4.9, 128, 'contact@royalpalacepune.sample', '+91 98230 11223', 'Baner Road, Near Highway, Pune', 'https://royalpalacepune.sample', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', 'Grand pillarless banquet hall with lush outdoor lawn. Capacity 100-600 guests. Ample valet parking.', ARRAY['Air Conditioned', 'Valet Parking', 'Lawn Attached', 'Bridal Suite'], true),
('Orchid Meadow Garden Resort', 'venue', 'Pune', '₹₹', 45000, 4.7, 85, 'hello@orchidmeadow.sample', '+91 98901 44556', 'Koregaon Park Annexe, Pune', 'https://orchidmeadow.sample', 'https://images.unsplash.com/photo-1545232979-fbf675038c1a?auto=format&fit=crop&w=800&q=80', 'Boutique garden venue perfect for intimate anniversaries, cocktail evenings, and 50-200 guest celebrations.', ARRAY['Open-Air Lawn', 'Gazebo Stage', 'Fairy Lights Installed', 'Eco-friendly'], true),
('Skyline Rooftop Lounge & Terrace', 'venue', 'Pune', '₹₹', 35000, 4.8, 64, 'events@skylineterrace.sample', '+91 97654 33221', 'Viman Nagar, Pune', 'https://skylineterrace.sample', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', 'Scenic rooftop venue with panoramic city views, modern acoustics, and weather-proof canopy.', ARRAY['City View', 'In-house Bar setup', 'Bose Sound System'], true),

-- Catering
('Rasoi Gourmet Caterers', 'catering', 'Pune', '₹₹', 850, 4.9, 210, 'order@rasoigourmet.sample', '+91 98220 88990', 'FC Road, Shivaji Nagar, Pune', 'https://rasoigourmet.sample', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80', 'Premium multi-cuisine catering specializing in authentic Maharashtrian, North Indian, Chaat counters, and Continental live counters.', ARRAY['Live Cooking Stations', 'Jain Menu Available', 'Eco-friendly Cutlery', 'Tasting Sessions'], true),
('Flavours of India Catering Co.', 'catering', 'Pune', '₹₹₹', 1200, 4.8, 142, 'chef@flavoursofindia.sample', '+91 98500 77665', 'Kalyani Nagar, Pune', 'https://flavoursofindia.sample', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', 'Curated artisanal menus for weddings and corporate galas with signature desserts and mocktail bar.', ARRAY['Dessert Bar', 'Customized Menus', 'Uniformed Staff', 'FSSAI Certified'], true),

-- Decoration
('Petals & Lights Decor Studio', 'decoration', 'Pune', '₹₹', 25000, 4.9, 175, 'design@petalsandlights.sample', '+91 99700 12345', 'Aundh, Pune', 'https://petalsandlights.sample', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80', 'Modern bohemian, rustic floral setups, entrance arches, photo booths, and bespoke lighting designs.', ARRAY['Custom Photobooth', 'Fresh Exotic Flowers', 'LED Monograms', '3D Layout Preview'], true),
('Utsav Royal Decorators', 'decoration', 'Pune', '₹₹₹', 45000, 4.7, 98, 'utsav@royaldecor.sample', '+91 98900 55443', 'Sadashiv Peth, Pune', 'https://utsavroyal.sample', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'Traditional marigold & brass mandap setup, grand stage backdrops, and fairy light canopies.', ARRAY['Traditional Mandap', 'Fabric Drapes', 'Brass URLI Accents'], true),

-- Photography
('Lumiere Moments Photography', 'photography', 'Pune', '₹₹', 35000, 4.9, 192, 'shoot@lumieremoments.sample', '+91 98231 66778', 'Kothrud, Pune', 'https://lumieremoments.sample', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', 'Candid celebration photography and cinematic 4K video reels. Drone coverage available.', ARRAY['Same-Day Teaser Reel', '4K Cinematic Video', 'Online Cloud Gallery', 'Drone Pilot'], true),
('Visual Tales Wedding & Event Media', 'photography', 'Pune', '₹₹₹', 60000, 4.8, 114, 'hello@visualtales.sample', '+91 97640 88123', 'Viman Nagar, Pune', 'https://visualtales.sample', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', 'Award-winning photojournalists documenting honest laughter, tears, and high-energy party moments.', ARRAY['2 Photographers + 1 Videographer', 'Hardcover Photobook', 'Pre-event Consultation'], true),

-- Entertainment & DJs
('DJ Aryan & Sound Beats Pune', 'entertainment', 'Pune', '₹₹', 18000, 4.8, 88, 'bookings@djaryan.sample', '+91 98811 22334', 'Camp, Pune', 'https://djaryan.sample', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', 'Bollywood, Commercial, Deep House, and Punjabi high-voltage party DJ with JBL sound and moving heads.', ARRAY['Fog Machine', 'Wireless Mics', 'Moving Heads Lighting', 'Custom Playlist'], true),

-- Makeup & Styling
('Aura Bridal & Glamour Studio', 'makeup', 'Pune', '₹₹', 15000, 4.9, 102, 'glam@aurastudio.sample', '+91 99223 77889', 'Senapati Bapat Road, Pune', 'https://aurastudio.sample', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'HD & Airbrush makeup artist for brides, grooms, birthday stars, and family draping styling.', ARRAY['Airbrush Available', 'On-venue Service', 'Trial Session', 'Hair Styling Included'], true);

-- Sample Inspiration Items
INSERT INTO public.inspiration_items (title, category, description, color_codes, image_url, tags, is_saved)
VALUES
('Warm Tuscan Boho Sunset', 'theme', 'Earthy terracotta pots, pampas grass, warm fairy lights, and relaxed wooden seating.', ARRAY['#C94225', '#FF8066', '#EAE3F4', '#FAF8F4'], 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', ARRAY['Boho', 'Warm', 'Sunset', 'Outdoor'], true),
('Royal Marigold & Brass Heritage', 'decoration', 'Abundant yellow and orange marigold garlands cascading with antique brass urlis and floating diya candles.', ARRAY['#FFB0A0', '#E5A93C', '#4C234F', '#FAF8F4'], 'https://images.unsplash.com/photo-1545232979-fbf675038c1a?auto=format&fit=crop&w=800&q=80', ARRAY['Traditional', 'Marigold', 'Heritage', 'Indian'], true),
('Modern Deep Plum & Coral Chic', 'palette', 'Sophisticated palette pairing deep royal plum with playful coral accents and soft lavender highlights.', ARRAY['#4C234F', '#FF8066', '#EAE3F4', '#222126'], 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', ARRAY['Modern', 'SaaS', 'Plum', 'Coral'], true),
('Minimalist Botanical Tablescape', 'table_setting', 'Crisp off-white linen runners with fresh olive eucalyptus branches, gold taper candleholders, and custom menu cards.', ARRAY['#FAF8F4', '#4A6B53', '#D4AF37', '#222126'], 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=80', ARRAY['Botanical', 'Elegant', 'Minimalist', 'Dinner'], true);
