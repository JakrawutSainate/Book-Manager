import { Router } from "express";
import {
  listBooks,
  // getBook,
  createBook,
  updateBook,
  deleteBook,
  recentBooks,
} from "../controllers/bookController";

const router = Router();

// ดึงรายชื่อหนังสือทั้งหมด
router.get("/", listBooks);

// ดึงข้อมูลหนังสือฉบับเดียว
// router.get("/:id", getBook);

// สร้างหนังสือใหม่
router.post("/", createBook);

// แก้ไขข้อมูลหนังสือ
router.put("/:id", updateBook);

// ลบหนังสือ
router.delete("/:id", deleteBook);

// แสดง logs ข้อมูลหนังสือ 
router.get("/recent", recentBooks);

export default router;
