import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch single customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pathId = request.nextUrl.pathname.split('/').pop()
    const rawId = params?.id ?? pathId ?? ''
    const id = rawId.trim()

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert snake_case to camelCase
    const customer = {
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

    return NextResponse.json(customer)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pathId = request.nextUrl.pathname.split('/').pop()
    const rawId = params?.id ?? pathId ?? ''
    const id = rawId.trim()

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }
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
      .update(dbData)
      .eq('id', id)
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

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pathId = request.nextUrl.pathname.split('/').pop()
    const rawId = params?.id ?? pathId ?? ''
    const id = rawId.trim()

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }
    const supabase = await createClient()

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

