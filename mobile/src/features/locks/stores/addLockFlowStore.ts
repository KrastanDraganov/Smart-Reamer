import { create } from 'zustand';
import type { DiscoveredDevice } from '../types';

interface AddLockFlowState {
  discoveredDevices: DiscoveredDevice[];
  selectedDevice: DiscoveredDevice | null;
  setDiscoveredDevices: (devices: DiscoveredDevice[]) => void;
  addDiscoveredDevice: (device: DiscoveredDevice) => void;
  selectDevice: (device: DiscoveredDevice) => void;
  reset: () => void;
}

export const useAddLockFlowStore = create<AddLockFlowState>((set, get) => ({
  discoveredDevices: [],
  selectedDevice: null,

  setDiscoveredDevices: (devices) => set({ discoveredDevices: devices }),

  addDiscoveredDevice: (device) => {
    const existing = get().discoveredDevices;
    if (existing.some((d) => d.macAddress === device.macAddress)) return;
    set({ discoveredDevices: [...existing, device] });
  },

  selectDevice: (device) => set({ selectedDevice: device }),

  reset: () => set({ discoveredDevices: [], selectedDevice: null }),
}));
