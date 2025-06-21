
Innovate Fullstack Web App
โครงสร้างโปรเจกต์
client/ ฝั่ง frontend (Vue 3 + Vite + Tailwind)
server/ ฝั่ง backend (Node.js + TypeScript + Express)

---------------------------------------
วิธีติดตั้งและใช้งาน
1. แตกไฟล์โปรเจกต์ออก แล้วเปิด terminal
2. รันฝั่ง client (Vue)
cd client
npm install
npm run dev
จะเปิดเว็บที่ localhost:5173 โดยอัตโนมัติ (หรือตามที่ระบบแจ้ง)

3. รันฝั่ง server (Node.js)
cd server
npm install
npm run dev
server เขียนด้วย TypeScript และใช้ nodemon คอย watch ไฟล์แบบอัตโนมัติ

---------------------------------------
Use Stack
Frontend:
- Vue 3
- Vite
- TailwindCSS
- Vue Router
- Axios
- Chart.js
- SweetAlert2

Backend:
- Node.js
- TypeScript
- Express.js
- MySQL2
- dotenv, helmet, morgan, cors, compression

---------------------------------------
หมายเหตุ
- ต้องมี Node.js เวอร์ชัน 18+ และ npm 9+ ขึ้นไป
- อย่าลืมสร้างไฟล์ .env ในโฟลเดอร์ server เพื่อใส่ค่าพวก PORT, DB_HOST, DB_USER, DB_PASS ฯลฯ
- ทั้ง client และ server ใช้คำสั่ง npm run dev ในการรันตอนพัฒนา

