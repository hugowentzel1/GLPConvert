// Browser synchronization utilities to ensure consistency across all browsers
export class BrowserSync {
  private static instance: BrowserSync;
  private syncKey = 'sunspire_browser_sync';
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance(): BrowserSync {
    if (!BrowserSync.instance) {
      BrowserSync.instance = new BrowserSync();
    }
    return BrowserSync.instance;
  }

  // Initialize browser sync
  init() {
    if (typeof window === 'undefined') return;
    
    // Start periodic sync
    this.startSync();
    
    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen for page visibility changes to sync when tab becomes active
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    console.log('🔄 Browser sync initialized - ensuring consistency across all browsers');
  }

  // Start periodic synchronization
  private startSync() {
    if (this.syncInterval) return;
    
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, 5000); // Sync every 5 seconds
  }

  // Stop synchronization
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Handle storage changes from other tabs/windows
  private handleStorageChange(event: StorageEvent) {
    if (event.key === this.syncKey && event.newValue) {
      try {
        const syncData = JSON.parse(event.newValue);
        this.applySyncData(syncData);
        console.log('🔄 Browser sync: Applied changes from other tab');
      } catch (error) {
        console.error('Browser sync error:', error);
      }
    }
  }

  // Handle visibility changes
  private handleVisibilityChange() {
    if (!document.hidden) {
      // Tab became visible, sync data
      this.syncData();
    }
  }

  // Sync current data to other tabs
  private syncData() {
    if (typeof window === 'undefined') return;
    
    try {
      const currentData = this.getCurrentData();
      const syncData = {
        timestamp: Date.now(),
        data: currentData
      };
      
      localStorage.setItem(this.syncKey, JSON.stringify(syncData));
    } catch (error) {
      console.error('Browser sync error:', error);
    }
  }

  // Apply synced data
  private applySyncData(syncData: any) {
    if (typeof window === 'undefined') return;
    
    try {
      const { data } = syncData;
      
      // Apply brand takeover data
      if (data.brandTakeover) {
        localStorage.setItem('sunspire-brand-takeover', JSON.stringify(data.brandTakeover));
      }
      
      // Apply demo quota data
      if (data.demoQuota) {
        localStorage.setItem('demo_quota_v5', data.demoQuota);
      }
      
      console.log('🔄 Browser sync: Applied synced data');
    } catch (error) {
      console.error('Browser sync apply error:', error);
    }
  }

  // Get current data to sync
  private getCurrentData() {
    if (typeof window === 'undefined') return {};
    
    return {
      brandTakeover: localStorage.getItem('sunspire-brand-takeover'),
      demoQuota: localStorage.getItem('demo_quota_v5'),
      demoRuns: localStorage.getItem('demo_runs_left'),
      sunspireDemoQuota: localStorage.getItem('sunspire_demo_quota'),
      sunspireDemoQuotaV1: localStorage.getItem('sunspire_demo_quota_v1'),
      demoAutoOpen: localStorage.getItem('demo_auto_open_v1'),
    };
  }

  // Force sync across all browsers
  forceSync() {
    this.syncData();
    console.log('🔄 Browser sync: Force sync completed');
  }

  // Reset demo runs across all browsers
  resetDemoRuns() {
    if (typeof window === 'undefined') return;
    
    // Clear all demo-related data
    localStorage.removeItem("demo_quota_v5");
    localStorage.removeItem("demo_runs_left");
    localStorage.removeItem("sunspire_demo_quota");
    localStorage.removeItem("sunspire_demo_quota_v1");
    localStorage.removeItem("demo_auto_open_v1");
    
    // Set unlimited brand takeover data
    const brandData = {
      enabled: true,
      brand: "tesla",
      primary: "#CC0000",
      logo: null,
      domain: "tesla",
      city: null,
      rep: null,
      firstName: null,
      role: null,
      expireDays: 7,
      runs: 999, // Unlimited
      blur: true,
      pilot: false,
      isDemo: true,
      _timestamp: Date.now()
    };
    
    localStorage.setItem('sunspire-brand-takeover', JSON.stringify(brandData));
    
    // Force sync to other tabs
    this.forceSync();
    
    console.log("✅ Demo runs reset across all browsers - unlimited access granted");
  }
}

// Initialize browser sync when module loads
if (typeof window !== 'undefined') {
  const browserSync = BrowserSync.getInstance();
  browserSync.init();
  
  // Make it globally available
  (window as any).browserSync = browserSync;
  (window as any).resetDemoRuns = () => browserSync.resetDemoRuns();
  
  console.log('🛠️ Browser sync system loaded - window.browserSync and window.resetDemoRuns available');
}
