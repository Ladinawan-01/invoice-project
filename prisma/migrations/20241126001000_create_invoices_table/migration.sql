-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    bill_to_address TEXT,
    bill_to_city TEXT,
    bill_to_state TEXT,
    bill_to_country TEXT,
    ship_to_name TEXT,
    ship_to_address TEXT,
    ship_to_city TEXT,
    ship_to_state TEXT,
    ship_to_country TEXT,
    invoice_number TEXT NOT NULL,
    invoice_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    prevent_overdue_reminders BOOLEAN DEFAULT FALSE,
    tags JSONB,
    payment_modes JSONB,
    currency TEXT NOT NULL,
    sale_agent TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    discount_type TEXT NOT NULL,
    discount_value DOUBLE PRECISION NOT NULL DEFAULT 0,
    admin_note TEXT,
    quantity_display TEXT NOT NULL,
    adjustment DOUBLE PRECISION NOT NULL DEFAULT 0,
    line_items JSONB NOT NULL,
    client_note TEXT,
    terms TEXT,
    subtotal DOUBLE PRECISION NOT NULL,
    discount_amount DOUBLE PRECISION NOT NULL,
    tax_amount DOUBLE PRECISION NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_number_idx ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS invoices_customer_idx ON invoices(customer_name);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at DESC);

