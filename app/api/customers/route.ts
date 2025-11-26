import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all customers
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert snake_case to camelCase for response
    const customers = data.map((item: any) => ({
      id: item.id,
      company: item.company,
      vatNumber: item.vat_number,
      phone: item.phone,
      website: item.website,
      group: item.group,
      currency: item.currency,
      defaultLanguage: item.default_language,
      address: item.address,
      city: item.city,
      state: item.state,
      zipCode: item.zip_code,
      country: item.country,
      billingStreet: item.billing_street,
      billingCity: item.billing_city,
      billingState: item.billing_state,
      billingZipCode: item.billing_zip_code,
      billingCountry: item.billing_country,
      sameAsCustomerInfo: item.same_as_customer_info,
      shippingStreet: item.shipping_street,
      shippingCity: item.shipping_city,
      shippingState: item.shipping_state,
      shippingZipCode: item.shipping_zip_code,
      shippingCountry: item.shipping_country,
      copyBillingAddress: item.copy_billing_address,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))

    return NextResponse.json(customers)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Convert camelCase to snake_case for database
    const dbData = {
      company: body.company,
      vat_number: body.vatNumber,
      phone: body.phone,
      website: body.website,
      group: body.group,
      currency: body.currency,
      default_language: body.defaultLanguage,
      address: body.address,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode,
      country: body.country,
      billing_street: body.billingStreet,
      billing_city: body.billingCity,
      billing_state: body.billingState,
      billing_zip_code: body.billingZipCode,
      billing_country: body.billingCountry,
      same_as_customer_info: body.sameAsCustomerInfo,
      shipping_street: body.shippingStreet,
      shipping_city: body.shippingCity,
      shipping_state: body.shippingState,
      shipping_zip_code: body.shippingZipCode,
      shipping_country: body.shippingCountry,
      copy_billing_address: body.copyBillingAddress,
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert snake_case back to camelCase for response
    const response = {
      id: data.id,
      company: data.company,
      vatNumber: data.vat_number,
      phone: data.phone,
      website: data.website,
      group: data.group,
      currency: data.currency,
      defaultLanguage: data.default_language,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      country: data.country,
      billingStreet: data.billing_street,
      billingCity: data.billing_city,
      billingState: data.billing_state,
      billingZipCode: data.billing_zip_code,
      billingCountry: data.billing_country,
      sameAsCustomerInfo: data.same_as_customer_info,
      shippingStreet: data.shipping_street,
      shippingCity: data.shipping_city,
      shippingState: data.shipping_state,
      shippingZipCode: data.shipping_zip_code,
      shippingCountry: data.shipping_country,
      copyBillingAddress: data.copy_billing_address,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

