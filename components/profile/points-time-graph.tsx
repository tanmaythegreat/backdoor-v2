'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { pointsOverTimeQuery } from '@/lib/api/profile/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  points: {
    label: 'Points',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

interface PointsTimeGraphProps {
  username?: string;
}

function PointsTimeGraph({ username }: PointsTimeGraphProps) {
  const { data: chartData } = useSuspenseQuery(pointsOverTimeQuery(username));

  return (
    <Card className="my-4">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = value instanceof Date ? value : new Date(value);
                return isNaN(date.getTime())
                  ? ''
                  : date.toLocaleDateString('en-US', { month: 'short' });
              }}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPoints" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="1%"
                  stopColor="var(--primary)"
                  stopOpacity={0.9}
                />
                <stop offset="80%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              dataKey="points"
              type="linear"
              fill="url(#fillPoints)"
              fillOpacity={0.4}
              stroke="var(--primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PointsTimeGraph;
