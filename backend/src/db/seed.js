// RPG Todo - Database Seed Script
// Seeds: 20 levels, 10 achievements, 4 default labels
// Run with: npm run seed

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ========================================
// 1. SEED LEVELS (21 levels: 0-20 with exponential XP)
// Level 0: 0 XP (starting level)
// Formula for Level 1+: XP = 100 * (level ^ 1.5)
// ========================================
async function seedLevels() {
  console.log('📊 Seeding 21 levels (0-20) with exponential XP...');
  
  const levels = [];
  
  // Level 0: Starting level
  levels.push({ level_number: 0, xp_required: 0 });
  
  // Levels 1-20: Exponential XP formula
  for (let level = 1; level <= 20; level++) {
    const xpRequired = Math.floor(100 * Math.pow(level, 1.5));
    levels.push({ level_number: level, xp_required: xpRequired });
  }

  const { data, error } = await supabase
    .from('levels')
    .upsert(levels, { onConflict: 'level_number' });

  if (error) {
    console.error('❌ Error seeding levels:', error);
    throw error;
  }

  console.log('✅ Seeded 21 levels successfully');
  console.log('   Level 0: 0 XP (starting level)');
  console.log('   Level 1: 100 XP');
  console.log('   Level 5: 1,118 XP');
  console.log('   Level 10: 3,162 XP');
  console.log('   Level 15: 5,814 XP');
  console.log('   Level 20: 8,944 XP (max level)');
}

// ========================================
// 2. SEED ACHIEVEMENTS (10 achievements)
// ========================================
async function seedAchievements() {
  console.log('🏆 Seeding 10 achievements...');

  const achievements = [
    {
      name: 'Task Creator I',
      description: 'Create 5 tasks',
      criteria_type: 'TASKS_CREATED',
      criteria_value: 5,
      bonus_xp: 50,
      icon: 'scroll'
    },
    {
      name: 'Task Creator II',
      description: 'Create 10 tasks',
      criteria_type: 'TASKS_CREATED',
      criteria_value: 10,
      bonus_xp: 100,
      icon: 'scroll'
    },
    {
      name: 'Task Creator III',
      description: 'Create 20 tasks',
      criteria_type: 'TASKS_CREATED',
      criteria_value: 20,
      bonus_xp: 200,
      icon: 'scroll'
    },
    {
      name: 'High Priority Master',
      description: 'Complete 1 high priority task',
      criteria_type: 'HIGH_PRIORITY_COMPLETED',
      criteria_value: 1,
      bonus_xp: 75,
      icon: 'sword'
    },
    {
      name: 'Medium Priority Master',
      description: 'Complete 1 medium priority task',
      criteria_type: 'MEDIUM_PRIORITY_COMPLETED',
      criteria_value: 1,
      bonus_xp: 50,
      icon: 'shield'
    },
    {
      name: 'Low Priority Master',
      description: 'Complete 1 low priority task',
      criteria_type: 'LOW_PRIORITY_COMPLETED',
      criteria_value: 1,
      bonus_xp: 25,
      icon: 'feather'
    },
    {
      name: 'Level 5 Achiever',
      description: 'Reach level 5',
      criteria_type: 'LEVEL_REACHED',
      criteria_value: 5,
      bonus_xp: 150,
      icon: 'star'
    },
    {
      name: 'Level 10 Achiever',
      description: 'Reach level 10',
      criteria_type: 'LEVEL_REACHED',
      criteria_value: 10,
      bonus_xp: 300,
      icon: 'star'
    },
    {
      name: 'Level 15 Achiever',
      description: 'Reach level 15',
      criteria_type: 'LEVEL_REACHED',
      criteria_value: 15,
      bonus_xp: 500,
      icon: 'star'
    },
    {
      name: 'Label Creator I',
      description: 'Create 3 custom labels',
      criteria_type: 'LABELS_CREATED',
      criteria_value: 3,
      bonus_xp: 75,
      icon: 'tag'
    }
  ];

  // Check if achievements already exist
  const { data: existing } = await supabase
    .from('achievements')
    .select('name');

  if (existing && existing.length >= 10) {
    console.log('⚠️  Achievements already exist, skipping...');
    return;
  }

  // Insert achievements if they don't exist
  const { data, error } = await supabase
    .from('achievements')
    .insert(achievements);

  if (error) {
    console.error('❌ Error seeding achievements:', error);
    throw error;
  }

  console.log('✅ Seeded 10 achievements successfully');
  achievements.forEach((a, i) => {
    console.log(`   ${i + 1}. ${a.name} - ${a.bonus_xp} bonus XP`);
  });
}

// ========================================
// 3. SEED DEFAULT LABELS (4 labels)
// ========================================
async function seedDefaultLabels() {
  console.log('🏷️  Seeding 4 default labels...');

  const defaultLabels = [
    { name: 'Work', is_default: true, user_id: null },
    { name: 'Personal', is_default: true, user_id: null },
    { name: 'Errands', is_default: true, user_id: null },
    { name: 'Goals', is_default: true, user_id: null }
  ];

  // Check if defaults already exist
  const { data: existing } = await supabase
    .from('labels')
    .select('name')
    .eq('is_default', true);

  if (existing && existing.length >= 4) {
    console.log('⚠️  Default labels already exist, skipping...');
    return;
  }

  // Insert labels if they don't exist
  const { data, error } = await supabase
    .from('labels')
    .insert(defaultLabels);

  if (error) {
    console.error('❌ Error seeding default labels:', error);
    throw error;
  }

  console.log('✅ Seeded 4 default labels successfully');
  console.log('   - Work');
  console.log('   - Personal');
  console.log('   - Errands');
  console.log('   - Goals');
}

// ========================================
// MAIN SEED FUNCTION
// ========================================
async function runSeed() {
  console.log('🌱 Starting database seed...\n');

  try {
    await seedLevels();
    console.log('');
    await seedAchievements();
    console.log('');
    await seedDefaultLabels();
    console.log('\n✅ Database seed completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
}

// Run the seed
runSeed();

