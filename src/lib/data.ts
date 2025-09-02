import type { Events, Achievements } from './types';

export const eventData: Events = {
    'koi': {
        title: "🧊 King of Icefield Calculator",
        items: {
            'Fire Crystals': { points: 2000, available: true, toggle: 'fire-crystals' },
            'Fire Crystal Shards': { points: 1000, available: true, toggle: 'fire-shards' },
            '1 Minute of Speedups': { points: 30, available: true, toggle: 'speedups' },
            'Mythic General Shards': { points: 3040, available: true, toggle: 'mythic-shards', minAmount: 5 },
            'Hero Gear Essence Stone': { points: 4000, available: true, toggle: 'essence-stones' },
            'Mithril': { points: 40000, available: true, toggle: 'mithril' }
        },
        troops: {
            1: 3, 2: 4, 3: 5, 4: 8, 5: 12, 6: 18, 7: 25, 8: 35, 9: 45, 10: 60, 11: 75
        },
        toggles: [
            { id: 'beast-26', label: 'Beast Level 26+', tooltip: 'Enable if your beast is level 26 or higher' }
        ],
        specialCalculations: {
            beasts: { label: 'Beasts Killed', points: 1200, stamina: 10 },
            polarTerror: { label: 'Polar Terror Rallies', points: 30000, stamina: 25 }
        }
    },
    'officer-essence': {
        title: "🧑‍✈️ Officer Project - Essence Stone",
        items: {
            'Hero Gear Essence Stone': { points: 6000, available: true, toggle: 'essence-stones' },
            'Mithril': { points: 216000, available: true, toggle: 'mithril' },
        },
        troops: {
            1: 1, 2: 2, 3: 3, 4: 5, 5: 7, 6: 11, 7: 16, 8: 23, 9: 30, 10: 39, 11: 49
        },
        toggles: []
    },
    'officer-charm': {
        title: "🧑‍✈️ Officer Project - Charm Designs",
        items: {
            'Hero Gear Essence Stone': { points: 6000, available: true, toggle: 'essence-stones' },
            'Mythic General Shards': { points: 3040, available: true, toggle: 'mythic-shards', minAmount: 5 },
            'Epic Hero Shards': { points: 1220, available: true, toggle: 'epic-shards', minAmount: 5 }
        },
        troops: {
            1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 12, 8: 17, 9: 22, 10: 30, 11: 37
        },
        toggles: []
    },
    'armament-tomes': {
        title: "🏹 Armament Competition - Two Tomes",
        items: {
            'Fire Crystal': { points: 100, available: true, toggle: 'fire-crystals' },
            'Refined Fire Crystal': { points: 1500, available: false, toggle: 'fc6' },
            'Fire Crystal Shard (research)': { points: 50, available: false, toggle: 'state-age' },
            'Mithril': { points: 28800, available: true, toggle: 'mithril' },
            'Hero Gear Essence Stone': { points: 800, available: true, toggle: 'essence-stones' },
            '1 Minute of Speedups': { points: 1, available: true, toggle: 'speedups' }
        },
        troops: {},
        toggles: [
            { id: 'fc6', label: 'FC6+ Available', tooltip: 'Enable if you have Furnace Core level 6+' },
            { id: 'state-age', label: 'State Age Research', tooltip: 'Enable if your state has research unlocked' }
        ]
    },
    'armament-design': {
        title: "🏹 Armament Competition - Design Plan",
        items: {
            'Fire Crystal': { points: 100, available: true, toggle: 'fire-crystals' },
            'Refined Fire Crystal': { points: 1500, available: false, toggle: 'fc6' },
            'Fire Crystal Shard (research)': { points: 50, available: false, toggle: 'state-age' },
            'Mithril': { points: 28800, available: true, toggle: 'mithril' },
            'Hero Gear Essence Stone': { points: 800, available: true, toggle: 'essence-stones' },
            '1 Minute of Speedups': { points: 1, available: true, toggle: 'speedups' }
        },
        troops: {},
        toggles: [
            { id: 'fc6', label: 'FC6+ Available', tooltip: 'Enable if you have Furnace Core level 6+' },
            { id: 'state-age', label: 'State Age Research', tooltip: 'Enable if your state has research unlocked' }
        ]
    },
    'svs': {
        title: "🏴‍☠️ State vs State - Prep Phase",
        items: {
            'Fire Crystal': { points: 2000, available: true, toggle: 'fire-crystals' },
            'Fire Crystal Shard (research)': { points: 1000, available: true, toggle: 'fire-shards' },
            'Refined Fire Crystal': { points: 30000, available: true, toggle: 'refined-crystals' },
            '1 Minute of Speedups': { points: 30, available: true, toggle: 'speedups' },
            'Epic Hero Shard': { points: 1220, available: true, toggle: 'epic-shards', minAmount: 5 },
            'Mythic General Shard': { points: 3040, available: true, toggle: 'mythic-shards', minAmount: 5 },
            'Advanced Wild Marks': { points: 15000, available: true, toggle: 'adv-marks' },
            'Common Wild Marks': { points: 1150, available: true, toggle: 'common-marks' },
            'Hero Gear Essence Stone': { points: 4000, available: true, toggle: 'essence-stones' },
            'Mithril': { points: 40000, available: true, toggle: 'mithril' }
        },
        troops: {
            1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 12, 8: 17, 9: 22, 10: 30, 11: 37
        },
        toggles: [
            { id: 'beast-26', label: 'Beast Level 26+', tooltip: 'Enable if your beast is level 26 or higher' }
        ],
        specialCalculations: {
            beasts: { label: 'Beasts Killed', points: 1200, stamina: 10 },
            polarTerror: { label: 'Polar Terror Rallies', points: 30000, stamina: 25 }
        }
    },
    'custom': {
        title: "⚙️ Custom Event Calculator",
        items: {},
        troops: {},
        toggles: []
    }
};

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
