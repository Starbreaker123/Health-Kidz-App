import React, { Suspense, lazy } from 'react';
import { BarChart3 } from 'lucide-react';

// Lazy load Recharts components
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
const Legend = lazy(() => import('recharts').then(module => ({ default: module.Legend })));
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const Pie = lazy(() => import('recharts').then(module => ({ default: module.Pie })));
const Cell = lazy(() => import('recharts').then(module => ({ default: module.Cell })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64 text-gray-500">
    <div className="text-center">
      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p className="text-sm">Loading chart...</p>
    </div>
  </div>
);

export const ChartComponents = {
  LineChart: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <LineChart {...props} />
    </Suspense>
  ),
  Line: (props: any) => (
    <Suspense fallback={null}>
      <Line {...props} />
    </Suspense>
  ),
  XAxis: (props: any) => (
    <Suspense fallback={null}>
      <XAxis {...props} />
    </Suspense>
  ),
  YAxis: (props: any) => (
    <Suspense fallback={null}>
      <YAxis {...props} />
    </Suspense>
  ),
  CartesianGrid: (props: any) => (
    <Suspense fallback={null}>
      <CartesianGrid {...props} />
    </Suspense>
  ),
  Tooltip: (props: any) => (
    <Suspense fallback={null}>
      <Tooltip {...props} />
    </Suspense>
  ),
  ResponsiveContainer: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <ResponsiveContainer {...props} />
    </Suspense>
  ),
  Legend: (props: any) => (
    <Suspense fallback={null}>
      <Legend {...props} />
    </Suspense>
  ),
  PieChart: (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <PieChart {...props} />
    </Suspense>
  ),
  Pie: (props: any) => (
    <Suspense fallback={null}>
      <Pie {...props} />
    </Suspense>
  ),
  Cell: (props: any) => (
    <Suspense fallback={null}>
      <Cell {...props} />
    </Suspense>
  ),
};
