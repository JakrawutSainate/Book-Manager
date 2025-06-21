-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 21, 2025 at 03:38 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `published_year` int DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `published_year`, `genre`, `created_at`, `updated_at`) VALUES
(3, 'Be a Kind Mosquito', 'Sofia Pavon', 2021, 'Thriller', '2025-06-20 09:24:10', '2025-06-20 16:10:16'),
(4, 'The Formation', 'Charles Darwin', 1859, 'Science', '2025-06-20 09:24:10', '2025-06-20 09:24:10'),
(5, 'Deep Learning', 'Ian Goodfellow', 2016, 'Science', '2025-06-20 09:24:10', '2025-06-20 14:51:22'),
(6, 'Clean Code', 'Robert C. Martin', 2008, 'Science', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(7, 'The Pragmatic Programmer', 'Andrew Hunt', 1999, 'Science', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(8, 'To Kill a Mockingbird', 'Harper Lee', 1960, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(9, '1984', 'George Orwell', 1949, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(10, 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(11, 'A Brief History of Time', 'Stephen Hawking', 1988, 'Science', '2025-06-20 09:24:10', '2025-06-20 09:24:10'),
(12, 'The Hobbit', 'J.R.R. Tolkien', 1937, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(13, 'Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 1997, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(14, 'The Catcher in the Rye', 'J.D. Salinger', 1951, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(15, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 2011, 'History', '2025-06-20 09:24:10', '2025-06-20 09:24:10'),
(16, 'Educated', 'Tara Westover', 2018, 'History', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(17, 'The Silent Patient', 'Alex Michaelides', 2019, 'Thriller', '2025-06-20 09:24:10', '2025-06-20 09:24:10'),
(18, 'Becoming', 'Michelle Obama', 2018, 'History', '2025-06-20 09:24:10', '2025-06-20 10:31:41'),
(19, 'The Alchemist', 'Paulo Coelho', 1988, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 09:24:10'),
(20, 'The Road', 'Cormac McCarthy', 2006, 'Fiction', '2025-06-20 09:24:10', '2025-06-20 14:51:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
