import { ApiError } from '@/core/services';

import {
  AddBlogToSeriesReq,
  CreateSeriesReq,
  GetSeriesRes,
  ListSeriesRes,
  UpdateSeriesReq,
} from '@nest/shared';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SeriesApi } from '../api/series.api';

export const useCreateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation<GetSeriesRes, ApiError, CreateSeriesReq>(
    data => SeriesApi.createSeries(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['series', 'user']);
      },
    }
  );
};

export const useUpdateSeries = (seriesId: string) => {
  const queryClient = useQueryClient();

  return useMutation<GetSeriesRes, ApiError, UpdateSeriesReq>(
    data => SeriesApi.updateSeries(seriesId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['series', seriesId]);
        queryClient.invalidateQueries(['series', 'user']);
      },
    }
  );
};

export const useSeries = (seriesId: string) => {
  return useQuery<GetSeriesRes, ApiError>(
    ['series', seriesId],
    () => SeriesApi.getSeries(seriesId),
    {
      enabled: !!seriesId,
    }
  );
};

export const useUserSeries = () => {
  return useQuery<ListSeriesRes, ApiError>(['series', 'user'], () => SeriesApi.getUserSeries());
};

export const useAddBlogToSeries = (currentSeriesId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { data: AddBlogToSeriesReq; seriesId: string }>(
    ({ data, seriesId }) => SeriesApi.addBlogToSeries(seriesId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['series', currentSeriesId]);
      },
    }
  );
};

export const useRemoveBlogFromSeries = (seriesId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>(
    blogId => SeriesApi.removeBlogFromSeries(seriesId, blogId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['series', seriesId]);
      },
    }
  );
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>(seriesId => SeriesApi.deleteSeries(seriesId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['series', 'user']);
    },
  });
};
