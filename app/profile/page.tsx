import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  let username: string | null = null;

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(
          Buffer.from(base64, 'base64').toString('utf-8')
        );
        // Beast backend JWT claims uses `usr` for username
        username = payload.usr || payload.username || payload.sub || null;
      }
    } catch (err) {
      console.error('Failed to parse auth token in ProfilePage:', err);
    }
  }

  // Next.js redirect() throws a NEXT_REDIRECT error internally,
  // so it must always be called outside of try/catch blocks.
  if (username) {
    redirect(`/profile/${username}`);
  }

  // If not authenticated or cannot extract username, redirect to home
  redirect('/');
}
