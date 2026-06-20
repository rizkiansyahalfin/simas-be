// utils/disk.util.ts

import checkDiskSpace from "check-disk-space"

export async function getDiskInfo() {

  const diskPath =
    process.platform === "win32"
      ? process.env.SYSTEMDRIVE ?? "C:"
      : "/"

  const disk =
    await checkDiskSpace(diskPath)

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