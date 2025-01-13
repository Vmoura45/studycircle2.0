/// <reference types="vite/client" />

interface Window {
  notificationSubscription?: import('@supabase/supabase-js').RealtimeChannel;
}