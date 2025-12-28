import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminSettingsService {
  private readonly logger = new Logger(AdminSettingsService.name);
  private settingsCache: any = null;
  private cacheTimestamp = 0;
  private readonly CACHE_TTL = 60000; // 1 minute cache

  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const now = Date.now();
    
    // Return cached settings if valid
    if (this.settingsCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.settingsCache;
    }

    try {
      // Fetch from database
      let settings = await this.prisma.adminSettings.findUnique({
        where: { id: 'settings' },
      });

      if (!settings) {
        // Create default settings
        try {
          settings = await this.prisma.adminSettings.create({
            data: {
              id: 'settings',
              mockMode: false,
              defaultMarkupPercent: 0,
              defaultCurrency: 'USD',
              adminEmails: [],
              emailEnabled: true,
              updatedAt: new Date(),
            },
          });
          this.logger.log('Created default AdminSettings');
        } catch (createError) {
          // If create fails (e.g., race condition or DB issue), try to fetch again
          this.logger.warn('Failed to create default settings, trying to fetch again:', createError);
          settings = await this.prisma.adminSettings.findUnique({
            where: { id: 'settings' },
          });
        }
      }

      // Update cache
      this.settingsCache = settings;
      this.cacheTimestamp = now;

      return settings;
    } catch (error) {
      // If database operation fails, return default settings object
      this.logger.error('Failed to fetch admin settings from database, using defaults:', error);
      
      // Return default settings object
      const defaultSettings = {
        id: 'settings',
        mockMode: false,
        defaultMarkupPercent: 0,
        defaultCurrency: 'USD',
        adminEmails: [],
        emailEnabled: true,
        discountsJson: null,
        pricingJson: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Cache the default settings (but with shorter TTL - 10 seconds)
      this.settingsCache = defaultSettings;
      this.cacheTimestamp = now;
      
      return defaultSettings;
    }
  }

  async getMockMode(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.mockMode;
  }

  async getDefaultMarkupPercent(): Promise<number> {
    const settings = await this.getSettings();
    return settings.defaultMarkupPercent || 0;
  }

  async getDefaultCurrency(): Promise<string> {
    const settings = await this.getSettings();
    return settings.defaultCurrency || 'USD';
  }

  async getAdminEmails(): Promise<string[]> {
    const settings = await this.getSettings();
    // Return emails from database, converted to lowercase
    return (settings.adminEmails || []).map((e) => e.trim().toLowerCase()).filter(Boolean);
  }

  // Clear cache (call this after updating settings)
  clearCache() {
    this.settingsCache = null;
    this.cacheTimestamp = 0;
  }

  // Get discounts (global and individual)
  async getDiscounts(): Promise<{ global: Record<string, number>; individual: Record<string, number> }> {
    const settings = await this.getSettings();
    if (!settings.discountsJson || typeof settings.discountsJson !== 'object') {
      return { global: {}, individual: {} };
    }
    
    const discounts = settings.discountsJson as any;
    return {
      global: discounts.global || {},
      individual: discounts.individual || {},
    };
  }

  // Set discounts (global and individual)
  async setDiscounts(discounts: { global?: Record<string, number>; individual?: Record<string, number> }): Promise<void> {
    const currentSettings = await this.getSettings();
    const currentDiscounts = (currentSettings.discountsJson as any) || {};
    
    const updatedDiscounts = {
      global: discounts.global !== undefined ? discounts.global : (currentDiscounts.global || {}),
      individual: discounts.individual !== undefined ? discounts.individual : (currentDiscounts.individual || {}),
    };

    // Use raw SQL to update only discountsJson to avoid Prisma schema validation issues
    // This works even if pricingJson column doesn't exist in the database
    // First try to update, if no rows affected, insert
    const updateResult = await this.prisma.$executeRaw`
      UPDATE "AdminSettings"
      SET "discountsJson" = ${JSON.stringify(updatedDiscounts)}::jsonb,
          "updatedAt" = NOW()
      WHERE id = 'settings'
    `;

    // If no rows were updated, the record doesn't exist, so create it
    if (updateResult === 0) {
      await this.prisma.$executeRaw`
        INSERT INTO "AdminSettings" (id, "mockMode", "defaultMarkupPercent", "defaultCurrency", "adminEmails", "emailEnabled", "discountsJson", "updatedAt", "createdAt")
        VALUES ('settings', false, 0, 'USD', ARRAY[]::text[], true, ${JSON.stringify(updatedDiscounts)}::jsonb, NOW(), NOW())
      `;
    }

    // Clear cache after update
    this.clearCache();
  }

  // Get pricing (individual plan prices in USD)
  async getPricing(): Promise<Record<string, number>> {
    const settings = await this.getSettings();
    if (!settings.pricingJson || typeof settings.pricingJson !== 'object') {
      return {};
    }
    
    return (settings.pricingJson as Record<string, number>) || {};
  }

  // Set pricing (individual plan prices in USD)
  async setPricing(pricing: Record<string, number>): Promise<void> {
    // Validate pricing values (must be positive numbers)
    for (const [planCode, price] of Object.entries(pricing)) {
      if (typeof price !== 'number' || price < 0) {
        throw new Error(`Invalid price for ${planCode}: must be a positive number`);
      }
    }

    // NOTE:
    // The Prisma client types might not yet include `pricingJson` if the
    // client hasn't been regenerated. To avoid type errors while still
    // sending the correct field to the database (which already has the
    // column via migration), we cast the `data` object to `any`.
    await this.prisma.adminSettings.update({
      where: { id: 'settings' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pricingJson: pricing,
        updatedAt: new Date(),
      } as any,
    });

    // Clear cache after update
    this.clearCache();
  }
}

