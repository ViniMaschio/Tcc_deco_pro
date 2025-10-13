import { z } from "zod";

export enum HttpStatusCode {
  ok = 200,
  serverError = 500,
}

export type HttpResponse<T = undefined> = {
  statusCode: HttpStatusCode;
  body: T;
};

export type PaginationProps = {
  currentPage?: number;
  perPage?: number;
  orderKey?: string;
  orderValue?: string;
};

export type PaginationType = {
  count: number;
  perPage: number;
  pagesCount: number;
  currentPage: number;
};

export type PaginationTable = {
  update: boolean;
} & PaginationProps &
  PaginationType;
