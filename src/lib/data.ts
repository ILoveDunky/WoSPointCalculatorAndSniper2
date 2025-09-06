import type { Events, Achievements, TroopTimeOption } from './types';

export const eventData: Events = {
    'koi': {
        title: "🧊 KOI",
        items: {
            'Fire Crystals': { points: 2000, available: true, toggle: 'fire-crystals', minAmount: 1 },
            'Fire Crystal Shards': { points: 1000, available: true, toggle: 'fire-shards', minAmount: 1 },
            '1 Minute of Speedups': { points: 30, available: true, toggle: 'speedups' },
            'Mythic General Shards': { points: 3040, available: true, toggle: 'mythic-shards', minAmount: 5 },
            'Hero Gear Essence Stone': { points: 4000, available: true, toggle: 'essence-stones', minAmount: 1 },
            'Mithril': { points: 40000, available: true, toggle: 'mithril', minAmount: 1 },
            'Sigils': { points: 6000, available: true },
            'Wisdom Books': { points: 60, available: true }
        },
        troops: {
            koi_svs: { 1: 3, 2: 4, 3: 5, 4: 8, 5: 12, 6: 18, 7: 25, 8: 35, 9: 45, 10: 60, 11: 75 },
            officer: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 12, 8: 17, 9: 22, 10: 30, 11: 37 }
        },
        toggles: [
        ],
        specialCalculations: {
            polarTerror: { label: 'Polar Terror Rallies', points: 30000, stamina: 25 }
        }
    },
    'officer-essence': {
        title: "🧑‍✈️ Essence",
        items: {
            'Hero Gear Essence Stone': { points: 6000, available: true, toggle: 'essence-stones', minAmount: 1 },
            'Mithril': { points: 216000, available: true, toggle: 'mithril', minAmount: 1 },
        },
        troops: {
            koi_svs: { 1: 3, 2: 4, 3: 5, 4: 8, 5: 12, 6: 18, 7: 25, 8: 35, 9: 45, 10: 60, 11: 75 },
            officer: { 1: 1, 2: 2, 3: 3, 4: 5, 5: 7, 6: 11, 7: 16, 8: 23, 9: 30, 10: 39, 11: 49 }
        },
        toggles: []
    },
    'officer-charm': {
        title: "🧑‍✈️ Charms",
        items: {
            'Hero Gear Essence Stone': { points: 6000, available: true, toggle: 'essence-stones', minAmount: 1 },
            'Mythic General Shards': { points: 3040, available: true, toggle: 'mythic-shards', minAmount: 5 },
            'Epic Hero Shards': { points: 1220, available: true, toggle: 'epic-shards', minAmount: 5 }
        },
        troops: {
            koi_svs: { 1: 3, 2: 4, 3: 5, 4: 8, 5: 12, 6: 18, 7: 25, 8: 35, 9: 45, 10: 60, 11: 75 },
            officer: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 12, 8: 17, 9: 22, 10: 30, 11: 37 }
        },
        toggles: []
    },
    'armament-tomes': {
        title: "🏹 Tomes",
        items: {
            'Fire Crystal': { points: 100, available: true, toggle: 'fire-crystals', minAmount: 1 },
            'Refined Fire Crystal': { points: 1500, available: false, toggle: 'fc6' },
            'Fire Crystal Shard (research)': { points: 50, available: false, toggle: 'state-age' },
            'Mithril': { points: 28800, available: true, toggle: 'mithril', minAmount: 1 },
            'Hero Gear Essence Stone': { points: 800, available: true, toggle: 'essence-stones', minAmount: 1 },
            '1 Minute of Speedups': { points: 1, available: true, toggle: 'speedups' }
        },
        troops: {
            koi_svs: {},
            officer: {}
        },
        toggles: [
            { id: 'fc6', label: 'FC6+ Available', tooltip: 'Enable if you have Furnace Core level 6+' },
            { id: 'state-age', label: 'State Age Research', tooltip: 'Enable if your state has research unlocked' }
        ]
    },
    'armament-design': {
        title: "🏹 Designs",
        items: {
            'Fire Crystal': { points: 100, available: true, toggle: 'fire-crystals', minAmount: 1 },
            'Refined Fire Crystal': { points: 1500, available: false, toggle: 'fc6' },
            'Fire Crystal Shard (research)': { points: 50, available: false, toggle: 'state-age' },
            'Mithril': { points: 28800, available: true, toggle: 'mithril', minAmount: 1 },
            'Hero Gear Essence Stone': { points: 800, available: true, toggle: 'essence-stones', minAmount: 1 },
            '1 Minute of Speedups': { points: 1, available: true, toggle: 'speedups' },
            'Sigils': { points: 200, available: true },
            'Wisdom Books': { points: 2, available: true }
        },
        troops: {
            koi_svs: {},
            officer: {}
        },
        toggles: [
            { id: 'fc6', label: 'FC6+ Available', tooltip: 'Enable if you have Furnace Core level 6+' },
            { id: 'state-age', label: 'State Age Research', tooltip: 'Enable if your state has research unlocked' }
        ]
    },
    'svs': {
        title: "🏴‍☠️ SVS",
        items: {
            'Fire Crystal': { points: 2000, available: true, toggle: 'fire-crystals', minAmount: 1 },
            'Fire Crystal Shard (research)': { points: 1000, available: true, toggle: 'fire-shards', minAmount: 1 },
            'Refined Fire Crystal': { points: 30000, available: true, toggle: 'refined-crystals' },
            '1 Minute of Speedups': { points: 30, available: true, toggle: 'speedups' },
            'Epic Hero Shard': { points: 1220, available: true, toggle: 'epic-shards', minAmount: 5 },
            'Mythic General Shard': { points: 3040, available: true, toggle: 'mythic-shards', minAmount: 5 },
            'Advanced Wild Marks': { points: 15000, available: true, toggle: 'adv-marks' },
            'Common Wild Marks': { points: 1150, available: true, toggle: 'common-marks' },
            'Hero Gear Essence Stone': { points: 4000, available: true, toggle: 'essence-stones', minAmount: 1 },
            'Mithril': { points: 40000, available: true, toggle: 'mithril', minAmount: 1 },
            'Sigils': { points: 6000, available: true },
            'Wisdom Books': { points: 60, available: true }
        },
        troops: {
             koi_svs: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 12, 8: 17, 9: 22, 10: 30, 11: 37 },
             officer: {}
        },
        toggles: [
        ],
        specialCalculations: {
            polarTerror: { label: 'Polar Terror Rallies', points: 30000, stamina: 25 }
        }
    },
    'custom': {
        title: "⚙️ Custom",
        items: {},
        troops: {
            koi_svs: {},
            officer: {}
        },
        toggles: []
    }
};

export const troopTimeOptions: TroopTimeOption[] = [
    { value: 't1_time', label: 'T1', seconds: 45 },
    { value: 't2_time', label: 'T2', seconds: 90 },
    { value: 't3_time', label: 'T3', seconds: 180 },
    { value: 't4_time', label: 'T4', seconds: 360 },
    { value: 't5_time', label: 'T5', seconds: 600 },
    { value: 't6_time', label: 'T6', seconds: 900 },
    { value: 't7_time', label: 'T7', seconds: 1200 },
    { value: 't8_time', label: 'T8', seconds: 1800 },
    { value: 't9_time', label: 'T9', seconds: 2700 },
    { value: 't10_time', label: 'T10', seconds: 3600 },
    { value: 't11_time', label: 'T11', seconds: 5400 }
];

export const achievementsData: Achievements = {
    'first-calculation': {
        id: 'first-calculation',
        title: 'Getting Started',
        description: 'Complete your first event calculation',
        icon: '🎯',
        unlocked: false,
        progress: 0,
        target: 1
    },
    'efficiency-expert': {
        id: 'efficiency-expert',
        title: 'Efficiency Expert',
        description: 'Achieve 90%+ efficiency rating',
        icon: '⚡',
        unlocked: false,
        progress: 0,
        target: 90
    },
    'event-master': {
        id: 'event-master',
        title: 'Event Master',
        description: 'Calculate strategies for all 6 event types',
        icon: '👑',
        unlocked: false,
        progress: 0,
        target: 6
    },
    'streak-warrior': {
        id: 'streak-warrior',
        title: 'Streak Warrior',
        description: 'Use calculator for 7 consecutive days',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        target: 7
    },
    'optimization-guru': {
        id: 'optimization-guru',
        title: 'Optimization Guru',
        description: 'Save 1M+ points through optimization',
        icon: '🧠',
        unlocked: false,
        progress: 0,
        target: 1000000
    }
};

    
