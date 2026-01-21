-- Goshen Clothing Database Schema

-- 1. Create Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    count_text TEXT,
    image_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_path TEXT,
    tag TEXT,
    collection_id UUID REFERENCES collections(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Public Read Access)
CREATE POLICY "Public Read Collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- 5. Create Policies (Admin All Access - Requires Auth)
CREATE POLICY "Admin All Collections" ON collections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Insert Initial Collections
INSERT INTO collections (title, count_text, image_path) VALUES
('Casual Elegance', '8 Pieces', 'WhatsApp Image 2025-12-30 at 12.12.05.jpeg'),
('Evening Glamour', '6 Pieces', 'WhatsApp Image 2025-12-30 at 12.12.06.jpeg'),
('Signature Prints', '12 Pieces', 'WhatsApp Image 2025-12-30 at 12.12.07.jpeg'),
('Luxury Line', '5 Pieces', 'WhatsApp Image 2025-12-30 at 12.12.08.jpeg'),
('New Arrivals', '10 Pieces', 'aaaaaaa.jpeg');

-- Insert Initial Products (Mapping collection titles to IDs in a real scenario)
-- For now, just inserting the raw product data
INSERT INTO products (name, description, image_path, tag) VALUES
('Vibrant Heritage Kimono', 'Bold red and green African print with geometric patterns', 'WhatsApp Image 2025-12-30 at 12.12.45.jpeg', 'New'),
('Sunset Blaze Kimono', 'Striking red batik design with intricate circle motifs', 'WhatsApp Image 2025-12-30 at 12.12.46.jpeg', 'Popular'),
('Rainbow Fusion Kimono', 'Multi-colored traditional print in vibrant earthy tones', 'WhatsApp Image 2025-12-30 at 12.12.4jj.jpeg', NULL),
('Classic XO Print Kimono', 'Black and red XO pattern with elegant striped borders', 'WhatsApp Image 2025-12-30 at 12.12.411.jpeg', 'Bestseller'),
('Ocean Wave Kimono', 'Serene blue and white wave patterns with floral accents', 'WhatsApp Image 2025-12-30 at 12.12.47.jpeg', NULL),
('Royal Purple Elegance', 'Regal purple design with traditional African motifs', 'WhatsApp Image 2025-12-30 at 12.12.48jnk.jpeg', 'Limited'),
('Tropical Garden Kimono', 'Lush green and gold botanical print design', 'WhatsApp Image 2025-12-30 at 12.12.4j.jpeg', NULL),
('Earthy Tribal Kimono', 'Warm earth tones with classic tribal patterns', 'WhatsApp Image 2025-12-30 at 12.12.43.jpeg', NULL);
