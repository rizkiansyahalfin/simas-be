// utils/disk.util.ts

import checkDiskSpace from "check-disk-space"

export async function getDiskInfo() {

  const disk =
    await checkDiskSpace("/")

  const used =
    disk.size - disk.free

  return {
    free: disk.free,
    size: disk.size,
    usedPercentage:
      Number(
        ((used / disk.size) * 100)
          .toFixed(2)
      )
  }
}