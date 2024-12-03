import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import type { LanguageKeys } from '@enums/languageKeys';

// 'https://mmsweden-server.onrender.com/'

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export interface IFetchCategoriesOrIndustriesParams {
  lang: LanguageKeys;
  keyword?: string;
}

export interface IFetchManufacturersParams {
  keyword?: string;
}

export const fetchCategories = createAsyncThunk<
  ICategory[],
  IFetchCategoriesOrIndustriesParams,
  { rejectValue: string }
>('categories/fetchCategories', async (params, thunkAPI) => {
  try {
    const response = await axios.get<ICategory[]>('categories/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchManufacturers = createAsyncThunk<
  IManufacturer[],
  IFetchManufacturersParams,
  { rejectValue: string }
>('manufacturers/fetchManufacturers', async (params, thunkAPI) => {
  try {
    const response = await axios.get<IManufacturer[]>('manufacturers/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchIndustries = createAsyncThunk<
  IIndustry[],
  IFetchCategoriesOrIndustriesParams,
  { rejectValue: string }
>('industries/fetchIndustries', async (params, thunkAPI) => {
  try {
    const response = await axios.get<IIndustry[]>('industries/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});