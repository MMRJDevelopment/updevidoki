/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Post {
  json(): unknown;
  success: any;
  id: string;
  userId: string;
  orderNo: string;
  fullName: string;
  bio: string;
  relation: string;
  city: string;
  country: string;
  privacy: "PUBLIC" | "PRIVATE"; // you can extend if there are more options
  profilePhoto: string;
  coverPhoto: string;
  qrCode: string; // base64 data URL
  photos: string[];
  videos: string[];
  dateOfBirth: string; // ISO date string
  dateOfDeath: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
// ========================================
// lib/api.ts - API Functions
// ========================================

// GET: Fetch all posts
export async function fetchPosts(): Promise<any> {
  const token = localStorage.getItem("access_token") || "";
  const query = new URLSearchParams({ page: "1", limit: "10" }).toString();
  const res = await fetch(
    `${NEXT_PUBLIC_BASE_URL}/memories/my-memories?${query}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

// POST: Create new post
export async function createMemory(formData: FormData): Promise<any> {
  const token = localStorage.getItem("access_token") || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/memories/create`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to create memory" }));
    throw new Error(error.message || "Failed to create memory");
  }

  return res.json();
}

// PUT: Update post
export async function updatePost(
  id: string,
  formData: FormData
): Promise<Post> {
  const token = localStorage.getItem("access_token") || "";

  const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/memories/update/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ 
      message: "Failed to update post" 
    }));
    throw new Error(error.message || "Failed to update post");
  }

  return res.json();
}

// DELETE: Delete post
export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete post");
}




export async function getMemory(id:string): Promise<any> {
  const token = localStorage.getItem("access_token") || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/memories/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', // or 'force-cache' depending on your needs
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Failed to fetch memory' }));
    throw new Error(error.message || 'Failed to fetch memory');
  }

  return res.json();
}