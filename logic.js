const os = require('os');
const fs = require('fs');

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
    for (const iface of interfaces[key]) {
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  return 'N/A';
}

function bytesToGB(bytes) {
  return (bytes / 1024 ** 3).toFixed(2);
}

function getMemoryUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const pctMemory = ((usedMemory / totalMemory) * 100).toFixed(2) + ' %';
  return {
    used: bytesToGB(usedMemory),
    total: bytesToGB(totalMemory),
    pct: pctMemory,
  };
}

function getStorageUsage() {
  const disk = os.platform() === 'win32' ? 'C:' : '/';
  const diskSpace = os.totalmem();
  const diskFreeSpace = os.freemem();
  const usedSpace = diskSpace - diskFreeSpace;
  const pctDiskSpace = ((usedSpace / diskSpace) * 100).toFixed(2) + ' %';
  return {
    used: bytesToGB(usedSpace),
    total: bytesToGB(diskSpace),
    pct: pctDiskSpace,
  };
}

function getCPUUsage() {
  const cpuUsage = os.loadavg()[0];
  return (cpuUsage * 100).toFixed(2) + ' %';
}

module.exports = {
  getIPAddress,
  getMemoryUsage,
  getStorageUsage,
  getCPUUsage,
};
