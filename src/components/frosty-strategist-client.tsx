'use client';

import { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import type { 
  Section, EventKey, EventData, ItemCounts, ToggleStates, CustomEvents, 
  PointsHistoryEntry, AccessibilitySettings, UserStats, Achievements, BudgetStrategy 
} from '@/lib/types';
import { eventData, achievementsData } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { getSnipingSuggestions, getStrategyRecommendations } from '@/app/actions';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';

import AnalyticsHub from './analytics-hub';
import AiOptimizer from './ai-optimizer';
import ProgressTracker from './progress-tracker';
import { AiSmartSnipingSuggestionsOutput } from '@/ai/flows/ai-smart-sniping-suggestions';
import { PersonalizedEventStrategyOutput } from '@/ai/flows/ai-personalized-event-strategy';


// Main Component
export default function FrostyStrategistClient() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // State
  const [currentSection, setCurrentSection] = useState<Section>('calculator');
  const [currentEvent, setCurrentEvent] = useState<EventKey>('koi');
  const [itemCounts, setItemCounts] = useState<ItemCounts>({});
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});
  const [customEvents, setCustomEvents] = useState<CustomEvents>({});
  
  const [snipingEnabled, setSnipingEnabled] = useState(false);
  const [troopsEnabled, setTroopsEnabled] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(false);
  const [roiEnabled, setRoiEnabled] = useState(false);
  const [recommendationsEnabled, setRecommendationsEnabled] = useState(false);

  const [totalPoints, setTotalPoints] = useState(0);

  // Sniping State
  const [targetGap, setTargetGap] = useState(0);
  const [budgetStrategy, setBudgetStrategy] = useState<BudgetStrategy>('efficient');
  const [minShards, setMinShards] = useState(1);
  const [snipingResult, setSnipingResult] = useState<AiSmartSnipingSuggestionsOutput | null>(null);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<PersonalizedEventStrategyOutput | null>(null);
  
  // Troop State
  const [troopLevel, setTroopLevel] = useState<number | undefined>();
  const [troopTime, setTroopTime] = useState<number | undefined>();
  const [troopSpeedups, setTroopSpeedups] = useState<number | undefined>();

  // Custom Event State
  const [customEventName, setCustomEventName] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPoints, setCustomItemPoints] = useState('');

  // Timer State
  const [eventEndTime, setEventEndTime] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [timeProgress, setTimeProgress] = useState(0);

  // History State
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);

  // Accessibility State
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    largeText: false, extraLargeText: false, highContrast: false, reducedMotion: false
  });
  
  // Stats & Achievements
  const [userStats, setUserStats] = useState<UserStats>({
    totalEvents: 0, totalPoints: 0, sessionsThisMonth: 0, firstUse: null,
    lastUse: null, bestEfficiency: 0, eventsMastered: []
  });
  const [achievements, setAchievements] = useState<Achievements>(achievementsData);

  const [isMounted, setIsMounted] = useState(false);

  // Data
  const currentEventData = useMemo(() => {
    if (currentEvent === 'custom') {
      return customEvents[customEventName] || eventData.custom;
    }
    const data = JSON.parse(JSON.stringify(eventData[currentEvent])) as EventData;
    
    Object.keys(data.items).forEach(itemName => {
        const item = data.items[itemName];
        if (item.toggle) {
            const toggleKey = `${currentEvent}-${item.toggle}`;
            item.available = toggleStates[toggleKey] ?? item.available;
        }
    });

    return data;
  }, [currentEvent, customEvents, customEventName, toggleStates]);


  // Effects
  useEffect(() => {
    setIsMounted(true);
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (isMounted) {
      saveToStorage();
    }
  }, [
    currentSection, currentEvent, itemCounts, toggleStates, customEvents, snipingEnabled, troopsEnabled, 
    timerEnabled, historyEnabled, roiEnabled, recommendationsEnabled, pointsHistory, accessibilitySettings,
    userStats, achievements
  ]);

  useEffect(() => {
    calculateTotal();
  }, [itemCounts, troopsEnabled, troopLevel, troopTime, troopSpeedups, currentEventData]);

  useEffect(() => {
    if(recommendationsEnabled) {
      handleGenerateRecommendations();
    }
  }, [recommendationsEnabled, totalPoints, itemCounts, timeLeft])

  useEffect(() => {
    handleCalculateSniping();
  }, [targetGap, budgetStrategy, minShards, currentEventData]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerEnabled && eventEndTime) {
        interval = setInterval(updateTimer, 1000);
    }
    return () => {
        if(interval) clearInterval(interval);
    };
  }, [timerEnabled, eventEndTime]);

  // Functions
  const loadFromStorage = () => {
    try {
      const data = JSON.parse(localStorage.getItem('frostyStrategist') || '{}');
      if (Object.keys(data).length > 0) {
        setCurrentSection(data.currentSection || 'calculator');
        setCurrentEvent(data.currentEvent || 'koi');
        setItemCounts(data.itemCounts || {});
        setToggleStates(data.toggleStates || {});
        setCustomEvents(data.customEvents || {});
        setSnipingEnabled(data.snipingEnabled || false);
        setTroopsEnabled(data.troopsEnabled || false);
        setTimerEnabled(data.timerEnabled || false);
        setHistoryEnabled(data.historyEnabled || false);
        setRoiEnabled(data.roiEnabled || false);
        setRecommendationsEnabled(data.recommendationsEnabled || false);
        setPointsHistory(data.pointsHistory || []);
        setAccessibilitySettings(data.accessibilitySettings || { largeText: false, extraLargeText: false, highContrast: false, reducedMotion: false });
        setUserStats(data.userStats || { totalEvents: 0, totalPoints: 0, sessionsThisMonth: 0, firstUse: null, lastUse: null, bestEfficiency: 0, eventsMastered: [] });
        setAchievements(data.achievements || achievementsData);
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
  };

  const saveToStorage = () => {
    try {
      const data = {
        currentSection, currentEvent, itemCounts, toggleStates, customEvents, snipingEnabled, troopsEnabled,
        timerEnabled, historyEnabled, roiEnabled, recommendationsEnabled, pointsHistory, accessibilitySettings,
        userStats, achievements
      };
      localStorage.setItem('frostyStrategist', JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to storage", e);
    }
  };

  const calculateTotal = useCallback(() => {
    let total = 0;
    const data = currentEventData;

    Object.entries(data.items).forEach(([itemName, itemData]) => {
      if (itemData.available) {
        const inputKey = `${currentEvent}-${itemName}`;
        const count = itemCounts[inputKey] || 0;
        total += count * itemData.points;
      }
    });

    if (data.specialCalculations) {
      Object.entries(data.specialCalculations).forEach(([key, calc]) => {
        const inputKey = `${currentEvent}-special-${key}`;
        const count = itemCounts[inputKey] || 0;
        total += count * calc.points;
      });
    }

    if (troopsEnabled && Object.keys(data.troops).length > 0) {
      if (troopLevel && troopTime && troopSpeedups) {
        const pointsPerTroop = data.troops[troopLevel];
        const maxTroops = Math.floor(troopSpeedups / troopTime);
        total += maxTroops * pointsPerTroop;
      }
    }
    
    setTotalPoints(total);
  }, [currentEvent, itemCounts, currentEventData, troopsEnabled, troopLevel, troopTime, troopSpeedups]);


  const handleItemCountChange = (itemName: string, value: string) => {
    const itemData = currentEventData.items[itemName];
    let numValue = parseInt(value) || 0;

    if (itemData?.minAmount && numValue > 0 && numValue < itemData.minAmount) {
      numValue = itemData.minAmount;
    }
    
    const key = `${currentEvent}-${itemName}`;
    setItemCounts(prev => ({...prev, [key]: numValue}));
  };

  const handleToggleChange = (toggleId: string) => {
    const key = `${currentEvent}-${toggleId}`;
    setToggleStates(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleAccessibilityChange = (setting: keyof AccessibilitySettings) => {
    setAccessibilitySettings(prev => {
        const newState = { ...prev, [setting]: !prev[setting] };
        if (setting === 'largeText' && newState.largeText) newState.extraLargeText = false;
        if (setting === 'extraLargeText' && newState.extraLargeText) newState.largeText = false;
        return newState;
    });
  };

  const handleCalculateSniping = () => {
    if (!snipingEnabled || targetGap <= 0) {
      setSnipingResult(null);
      return;
    }

    startTransition(async () => {
      const result = await getSnipingSuggestions({
        eventData: currentEventData.items,
        targetGap,
        budgetStrategy,
        minShards
      });

      if (result.success) {
        setSnipingResult(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: result.error,
        });
        setSnipingResult(null);
      }
    });
  };

  const handleGenerateRecommendations = () => {
    if (!recommendationsEnabled) {
      setRecommendations(null);
      return;
    }
    
    startTransition(async () => {
        const availableResources = Object.entries(itemCounts)
            .filter(([key, value]) => key.startsWith(currentEvent) && value > 0)
            .map(([key, value]) => `${key.split('-')[1]}: ${value}`)
            .join(', ');

        const result = await getStrategyRecommendations({
            event: currentEventData.title,
            availableResources: availableResources || 'None specified',
            currentScore: totalPoints,
            timeRemaining: timeLeft || 'Not set',
            spendingStyle: 'balanced' // Placeholder for now
        });

        if (result.success) {
            setRecommendations(result.data);
        } else {
            toast({
                variant: "destructive",
                title: "AI Error",
                description: result.error,
            });
            setRecommendations(null);
        }
    });
  };

  const updateTimer = () => {
    if (!eventEndTime) return;
    const now = new Date().getTime();
    const end = new Date(eventEndTime).getTime();
    const distance = end - now;

    const totalDuration = end - (new Date().getTime() - (timeLeft ? parseTime(timeLeft) * 1000 : 0));
    const progress = Math.max(0, 100 - (distance / totalDuration) * 100);
    setTimeProgress(progress);

    if (distance < 0) {
      setTimeLeft("Event Ended");
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  const parseTime = (timeStr: string) => {
    const parts = timeStr.match(/(\d+)d (\d+)h (\d+)m (\d+)s/);
    if (!parts) return 0;
    return parseInt(parts[1]) * 86400 + parseInt(parts[2]) * 3600 + parseInt(parts[3]) * 60 + parseInt(parts[4]);
  };
  
  const getEfficiencyBadge = (points: number) => {
      if (points <= 100) return { text: 'Expensive', className: 'bg-red-500/20 text-red-400 border-red-500/50' };
      if (points <= 1500) return { text: 'Medium', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' };
      if (points <= 10000) return { text: 'Good', className: 'bg-blue-500/20 text-blue-400 border-blue-500/50' };
      return { text: 'Efficient', className: 'bg-green-500/20 text-green-400 border-green-500/50' };
  };

  const calculateItemROI = (points: number) => {
      const maxPoints = 50000;
      return Math.min(100, Math.floor((points / maxPoints) * 100));
  };
  
  if (!isMounted) {
    return <div className="flex justify-center items-center h-screen">Loading Stratagems...</div>;
  }

  const mainToggles = [
    { id: 'sniping', label: 'Smart Sniping', icon: Icons.target, enabled: snipingEnabled, setEnabled: setSnipingEnabled },
    { id: 'troops', label: 'Troop Training', icon: Icons.helmet, enabled: troopsEnabled, setEnabled: setTroopsEnabled, hidden: currentEvent === 'armament-tomes' || currentEvent === 'armament-design' },
    { id: 'timer', label: 'Event Timer', icon: Icons.clock, enabled: timerEnabled, setEnabled: setTimerEnabled },
    { id: 'history', label: 'Points History', icon: Icons.barChart, enabled: historyEnabled, setEnabled: setHistoryEnabled },
    { id: 'roi', label: 'ROI Analysis', icon: Icons.coins, enabled: roiEnabled, setEnabled: setRoiEnabled },
    { id: 'recommendations', label: 'AI Suggestions', icon: Icons.bot, enabled: recommendationsEnabled, setEnabled: setRecommendationsEnabled },
  ];

  return (
    <TooltipProvider>
      <div className={`space-y-6 md:space-y-8 ${Object.entries(accessibilitySettings).filter(([,v]) => v).map(([k]) => k).join(' ')}`}>
        <header className="text-center p-6 md:p-8 bg-gradient-to-br from-background to-primary rounded-lg shadow-2xl relative">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Icons.swords className="w-8 h-8" />
            Frosty Strategist
            <span className="text-xs align-super font-bold px-3 py-1 rounded-full bg-gradient-to-r from-chart-4 to-chart-5 text-black">PRO</span>
          </h1>
          <p className="text-muted-foreground mt-2">AI-Powered Resource Optimization for Whiteout Survival</p>
          <div className="mt-4 text-sm bg-yellow-400/10 border border-yellow-400/50 text-yellow-300 rounded-lg p-3 max-w-md mx-auto">
            <p>Advanced features unlock new strategies! Support development with <span className="font-bold">Froststars</span> in-game!</p>
            <p className="font-bold mt-1">Player ID: 176435188 🎁</p>
          </div>
        </header>

        <Tabs value={currentSection} onValueChange={(val) => setCurrentSection(val as Section)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="calculator"><Icons.barChart className="mr-2" />Event Calculator</TabsTrigger>
                <TabsTrigger value="analytics" className="text-primary-foreground/70"><Icons.trendingUp className="mr-2" />Analytics Hub</TabsTrigger>
                <TabsTrigger value="optimizer" className="text-primary-foreground/70"><Icons.bot className="mr-2" />AI Optimizer</TabsTrigger>
                <TabsTrigger value="achievements" className="text-primary-foreground/70"><Icons.trophy className="mr-2" />Progress Tracker</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <Card>
                <CardHeader>
                  <Tabs value={currentEvent} onValueChange={(val) => setCurrentEvent(val as EventKey)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                        {Object.keys(eventData).map(key => {
                            const title = eventData[key as EventKey].title;
                            const icon = title.split(' ')[0];
                            const name = title.split(' ').slice(1).join(' ');
                            return <TabsTrigger key={key} value={key}>{icon} {name}</TabsTrigger>
                        })}
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-2">{currentEventData.title}</h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainToggles.filter(t => !t.hidden).map(toggle => (
                        <Label key={toggle.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg border cursor-pointer hover:border-primary transition-colors">
                            <toggle.icon className="w-5 h-5 text-accent" />
                            <span className="flex-grow">{toggle.label}</span>
                            <Switch checked={toggle.enabled} onCheckedChange={toggle.setEnabled} />
                        </Label>
                    ))}
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="advanced-options">
                        <AccordionTrigger className="text-lg font-semibold"><Icons.settings className="mr-2" />Advanced Options & Settings</AccordionTrigger>
                        <AccordionContent className="p-4 bg-secondary rounded-b-lg">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3 text-primary">Event-Specific Options</h4>
                                    <div className="space-y-3">
                                      {currentEventData.toggles.length > 0 ? currentEventData.toggles.map(toggle => (
                                          <Label key={toggle.id} className="flex items-center gap-3">
                                              <Switch checked={!!toggleStates[`${currentEvent}-${toggle.id}`]} onCheckedChange={() => handleToggleChange(toggle.id)} />
                                              <Tooltip>
                                                  <TooltipTrigger asChild><span className="flex items-center gap-1">{toggle.label} <Icons.info className="w-3 h-3" /></span></TooltipTrigger>
                                                  <TooltipContent><p>{toggle.tooltip}</p></TooltipContent>
                                              </Tooltip>
                                          </Label>
                                      )) : <p className="text-sm text-muted-foreground">No specific options for this event.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3 text-primary">Accessibility</h4>
                                    <div className="space-y-3">
                                        {Object.entries({largeText: 'Large Text', extraLargeText: 'Extra Large Text', highContrast: 'High Contrast', reducedMotion: 'Reduce Motion'}).map(([key, label]) => (
                                            <Label key={key} className="flex items-center gap-3">
                                                <Switch checked={accessibilitySettings[key as keyof AccessibilitySettings]} onCheckedChange={() => handleAccessibilityChange(key as keyof AccessibilitySettings)} />
                                                <span>{label}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  {recommendationsEnabled && (
                    <Card className="border-accent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-accent"><Icons.bot /> AI Strategic Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isPending && !recommendations ? <p>Generating recommendations...</p> : null}
                          {recommendations ? <p>{recommendations.recommendations}</p> : <p className="text-muted-foreground text-sm">AI will provide tips here based on your inputs.</p>}
                        </CardContent>
                    </Card>
                  )}

                  <div className="grid lg:grid-cols-2 gap-6 items-start">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(currentEventData.items).map(([name, data]) => (
                          <Card key={name} className={`transition-opacity ${data.available ? 'opacity-100' : 'opacity-50'}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold flex justify-between items-center">
                                    <span>{name}</span>
                                    <span className="text-sm font-bold text-accent">{data.points.toLocaleString()} pts</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input 
                                  type="number" 
                                  placeholder={data.minAmount ? `Min: ${data.minAmount}` : 'Quantity'}
                                  min={data.minAmount || 0}
                                  step={data.minAmount || 1}
                                  value={itemCounts[`${currentEvent}-${name}`] || ''}
                                  onChange={(e) => handleItemCountChange(name, e.target.value)}
                                  disabled={!data.available}
                                />
                                {roiEnabled && data.available && (
                                    <div className="mt-2 space-y-1 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span>ROI</span>
                                            <span>{calculateItemROI(data.points)}%</span>
                                        </div>
                                        <Progress value={calculateItemROI(data.points)} className="h-1" />
                                    </div>
                                )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      {troopsEnabled && Object.keys(currentEventData.troops).length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Icons.helmet /> Troop Training</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="troop-level">Troop Level</Label>
                                    <Select value={troopLevel?.toString()} onValueChange={(v) => setTroopLevel(parseInt(v))}>
                                        <SelectTrigger id="troop-level"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(currentEventData.troops).map(level => <SelectItem key={level} value={level}>Level {level}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                  <Label htmlFor="troop-time">Time/Troop (s)</Label>
                                  <Input id="troop-time" type="number" placeholder="e.g. 1800" value={troopTime || ''} onChange={e => setTroopTime(parseInt(e.target.value))} />
                                </div>
                                <div>
                                  <Label htmlFor="troop-speedups">Speedups (s)</Label>
                                  <Input id="troop-speedups" type="number" placeholder="Total seconds" value={troopSpeedups || ''} onChange={e => setTroopSpeedups(parseInt(e.target.value))} />
                                </div>
                              </div>
                              {troopLevel && troopTime && troopSpeedups ? (
                                <div className="text-sm p-3 bg-secondary rounded-lg">
                                  <p>Max Trainable: <span className="font-bold text-accent">{Math.floor(troopSpeedups/troopTime).toLocaleString()} troops</span></p>
                                  <p>Points from Troops: <span className="font-bold text-accent">{ (Math.floor(troopSpeedups/troopTime) * currentEventData.troops[troopLevel]).toLocaleString() }</span></p>
                                </div>
                              ) : <p className="text-xs text-muted-foreground text-center pt-2">Fill all fields to calculate troop points.</p>}
                          </CardContent>
                        </Card>
                      )}
                      {snipingEnabled && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2"><Icons.target /> Smart Sniping</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="target-gap">Target Point Gap</Label>
                                        <Input id="target-gap" type="number" placeholder="Points needed" value={targetGap || ''} onChange={e => setTargetGap(parseInt(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label htmlFor="budget-strategy">Budget Strategy</Label>
                                        <Select value={budgetStrategy} onValueChange={(v) => setBudgetStrategy(v as BudgetStrategy)}>
                                            <SelectTrigger id="budget-strategy"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="efficient">Most Efficient</SelectItem>
                                                <SelectItem value="quick">Quick Results</SelectItem>
                                                <SelectItem value="balanced">Balanced Approach</SelectItem>
                                                <SelectItem value="premium">Premium Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                  <Label htmlFor="min-shards">Min General Shards</Label>
                                  <Select value={minShards.toString()} onValueChange={(v) => setMinShards(parseInt(v))}>
                                      <SelectTrigger id="min-shards"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="1">Any Amount</SelectItem>
                                          <SelectItem value="5">5 minimum</SelectItem>
                                          <SelectItem value="10">10 minimum</SelectItem>
                                          <SelectItem value="40">40 minimum</SelectItem>
                                          <SelectItem value="100">100 minimum</SelectItem>
                                      </SelectContent>
                                  </Select>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg min-h-[100px]">
                                    {isPending && !snipingResult ? <p>Thinking...</p> : null}
                                    {snipingResult && snipingResult.length > 0 ? (
                                        <ul className="space-y-2 text-sm">
                                            {snipingResult.map((item, i) => (
                                                <li key={i}><strong>{item.quantity}x {item.item}</strong> = {item.points.toLocaleString()} pts</li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-xs text-muted-foreground text-center pt-2">AI suggestions will appear here.</p>}
                                </div>
                            </CardContent>
                          </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
                <AnalyticsHub userStats={userStats}/>
            </TabsContent>
            <TabsContent value="optimizer" className="mt-6">
                <AiOptimizer />
            </TabsContent>
            <TabsContent value="achievements" className="mt-6">
                <ProgressTracker achievements={achievements} userStats={userStats} />
            </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 mt-6 md:mt-8 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="bg-primary/80 backdrop-blur-sm border border-border rounded-lg shadow-2xl p-4 text-center">
            <p className="text-sm text-primary-foreground/80">Total Event Points</p>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">{totalPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
