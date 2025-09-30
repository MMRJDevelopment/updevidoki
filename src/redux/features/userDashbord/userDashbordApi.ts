import { baseApi } from "../../api/baseApi";

const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashbordOverview: builder.query({
      query: () => ({
        url: "/memories/dashboard/counts/user",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserMemorials: builder.query({
      query: ({ page, limit }) => ({
        url: "/memories/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["user", "memorials"],
    }),
    getMyMemorials: builder.query({
      query: ({ page, limit }) => ({
        url: "/memories/my-memories",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["user", "memorials"],
    }),

    getSingleMemorial: builder.query({
      query: (id) => ({
        url: `/memories/${id}`,
        method: "GET",
      }),
      providesTags: ["user", "memorials"],
    }),
    updateUserInfo: builder.mutation({
      query: (data) => {
        return {
          url: `/users/update-user`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateMemorial: builder.mutation({
      query: ({ id, formData }) => {
        if (id) {
          formData.append("id", id);
        }
        console.log(id, formData.get("id"));

        return {
          url: `/memories/update/${id}`, // if backend expects id in URL
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["user", "memorials"],
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
  useGetUserDashbordOverviewQuery,
  useGetUserMemorialsQuery,
  useGetSingleMemorialQuery,
  useUpdateMemorialMutation,
  useUpdateUserInfoMutation,
  useGetMyMemorialsQuery,

  useCreateExampleMutation,
  useUpdateExampleMutation,
  useDeleteExampleMutation,
} = userDashboardApi;
