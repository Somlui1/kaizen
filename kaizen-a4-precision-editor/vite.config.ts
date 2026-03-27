import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // ใช้ Plugin สำหรับรวมไฟล์ และมาตรฐาน React/Tailwind
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile()
    ],

    // ส่งผ่าน API Key ไปยัง Client-side
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    // ตั้งค่า Build ให้ลีนที่สุด
    build: {
      reportCompressedSize: false,
      cssCodeSplit: false, // จำเป็นสำหรับ Single File
      assetsInlineLimit: 100000000, // บังคับให้ Assets ทุกอย่างกลายเป็น Inline
    },
  };
});