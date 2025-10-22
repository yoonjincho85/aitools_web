import { supabase, Activity } from '../lib/supabase';

export async function fetchActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return data || [];
}

export async function createActivity(date: string, title: string, description: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .insert([{ date, title, description }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating activity:', error);
    return null;
  }

  return data;
}

export async function updateActivity(id: string, title: string, description: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating activity:', error);
    return null;
  }

  return data;
}

export async function deleteActivity(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting activity:', error);
    return false;
  }

  return true;
}

export function getActivityCountByDate(activities: Activity[]): Map<string, number> {
  const countMap = new Map<string, number>();
  activities.forEach(activity => {
    countMap.set(activity.date, 1);
  });
  return countMap;
}

export function generateLast365Days(): string[] {
  const days: string[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }

  return days;
}
