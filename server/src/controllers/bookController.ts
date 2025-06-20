import { Request, Response, NextFunction } from "express";
import { pool } from "../database/db"; // หรือ '../db' ตามโครงจริงของคุณ
import { OkPacket, RowDataPacket } from "mysql2";

interface Book {
  id: number;
  title: string;
  author: string;
  published_year: number | null;
  genre: string | null;
  created_at: Date;
  updated_at: Date;
}


export const listBooks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ดึงข้อมูลดิบ
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         id,
         title,
         author,
         published_year,
         genre,
         created_at,
         updated_at
       FROM books
       ORDER BY 
         updated_at DESC,
         created_at DESC`
    );
    const rawBooks = rows as Book[];

    // ฟอร์แมตวันที่เป็นภาษาไทย
    const formatter = new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const books = rawBooks.map((b) => ({
      ...b,
      created_at: formatter.format(new Date(b.created_at)) + " น.",
      updated_at: formatter.format(new Date(b.updated_at)) + " น.",
    }));

    res.json({ status: "success", data: books });
  } catch (err) {
    next(err);
  }
};

// export const getBook = async (
//   req: Request<{ id: string }>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const id = Number(req.params.id)

//   try {
//     const [rows] = await pool.query<RowDataPacket[]>(
//       'SELECT * FROM books WHERE id = ?',
//       [id]
//     )
//     const book = (rows as Book[])[0]

//     if (!book) {
//       res.status(404).json({ error: 'Book not found' })
//       return
//     }

//     res.json({ status: 'success', data: book })
//   } catch (err) {
//     next(err)
//   }
// }

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, author, published_year, genre } = req.body;
  try {
    const [result] = await pool.query<OkPacket>(
      `INSERT INTO books
       (title, author, published_year, genre)
       VALUES (?, ?, ?, ?)`,
      [title, author, published_year ?? null, genre ?? null]
    );
    const insertId = result.insertId;
    res.status(201).json({
      status: "created",
      data: { id: insertId, title, author, published_year, genre },
    });
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);
  const { title, author, published_year, genre } = req.body;
  try {
    await pool.query<OkPacket>(
      `UPDATE books SET
         title = ?,
         author = ?,
         published_year = ?,
         genre = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, author, published_year ?? null, genre ?? null, id]
    );
    res.json({ status: "updated" });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query<OkPacket>("DELETE FROM books WHERE id = ?", [id]);
    res.json({ status: "deleted" });
  } catch (err) {
    next(err);
  }
};

interface SimpleBook {
  id: number;
  title: string;
}

export const recentBooks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ดึง 4 รายการล่าสุดตาม created_at
    const [addedRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title
       FROM books
       ORDER BY created_at DESC
       LIMIT 4`
    );
    // ดึง 4 รายการล่าสุดตาม updated_at
    const [updatedRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title
       FROM books
       ORDER BY updated_at DESC
       LIMIT 4`
    );
    // ดึง 1 รายการแบบสุ่ม
    const [randRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, author
       FROM books
       ORDER BY RAND()
       LIMIT 1`
    );

    res.json({
      status: "success",
      data: {
        recentlyAdded: (addedRows as SimpleBook[]),
        recentlyUpdated: (updatedRows as SimpleBook[]),
        randomPick: (randRows[0] as { id: number; title: string; author: string }),
      },
    });
  } catch (err) {
    next(err);
  }
};