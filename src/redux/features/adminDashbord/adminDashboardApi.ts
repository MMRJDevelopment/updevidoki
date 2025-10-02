/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard counts
    getcounts: builder.query({
      query: () => {
        return {
          url: `/dashboard/counts`,
          method: "GET",
        };
      },
      providesTags: ["dashboard"],
    }),
    // get all user dashboard data
    getAllUserDashboardData: builder.query({
      query: ({ page, limit, searchTerm }) => {
        return {
          url: `/users/all`,
          method: "GET",
          params: { page, limit, searchTerm },
        };
      },
      providesTags: ["dashboard"],
    }),
    // all user status management
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => {
        return {
          url: `/users/status/${userId}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["dashboard"],
    }),
    // get single user
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/single/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    // get all orders
    getAllOrders: builder.query({
      query: ({ page, limit, searchTerm }) => {
        return {
          url: `/payments/orders`,
          method: "GET",
          params: { page, limit, searchTerm },
        };
      },
      providesTags: ["orders"],
    }),
    // get all payments
    getAllPayments: builder.query({
      query: ({ page, limit, searchTerm }) => {
        return {
          url: `/payments/orders`,
          method: "GET",
          params: { page, limit, searchTerm },
        };
      },
      providesTags: ["orders"],
    }),

    // ticket and message
    createTicket: builder.mutation({
      query: (data) => {
        return {
          url: `/tokens/create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["tickets"],
    }),

    // get my tickets
    getMyAllTickets: builder.query({
      query: ({ page, limit, id }) => {
        return {
          url: `/tokens/user-tickets/${id}`,
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: ["tickets"],
    }),

    // GET USER TICKET LIST
    getUserTokenList: builder.query({
      query: ({ page, limit, userId }) => {
        return {
          url: `/tokens/user-tickets/${userId}`,
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: ["orders", "user" ,"tickets", "messages" ],
    }),

    // GET ALL TICKET LIST
    getAllUserTokenList: builder.query({
      query: ({ page, limit, status, searchTerm }) => {
        return {
          url: `/tokens`,
          method: "GET",
          params: { page, limit, status, searchTerm },
        };
      },
      providesTags: ["orders"],
    }),

    // get user ticket by id
    getSingleUserTicket: builder.query({
      query: (id) => ({
        url: `/tokens/${id}`,
        method: "GET",
      }),
      providesTags: ["tickets", "messages", "user"],
    }),

    // create messages
    createMassages: builder.mutation({
      query: (data) => {
        return {
          url: `/messages/send`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["messages"],
    }),

    //reply massage
    createMassagesReply: builder.mutation({
      query: (data) => {
        return {
          url: `/tokens/reply-message/${data?.id}`,
          method: "PATCH",
          body: { replyMessage: data?.replyMessage },
        };
      },
      invalidatesTags: ["messages", "tickets", "user"],
    }),

    // update tocken status
    updateTockenStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/tokens/status/${id}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["tickets"],
    }),

    //get conversetion details
    getConversationDetails: builder.query({
      query: ({ id }) => ({
        url: `/tokens/${id}`,
        method: "GET",
      }),
      providesTags: ["messages"],
    }),

    // USER CREATE MEMORIAL
    createUserMemorial: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/memories/create",
        method: "POST",
        body: formData,
        // Browser will automatically set multipart/form-data with boundary
        formData: true,
      }),
      invalidatesTags: ["memorials"],
    }),

    getSingleExample: builder.query({
      query: (id) => ({
        url: `example/${id}`,
        method: "GET",
      }),
      providesTags: ["example"],
    }),

    createExample: builder.mutation({
      query: (data) => {
        return {
          url: "example",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["example"],
    }),

    updateExample: builder.mutation({
      query: (data) => {
        return {
          url: `example/${data?.id}`,
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["example"],
    }),
    deleteExample: builder.mutation({
      query: (id) => {
        return {
          url: `example/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["example"],
    }),
  }),
});

export const {
  useCreateExampleMutation,
  useGetAllUserDashboardDataQuery,
  useUpdateUserStatusMutation,
  useGetSingleUserQuery,
  useGetAllOrdersQuery,
  useGetAllPaymentsQuery,
  useCreateTicketMutation,
  useCreateMassagesMutation,
  useGetMyAllTicketsQuery,
  useGetConversationDetailsQuery,
  useCreateUserMemorialMutation,
  useGetAllUserTokenListQuery,
  useGetSingleUserTicketQuery,
  useGetUserTokenListQuery,
  useCreateMassagesReplyMutation,
  useUpdateTockenStatusMutation,

  useGetSingleExampleQuery,
  useUpdateExampleMutation,
  useDeleteExampleMutation,
  useGetcountsQuery,
} = adminDashboardApi;
