import { baseApi } from "../../api/baseApi";

const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayments: builder.mutation({
      query: (data) => {
        return {
          url: "/payments/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["payments"],
    }),
    
    
    verifyPayment: builder.query({
      query: (sessionId) => `/payments/verify/${sessionId}`,
      providesTags: ["payments"],
    }),
  }),
});

export const { useCreatePaymentsMutation, useVerifyPaymentQuery } = paymentsApi;
