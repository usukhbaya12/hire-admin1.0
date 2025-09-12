"use server";

import { getAuthToken } from "@/utils/auth";
import { api } from "@/utils/routes";

export const handlePasswordChange = async (data) => {
  try {
    const token = await getAuthToken();
    let res = await fetch(`${api}user/password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data,
    }).then((d) => d.json());
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export async function imageUploader(images) {
  try {
    const token = await getAuthToken();
    let res = await fetch(`${api}upload`, {
      method: "POST",
      headers: {
        cache: "no-store",
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: images,
    }).then((d) => d.json());
    images.delete("files");
    return res.payload.files;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getFormula = async (id) => {
  try {
    const token = await getAuthToken();
    let res = await fetch(`${api}formule/find/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа",
    };
  }
};

export const createNewFormula = async (data) => {
  try {
    const token = await getAuthToken();
    let res = await fetch(`${api}formule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data,
    }).then((d) => d.json());
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа",
    };
  }
};

export const chargeAccount = async (values) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const body = {
      id: values.id,
      amount: values.amount,
      method: values.method,
      message: values.message || "",
    };

    const res = await fetch(`${api}payment/charge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа",
    };
  }
};

export const createUser = async (userData) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const res = await fetch(`${api}user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    return {
      success: data.succeed,
      message: data.message,
      data: data.payload,
    };
  } catch (error) {
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа",
    };
  }
};

export const getUsers = async ({ limit = 10, page = 1, role } = {}) => {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    if (role) params.append("role", role);

    const res = await fetch(`${api}user?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export async function changeUserRole(userId, newRole) {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const res = await fetch(`${api}user/admin/${userId}/${newRole}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
}

export const getUserPaymentHistory = async (userId, page, limit) => {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const res = await fetch(`${api}payment/view/0/${userId}/${page}/${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Сервертэй холбогдоход алдаа гарлаа" };
  }
};

export const getAssessmentExams = async (
  assessment = 0,
  limit,
  page,
  email = "",
  startDate = null,
  endDate = null
) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const body = {
      assessment: assessment,
      email: email,
      startDate: startDate || null,
      endDate: endDate || null,
    };

    const res = await fetch(`${api}exam/all/${limit}/${page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());

    return {
      data: res.payload,
      total: res.total,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getFeedback = async (type, page, limit) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const response = await fetch(
      `${api}feedback/all/0/${type}/${page}/${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((d) => d.json());

    return {
      data: response.payload,
      token: true,
      message: response?.message,
      status: response?.status,
      success: response.succeed,
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return {
      data: null,
      token: true,
      message: "Сервертэй холбогдоход алдаа гарлаа",
      status: 500,
      success: false,
    };
  }
};

export const getPaymentHistory = async (
  page,
  limit,
  startDate,
  endDate,
  role,
  assessmentId,
  paymentMethod
) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const body = {
      startDate: startDate || null,
      endDate: endDate || null,
      role: role || null,
      assessmentId: assessmentId || null,
      paymentMethod: paymentMethod || null,
    };

    const res = await fetch(`${api}payment/all?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа",
    };
  }
};

export const getBlogs = async (limit = 10, page = 1, type = 0) => {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    if (type && type !== 0) {
      params.append("type", type);
    }

    const res = await fetch(`${api}blog/all?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());

    return {
      data: res.payload?.data,
      count: res.payload?.count,
      total: res.payload?.total,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getBlogById = async (id) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const res = await fetch(`${api}blog/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const createBlog = async (values) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const body = {
      title: values.title,
      image: values.image,
      content: values.content,
      minutes: values.minutes,
      category: values.category,
      pinned: values.pinned,
    };
    const res = await fetch(`${api}blog/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const updateBlogById = async (id, values) => {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const res = await fetch(`${api}blog/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const deleteBlogById = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };
    const res = await fetch(`${api}blog/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getContact = async () => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const res = await fetch(`${api}feedback/contact`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const deleteBarimtById = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };
    const res = await fetch(`${api}userService/ebarimt/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((d) => d.json());

    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const ebarimt = async (serviceId) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const response = await fetch(`${api}userService/ebarimt/${serviceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return {
      data: result.payload,
      token: true,
      message: result.message,
      status: result.status,
      success: result.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const sendEbarimt = async () => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const res = await fetch(`${api}barimt/send`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((d) => d.json());
    return {
      data: res.payload,
      token: true,
      message: res?.message,
      status: res?.status,
      success: res.succeed,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Сервертэй холбогдоход алдаа гарлаа",
    };
  }
};
