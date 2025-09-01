import { createClient } from '@supabase/supabase-js';
import { getDefaultRegistry } from '../index';
import { ComponentDefinition } from '../types/component';

/**
 * Database seeding for component registry
 * Populates the components table with core components
 */

// Note: In production, these would come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: any = null;

/**
 * Initialize Supabase client for seeding
 */
function initSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration for seeding');
  }
  
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  return supabase;
}

/**
 * Seed core components into database
 */
export async function seedCoreComponents(): Promise<void> {
  console.log('Starting component registry seeding...');
  
  try {
    const client = initSupabase();
    const registry = await getDefaultRegistry();
    const components = registry.getAllComponents();
    
    console.log(`Found ${components.length} components to seed`);
    
    // Clear existing global components
    const { error: deleteError } = await client
      .from('components')
      .delete()
      .eq('is_global', true);
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Failed to clear existing components:', deleteError);
      throw deleteError;
    }
    
    console.log('Cleared existing global components');
    
    // Insert new components
    for (const component of components) {
      const componentData = {
        name: component.name,
        type: component.category,
        props: {
          defaultProps: component.defaultProps,
          propsSchema: serializeZodSchema(component.propsSchema),
          variants: component.metadata.variants || {},
          designTokens: component.metadata.designTokens || {}
        },
        children: [], // Components are leaf nodes in registry
        is_global: true,
        category: component.category,
        tags: component.metadata.tags,
        metadata: {
          id: component.id,
          version: component.metadata.version,
          description: component.metadata.description,
          performance: component.metadata.performance,
          accessibility: component.metadata.accessibility,
          compatibility: component.metadata.compatibility,
          usage: component.metadata.usage,
          aiHints: component.metadata.aiHints,
          createdAt: component.metadata.createdAt,
          updatedAt: component.metadata.updatedAt
        }
      };
      
      const { error: insertError } = await client
        .from('components')
        .insert([componentData]);
      
      if (insertError) {
        console.error(`Failed to insert component ${component.id}:`, insertError);
        throw insertError;
      }
      
      console.log(`Seeded component: ${component.id}`);
    }
    
    console.log(`Successfully seeded ${components.length} components`);
    
    // Verify seeding
    const { data: verifyData, error: verifyError } = await client
      .from('components')
      .select('id, name, category')
      .eq('is_global', true);
    
    if (verifyError) {
      console.error('Failed to verify seeding:', verifyError);
    } else {
      console.log(`Verification: Found ${verifyData?.length || 0} global components in database`);
    }
    
  } catch (error) {
    console.error('Component seeding failed:', error);
    throw error;
  }
}

/**
 * Helper functions
 */
function serializeZodSchema(schema: any): any {
  // Simple serialization for basic schemas
  // In production, you'd want a more robust serialization
  return {
    type: 'zod-schema',
    description: schema.description || 'Component props schema'
  };
}

/**
 * CLI function to run seeding
 */
export async function runSeed(): Promise<void> {
  try {
    await seedCoreComponents();
    console.log('Component registry seeding completed successfully');
  } catch (error) {
    console.error('Component registry seeding failed:', error);
    process.exit(1);
  }
}

// Allow direct execution
if (require.main === module) {
  runSeed();
}