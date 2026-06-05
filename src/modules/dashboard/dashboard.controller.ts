// dashboard.controller.ts

import type { Request, Response } from 'express';

import * as dashboardService from './dashboard.service';

import type {
  DashboardRange,
} from './dashboard.type';

export const getFinanceChart = async (
  req: Request,
  res: Response
) => {
  const range =
    (req.query.range as DashboardRange | undefined) ??
    '6months';

  const data = await dashboardService.getFinanceChart(range);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getDonationChart = async (
  req: Request,
  res: Response
) => {
  const range =
    (req.query.range as DashboardRange | undefined) ??
    '6months';

  const data = await dashboardService.getDonationChart(range);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getDashboardStats = async (
  _req: Request,
  res: Response
) => {
  const data = await dashboardService.getDashboardStats();

  return res.status(200).json({
    success: true,
    data,
  });
};
export const getCongregationChart = async (
  req: Request,
  res: Response
) => {
  const range =
    (req.query.range as DashboardRange | undefined) ??
    '1year';

  const data =
    await dashboardService.getCongregationChart(range);

  return res.status(200).json({
    success: true,
    data,
  });
};
export const getZisChart = async (
  req: Request,
  res: Response
) => {
  const range =
    (req.query.range as DashboardRange | undefined) ??
    '6months';

  const data =
    await dashboardService.getZisChart(range);

  return res.status(200).json({
    success: true,
    data,
  });
};
export const getDonationChart = async (
  req: Request,
  res: Response
) => {
  const range =
    (req.query.range as DashboardRange | undefined) ??
    '6months';

  const data =
    await dashboardService.getDonationChart(
      range
    );

  return res.status(200).json({
    success: true,
    data,
  });
};