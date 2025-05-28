import React, { useEffect, useRef, RefObject } from 'react';
import {
  createChart,
  ColorType,
  createSeriesMarkers,
  CandlestickSeries,
  LineSeries,
  SeriesMarker,
  UTCTimestamp,
} from 'lightweight-charts';

interface CandleChartWithDotsProps {
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    candleStickData?: any[];
    tweets?: any;
  };
  candlestickdata?: any; // Replace with actual type if available
  tweets?: any; // Replace with actual type if available
}

const CandleChartWithDots: React.FC<CandleChartWithDotsProps> = ({
  colors = {},
  candlestickdata,
  tweets
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

    /*const lineSeries = chart.addSeries(LineSeries, {
      priceScaleId: 'left',
      color: lineColor,
      lineWidth: 1,
    });*/

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      priceScaleId: 'right',
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const convertedData = candlestickdata.map((dataPoint: any) => ({
      ...dataPoint,
      time: Math.floor(dataPoint.time / 1000) as UTCTimestamp // Convert ms to seconds
    }));
   //lineSeries.setData(sentimentRating);
    candlestickSeries.setData(convertedData);

    candlestickSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.3, bottom: 0.25 },
    });
    candlestickSeries.applyOptions({
      lastValueVisible: false,
      priceLineVisible: false,
    });
   /* lineSeries.applyOptions({
      lastValueVisible: false,
      priceLineVisible: false,
    });*/
    createSeriesMarkers(candlestickSeries, createMarkersForTweets(tweets));

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

function createMarkersForTweets(tweets: any[]): any[] {
    const markers: SeriesMarker<UTCTimestamp>[] = []

    tweets.forEach((tweet) => {
      const timeStamp = new Date(tweet.time).getTime();

      if (tweet.sentimentRating !== undefined && (tweet.sentimentRating <= 3 || tweet.sentimentRating >= 7)) {
        markers.push({
          time: Math.floor(timeStamp/1000) as UTCTimestamp, // Assuming tweet.time is in BusinessDay format
          position: tweet.sentimentRating as number <= 3 ? 'belowBar' : 'aboveBar',
          color: tweet.sentimentRating as number <= 3 ? '#ff0000' : '#00ff00', // Red for negative sentiment, green for positive
          shape: 'circle',
          size: 1,
     });
    }
  });
  
  markers.sort((a, b) => (a.time as UTCTimestamp) - (b.time as UTCTimestamp));
  return markers;
}