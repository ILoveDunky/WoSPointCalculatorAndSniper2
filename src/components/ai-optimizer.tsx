'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Icons } from '@/components/icons';

export default function AiOptimizer() {
  return (
    <div className="space-y-6">
       <Card>
          <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Icons.bot />
                AI Optimizer
              </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Let our AI find the absolute best strategy based on your specific constraints and goals. A PRO feature!</p>
            <div className="bg-gradient-to-br from-primary to-background p-6 rounded-lg border border-primary/50 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="budget-range" className="font-semibold mb-2 block">Budget Range (Points)</Label>
                        <Slider defaultValue={[50000]} max={1000000} step={1000} id="budget-range" />
                    </div>
                    <div>
                        <Label htmlFor="time-constraint" className="font-semibold mb-2 block">Time Constraint</Label>
                        <Select>
                            <SelectTrigger id="time-constraint">
                                <SelectValue placeholder="No time limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Time Limit</SelectItem>
                                <SelectItem value="1hour">Next 1 Hour</SelectItem>
                                <SelectItem value="6hours">Next 6 Hours</SelectItem>
                                <SelectItem value="24hours">Next 24 Hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="resource-priority" className="font-semibold mb-2 block">Resource Priority</Label>
                         <Select>
                            <SelectTrigger id="resource-priority">
                                <SelectValue placeholder="Maximum Efficiency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="efficiency">Maximum Efficiency</SelectItem>
                                <SelectItem value="speed">Speed Over Cost</SelectItem>
                                <SelectItem value="conservative">Conservative Spending</SelectItem>
                                <SelectItem value="aggressive">Aggressive Growth</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-chart-4 to-chart-5 text-black font-bold">
                    <Icons.zap className="mr-2" />
                    Optimize Strategy
                </Button>
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Optimization Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Run the optimizer to see your personalized results here.</p>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
       </Card>
    </div>
  );
}
