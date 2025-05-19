import React, { useEffect, useRef, RefObject } from 'react';
import {
  createChart,
  ColorType,
  createSeriesMarkers,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts';
import { sentimentRating, data, lineMarkers } from './data'; // Adjust the import path as necessary

interface CandleChartWithDotsProps {
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

const CandleChartWithDots: React.FC<CandleChartWithDotsProps> = ({
  colors = {},
}) => {
  const {
    backgroundColor = '#1e1e1e',
    lineColor = '#e0e0e0',
    textColor = '#e0e0e0',
    areaTopColor = '#2962FF',
    areaBottomColor = 'rgba(41, 98, 255, 0.28)',
  } = colors;

  const chartContainerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: { color: '#273746', style: 0 },
        horzLines: { color: '#273746', style: 0 },
      },
      rightPriceScale: { visible: true },
      leftPriceScale: { visible: true },
      crosshair: { mode: 0 },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const lineSeries = chart.addSeries(LineSeries, {
      priceScaleId: 'left',
      color: lineColor,
      lineWidth: 1,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      priceScaleId: 'right',
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    lineSeries.setData(sentimentRating);
    candlestickSeries.setData(data);

    candlestickSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.3, bottom: 0.25 },
    });
    candlestickSeries.applyOptions({
      lastValueVisible: false,
      priceLineVisible: false,
    });
    lineSeries.applyOptions({
      lastValueVisible: false,
      priceLineVisible: false,
    });

    createSeriesMarkers(lineSeries, lineMarkers);

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default CandleChartWithDots;
