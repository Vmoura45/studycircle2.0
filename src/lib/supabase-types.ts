export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          user_type: 'creator' | 'consumer' | 'moderator' | 'admin'
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
      }
      materials: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          material_type: 'image' | 'text' | 'lesson_plan'
          category_id: string
          creator_id: string
          moderation_status: 'pending' | 'approved' | 'rejected'
          moderated_by: string | null
          moderation_note: string | null
          price: number
          created_at: string
          updated_at: string
          avg_rating: number | null
          total_reviews: number
        }
      }
      reviews: {
        Row: {
          id: string
          material_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          material_id: string
          amount: number
          creator_earnings: number
          platform_fee: number
          status: string
          created_at: string
        }
      }
    }
  }
}