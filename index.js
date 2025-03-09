import NodeMediaServer from "node-media-server";
import fs from "fs";

const mediaPath = "./media";
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}

const httpConfig = {
  port: 8000,
  allow_origin: "*",
  mediaroot: "./media",
};

const rtmpConfig = {
  port: 1935,
  chunk_size: 60000,
  gop_cache: true,
  ping: 10,
  ping_timeout: 60,
};

const transformationConfig = {
  //for linux
  //ffmpeg:"/usr/bin/ffmpeg",
  ffmpeg: "./ffmpeg/bin/ffmpeg.exe", // Pastikan path ini benar
  tasks: [
    {
      app: "live",
      hls: true,
      hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
      hlsKeep: true, // TRUE agar file tidak dihapus
      hlsPath: "./media/live", // Tambahkan path eksplisit
    },
  ],
};

const config = {
  http: httpConfig,
  rtmp: rtmpConfig,
  trans: transformationConfig,
};

const nms = new NodeMediaServer(config);

// Pastikan metode yang tersedia
if (typeof nms.run === "function") {
  nms.run();
  nms.on("postPublish", (id, StreamPath, args) => {
    console.log(`Stream started: ${StreamPath}`);
  });

  nms.on("donePublish", (id, StreamPath, args) => {
    console.log(`Stream ended: ${StreamPath}`);
  });

  nms.on("error", (err) => {
    console.error("NMS Error:", err);
  });

  console.log("Node Media Server is running...");
} else {
  console.error("Error: nms.run() is not a function.");
}
