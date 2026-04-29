export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          country: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          country?: string | null
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          country?: string | null
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string | null
          name: string
          slug: string
          description: string | null
          tagline: string | null
          concentration: 'EDC' | 'EDT' | 'EDP' | 'Parfum' | null
          gender: 'masculino' | 'femenino' | 'unisex' | null
          olfactory_family: string | null
          notes_top: string[] | null
          notes_heart: string[] | null
          notes_base: string[] | null
          images: string[] | null
          is_active: boolean
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          brand_id?: string | null
          name: string
          slug: string
          description?: string | null
          tagline?: string | null
          concentration?: 'EDC' | 'EDT' | 'EDP' | 'Parfum' | null
          gender?: 'masculino' | 'femenino' | 'unisex' | null
          olfactory_family?: string | null
          notes_top?: string[] | null
          notes_heart?: string[] | null
          notes_base?: string[] | null
          images?: string[] | null
          is_active?: boolean
          is_featured?: boolean
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size_ml: number
          price: number
          stock: number
          sku: string | null
          stripe_price_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size_ml: number
          price: number
          stock?: number
          sku?: string | null
          stripe_price_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          stripe_session_id: string | null
          stripe_payment_intent: string | null
          shipping_address: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          stripe_session_id?: string | null
          stripe_payment_intent?: string | null
          shipping_address?: Json | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          variant_id: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          variant_id: string
          quantity: number
          unit_price: number
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          is_verified?: boolean
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      wishlist: {
        Row: {
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      user_role: 'customer' | 'admin'
      concentration: 'EDC' | 'EDT' | 'EDP' | 'Parfum'
      gender: 'masculino' | 'femenino' | 'unisex'
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Brand = Database['public']['Tables']['brands']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type OrderStatus = Database['public']['Enums']['order_status']
