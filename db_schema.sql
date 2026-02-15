
-- PART 1: Database Schema Design (PostgreSQL)

-- Core User Identities
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'RESTAURANT_ADMIN', 'DRIVER', 'CUSTOMER')),
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurant & Brand Management
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    brand_type TEXT DEFAULT 'INDEPENDENT',
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    rating_average DECIMAL(3,2) DEFAULT 0.0,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branch Support for National Chains
CREATE TABLE restaurant_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    branch_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    township_area TEXT,
    location GEOGRAPHY(POINT, 4326),
    operating_hours JSONB,
    status TEXT DEFAULT 'OPEN'
);

-- Menu Hierarchy
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    name TEXT NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variations (e.g., S/M/L Chips) & Modifiers
CREATE TABLE item_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID REFERENCES menu_items(id),
    size_label TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Orders System
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    restaurant_id UUID REFERENCES restaurants(id),
    branch_id UUID REFERENCES restaurant_branches(id),
    driver_id UUID REFERENCES users(id),
    order_status TEXT NOT NULL DEFAULT 'PENDING',
    food_subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    service_fee DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    driver_payout DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'PENDING',
    payment_method TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ
);

-- INDEX STRATEGY
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_branch_location ON restaurant_branches USING GIST(location);
