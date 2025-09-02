'use client';
import type { Achievements } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProgressTrackerProps {
    achievements: Achievements;
    userStats: {
      eventsMastered: string[];
    }
}

export default function ProgressTracker({ achievements, userStats }: ProgressTrackerProps) {
  const achievementsList = Object.values(achievements);
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Icons.trophy />
                    Progress Tracker
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">Watch your progress, earn achievements, and become a strategy master.</p>
                 <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                            <Icons.flame className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0 Days</div>
                            <p className="text-xs text-muted-foreground">Log in tomorrow to extend!</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Efficiency Improvement</CardTitle>
                            <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+0%</div>
                            <p className="text-xs text-muted-foreground">Compared to your first use</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Events Mastered</CardTitle>
                            <Icons.star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userStats.eventsMastered.length} / 6</div>
                            <p className="text-xs text-muted-foreground">Try a new event type</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>🏅 Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TooltipProvider>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {achievementsList.map(ach => (
                                    <Tooltip key={ach.id}>
                                        <TooltipTrigger asChild>
                                            <div className={`flex flex-col items-center justify-center p-4 rounded-lg border aspect-square ${ach.unlocked ? 'border-accent bg-accent/20' : 'bg-secondary'}`}>
                                                <div className={`text-4xl transition-transform duration-300 ${ach.unlocked ? 'grayscale-0' : 'grayscale'}`}>{ach.icon}</div>
                                                <p className={`mt-2 text-sm font-semibold text-center ${ach.unlocked ? 'text-accent-foreground' : 'text-muted-foreground'}`}>{ach.title}</p>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{ach.description}</p>
                                            <p className="text-xs text-muted-foreground">Progress: {ach.progress} / {ach.target}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    </div>
  );
}
