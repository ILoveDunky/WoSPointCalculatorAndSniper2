'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

interface AnalyticsHubProps {
    userStats: {
        totalEvents: number;
        totalPoints: number;
        bestEfficiency: number;
    }
}

export default function AnalyticsHub({ userStats }: AnalyticsHubProps) {
  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Icons.trendingUp />
                Analytics Hub
              </CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground mb-6">Track your performance and optimize your strategies over time.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events Calculated</CardTitle>
                        <Icons.calendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.totalEvents}</div>
                        <p className="text-xs text-muted-foreground">Total sessions recorded</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Points Optimized</CardTitle>
                        <Icons.target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Highest calculated score</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Efficiency</CardTitle>
                        <Icons.zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.bestEfficiency}%</div>
                        <p className="text-xs text-muted-foreground">Peak ROI achieved</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Strategy</CardTitle>
                        <Icons.brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Efficient</div>
                        <p className="text-xs text-muted-foreground">Your most used approach</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Use the calculator to generate personalized insights about your event strategies. The more you use it, the smarter it gets!</p>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
