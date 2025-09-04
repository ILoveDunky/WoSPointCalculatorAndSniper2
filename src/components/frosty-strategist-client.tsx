
'use client';

import { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import type { 
  Section, EventKey, EventData, ItemCounts, ToggleStates, CustomEvents, 
  PointsHistoryEntry, AccessibilitySettings, UserStats, Achievements, BudgetStrategy, TroopEvent, TroopTimeOption
} from '@/lib/types';
import { eventData, achievementsData, troopTimeOptions } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { getSnipingSuggestions } from '@/app/actions';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/components/icons';

import AnalyticsHub from './analytics-hub';
import AiOptimizer from './ai-optimizer';
import ProgressTracker from './progress-tracker';
import { AiSmartSnipingSuggestionsOutput } from '@/ai/flows/ai-smart-sniping-suggestions';


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
  const [historyEnabled, setHistoryEnabled] = useState(false);
  
  const [totalPoints, setTotalPoints] = useState(0);

  // Sniping State
  const [targetGap, setTargetGap] = useState(0);
  const [budgetStrategy, setBudgetStrategy] = useState<BudgetStrategy>('efficient');
  const [minShards, setMinShards] = useState(1);
  const [snipingResult, setSnipingResult] = useState<AiSmartSnipingSuggestionsOutput | null>(null);

  // Troop State
  const [troopLevel, setTroopLevel] = useState<number | undefined>();
  const [troopTime, setTroopTime] = useState<string | undefined>();
  const [troopSpeedups, setTroopSpeedups] = useState<number | undefined>();
  const [troopEventType, setTroopEventType] = useState<TroopEvent>('koi_svs');


  // Custom Event State
  const [customEventName, setCustomEventName] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPoints, setCustomItemPoints] = useState('');
  const [editingCustomEventName, setEditingCustomEventName] = useState('');


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
      return customEvents[editingCustomEventName] || eventData.custom;
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
  }, [currentEvent, customEvents, editingCustomEventName, toggleStates]);


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
    historyEnabled, pointsHistory, accessibilitySettings, userStats, achievements
  ]);

  useEffect(() => {
    calculateTotal();
  }, [itemCounts, troopsEnabled, troopLevel, troopTime, troopSpeedups, currentEventData, troopEventType]);


  useEffect(() => {
    if (snipingEnabled) {
      handleCalculateSniping();
    } else {
      setSnipingResult(null);
    }
  }, [snipingEnabled, targetGap, budgetStrategy, minShards, currentEventData]);


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
        setHistoryEnabled(data.historyEnabled || false);
        setPointsHistory(data.pointsHistory || []);
        setAccessibilitySettings(data.accessibilitySettings || { largeText: false, extraLargeText: false, highContrast: false, reducedMotion: false });
        setUserStats(data.userStats || { totalEvents: 0, totalPoints: 0, sessionsThisMonth: 0, firstUse: null, lastUse: null, bestEfficiency: 0, eventsMastered: [] });
        setAchievements(data.achievements || achievementsData);
        // Load the first custom event if available
        const firstCustomEvent = Object.keys(data.customEvents || {})[0];
        if (firstCustomEvent) {
          setEditingCustomEventName(firstCustomEvent);
        }
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
  };

  const saveToStorage = () => {
    try {
      const data = {
        currentSection, currentEvent, itemCounts, toggleStates, customEvents, snipingEnabled, troopsEnabled,
        historyEnabled, pointsHistory, accessibilitySettings, userStats, achievements
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
        const inputKey = `${currentEvent}-${editingCustomEventName}-${itemName}`;
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
    
    if (troopsEnabled && troopLevel && troopTime && troopSpeedups) {
      const pointsPerTroop = currentEventData.troops[troopEventType][troopLevel] || 0;
      const timePerTroop = troopTimeOptions.find(t => t.value === troopTime)?.seconds || 0;
      if (timePerTroop > 0) {
          const maxTroops = Math.floor(troopSpeedups / timePerTroop);
          total += maxTroops * pointsPerTroop;
      }
    }
    
    setTotalPoints(total);
  }, [currentEvent, itemCounts, currentEventData, troopsEnabled, troopLevel, troopTime, troopSpeedups, troopEventType, editingCustomEventName]);


  const handleItemCountChange = (itemName: string, value: string) => {
    const itemData = currentEventData.items[itemName];
    let numValue = parseInt(value) || 0;

    if (itemData?.minAmount && numValue > 0 && numValue < itemData.minAmount) {
      numValue = itemData.minAmount;
    }
    
    const key = `${currentEvent}-${editingCustomEventName}-${itemName}`;
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

  const handleCreateCustomEvent = () => {
    if (!customEventName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Event name cannot be empty." });
      return;
    }
    if (customEvents[customEventName]) {
      toast({ variant: "destructive", title: "Error", description: "An event with this name already exists." });
      return;
    }
    setCustomEvents(prev => ({
      ...prev,
      [customEventName]: {
        title: customEventName,
        items: {},
        troops: { koi_svs: {}, officer: {} },
        toggles: []
      }
    }));
    setEditingCustomEventName(customEventName);
    setCustomEventName('');
  };

  const handleAddCustomItem = () => {
    if (!editingCustomEventName) {
      toast({ variant: "destructive", title: "Error", description: "Select a custom event first." });
      return;
    }
    if (!customItemName.trim() || !customItemPoints.trim() || isNaN(parseInt(customItemPoints))) {
      toast({ variant: "destructive", title: "Error", description: "Invalid item name or points." });
      return;
    }

    setCustomEvents(prev => {
      const updatedEvent = { ...prev[editingCustomEventName] };
      updatedEvent.items[customItemName] = { points: parseInt(customItemPoints), available: true };
      return { ...prev, [editingCustomEventName]: updatedEvent };
    });

    setCustomItemName('');
    setCustomItemPoints('');
  };

  const handleRemoveCustomItem = (itemName: string) => {
     if (!editingCustomEventName) return;
     setCustomEvents(prev => {
        const newEvents = {...prev};
        delete newEvents[editingCustomEventName].items[itemName];
        return newEvents;
     });
  };

  const handleRemoveCustomEvent = (eventName: string) => {
    setCustomEvents(prev => {
        const newEvents = {...prev};
        delete newEvents[eventName];
        if (editingCustomEventName === eventName) {
            setEditingCustomEventName(Object.keys(newEvents)[0] || '');
        }
        return newEvents;
    });
  };


  const handleCalculateSniping = () => {
    if (!snipingEnabled || targetGap <= 0) {
      setSnipingResult(null);
      return;
    }

    startTransition(async () => {
      const availableItems = Object.entries(currentEventData.items)
        .filter(([, data]) => data.available)
        .reduce((acc, [name, data]) => {
          acc[name] = { points: data.points };
          return acc;
        }, {} as Record<string, { points: number }>);

      const result = await getSnipingSuggestions({
        eventData: availableItems,
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
  
  if (!isMounted) {
    return <div className="flex justify-center items-center h-screen">Loading Stratagems...</div>;
  }

  const mainToggles = [
    { id: 'sniping', label: 'AI Smart Sniping', icon: Icons.bot, enabled: snipingEnabled, setEnabled: setSnipingEnabled },
    { id: 'troops', label: 'Troop Training', icon: Icons.helmet, enabled: troopsEnabled, setEnabled: setTroopsEnabled, hidden: !Object.values(currentEventData.troops).some(t => Object.keys(t).length > 0) },
    { id: 'history', label: 'Points History', icon: Icons.barChart, enabled: historyEnabled, setEnabled: setHistoryEnabled },
  ];
  
  const renderCustomEventUI = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Create & Manage Custom Events</CardTitle>
                <CardDescription>Design your own event calculators for any in-game event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="New Event Name"
                        value={customEventName}
                        onChange={e => setCustomEventName(e.target.value)}
                    />
                    <Button onClick={handleCreateCustomEvent}><Icons.plusCircle /> Create</Button>
                </div>

                {Object.keys(customEvents).length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="custom-event-select">Select Event to Edit</Label>
                            <div className="flex gap-2">
                                <Select value={editingCustomEventName} onValueChange={setEditingCustomEventName}>
                                    <SelectTrigger id="custom-event-select"><SelectValue placeholder="Select an event" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(customEvents).map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {editingCustomEventName && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                       <Button variant="destructive" size="icon" onClick={() => handleRemoveCustomEvent(editingCustomEventName)}><Icons.trash /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Delete '{editingCustomEventName}' event</p></TooltipContent>
                                  </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {editingCustomEventName && customEvents[editingCustomEventName] && (
             <Card>
                <CardHeader>
                    <CardTitle>Add Items to '{editingCustomEventName}'</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input placeholder="Item Name" value={customItemName} onChange={e => setCustomItemName(e.target.value)} />
                        <Input type="number" placeholder="Points per item" value={customItemPoints} onChange={e => setCustomItemPoints(e.target.value)} />
                        <Button onClick={handleAddCustomItem} className="sm:w-auto w-full"><Icons.plusCircle /> Add Item</Button>
                    </div>
                    {Object.keys(customEvents[editingCustomEventName].items).length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(customEvents[editingCustomEventName].items).map(([name, data]) => (
                                    <TableRow key={name}>
                                        <TableCell className="font-medium">{name}</TableCell>
                                        <TableCell>{data.points.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveCustomItem(name)}>
                                                <Icons.trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center pt-4">No items added yet. Add items above to start calculating.</p>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );


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
                  <Tabs value={currentEvent} onValueChange={(val) => { setCurrentEvent(val as EventKey); setSnipingResult(null); }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                        {Object.keys(eventData).map(key => {
                            const title = eventData[key as EventKey].title;
                            return <TabsTrigger key={key} value={key}>{title}</TabsTrigger>
                        })}
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentEvent === 'custom' ? renderCustomEventUI() : null}
                  
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
                                  value={itemCounts[`${currentEvent}-${editingCustomEventName}-${name}`] || ''}
                                  onChange={(e) => handleItemCountChange(name, e.target.value)}
                                  disabled={!data.available}
                                />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                       {currentEvent !== 'custom' && Object.keys(currentEventData.items).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center col-span-2">No items to calculate for this event. Check advanced options or enable features.</p>
                       )}
                    </div>
                    <div className="space-y-6">
                      {troopsEnabled && Object.values(currentEventData.troops).some(t => Object.keys(t).length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Icons.helmet /> Troop Training Calculator</CardTitle>
                                <CardDescription>Calculate points from training troops for different events.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="troop-event-type">Event Type</Label>
                                        <Select value={troopEventType} onValueChange={(v) => setTroopEventType(v as TroopEvent)}>
                                            <SelectTrigger id="troop-event-type"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="koi_svs">King of Icefield / SvS</SelectItem>
                                                <SelectItem value="officer">Officer Events</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="troop-level">Troop Level</Label>
                                        <Select value={troopLevel?.toString()} onValueChange={(v) => setTroopLevel(parseInt(v))}>
                                            <SelectTrigger id="troop-level"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(currentEventData.troops[troopEventType] || {}).map(level => <SelectItem key={level} value={level}>Level {level}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="troop-time">Base Time/Troop</Label>
                                        <Select value={troopTime} onValueChange={setTroopTime}>
                                            <SelectTrigger id="troop-time"><SelectValue placeholder="Select time" /></SelectTrigger>
                                            <SelectContent>
                                                {troopTimeOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="troop-speedups">Total Speedups (seconds)</Label>
                                        <Input id="troop-speedups" type="number" placeholder="e.g., 36000" value={troopSpeedups || ''} onChange={e => setTroopSpeedups(parseInt(e.target.value))} />
                                    </div>
                                </div>
                                {troopLevel && troopTime && troopSpeedups ? (
                                    <div className="text-sm p-3 bg-secondary rounded-lg space-y-1">
                                        <p>Time per troop: <span className="font-bold text-accent">{(troopTimeOptions.find(t=>t.value === troopTime)?.seconds || 0).toLocaleString()}s</span></p>
                                        <p>Max Trainable: <span className="font-bold text-accent">{Math.floor(troopSpeedups / (troopTimeOptions.find(t=>t.value === troopTime)?.seconds || 1)).toLocaleString()} troops</span></p>
                                        <p>Points from Troops: <span className="font-bold text-accent">{ (Math.floor(troopSpeedups / (troopTimeOptions.find(t=>t.value === troopTime)?.seconds || 1)) * (currentEventData.troops[troopEventType]?.[troopLevel] || 0)).toLocaleString() }</span></p>
                                    </div>
                                ) : <p className="text-xs text-muted-foreground text-center pt-2">Fill all fields to calculate troop points.</p>}
                            </CardContent>
                            <CardFooter>
                                 <p className="text-xs text-muted-foreground">Find base training time in your barracks for a single troop.</p>
                            </CardFooter>
                        </Card>
                      )}
                      {snipingEnabled && (
                          <Card className="border-accent">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-accent"><Icons.bot /> AI Smart Sniping</CardTitle>
                              <CardDescription>Let AI find the best items to snipe a target score. The more you use it, the smarter it gets!</CardDescription>
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
                                                <SelectItem value="quick">Quickest Path</SelectItem>
                                                <SelectItem value="balanced">Balanced</SelectItem>
                                                <SelectItem value="premium">Premium Items First</SelectItem>
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
                                <div className="p-4 bg-secondary rounded-lg min-h-[120px]">
                                    <h4 className="font-semibold mb-2">AI Suggestions:</h4>
                                    {isPending && !snipingResult ? <p className="text-sm text-muted-foreground">Thinking...</p> : null}
                                    {snipingResult && snipingResult.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Item</TableHead>
                                                    <TableHead className="text-right">Quantity</TableHead>
                                                    <TableHead className="text-right">Points</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {snipingResult.map((item, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-medium">{item.item}</TableCell>
                                                        <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                                        <TableCell className="text-right">{item.points.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : <p className="text-xs text-muted-foreground text-center pt-4">Enter a point gap to get AI suggestions.</p>}
                                </div>
                            </CardContent>
                             <CardFooter className="flex-col items-start gap-2 text-xs text-muted-foreground">
                                <p>AI sniping helps you reach a score with the best item combination based on your strategy.</p>
                                <p>Enjoying this Pro feature? Consider sending <span className="font-bold text-yellow-300">Froststars</span> in-game! ID: <span className="font-bold text-white">176435188</span></p>
                            </CardFooter>
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

    