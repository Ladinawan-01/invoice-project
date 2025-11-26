-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "company" TEXT,
    "vat_number" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "group" TEXT,
    "currency" TEXT DEFAULT 'EUR',
    "default_language" TEXT DEFAULT 'en',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "country" TEXT,
    "billing_street" TEXT,
    "billing_city" TEXT,
    "billing_state" TEXT,
    "billing_zip_code" TEXT,
    "billing_country" TEXT,
    "same_as_customer_info" BOOLEAN NOT NULL DEFAULT false,
    "shipping_street" TEXT,
    "shipping_city" TEXT,
    "shipping_state" TEXT,
    "shipping_zip_code" TEXT,
    "shipping_country" TEXT,
    "copy_billing_address" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_company_idx" ON "customers"("company");

-- CreateIndex
CREATE INDEX "customers_created_at_idx" ON "customers"("created_at" DESC);

