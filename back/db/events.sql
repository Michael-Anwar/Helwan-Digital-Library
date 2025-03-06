-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2023 at 07:48 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `libraryprojectsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `from_date` varchar(20) DEFAULT NULL,
  `to_date` varchar(20) DEFAULT NULL,
  `place` varchar(255) NOT NULL,
  `dateCreate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `content`, `img`, `from_date`, `to_date`, `place`, `dateCreate`) VALUES
(1, 'تقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة5', 'المكتبات الرقمية الفرعية في كل كلية، أو تمثعددة، بالإضافة إلى ذلك تقدم المكتبة خدمات مباشرة لأعضاء هيئة التدريستقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة متمثلة في المكتبات الرقمية الفرعية في كل كلية، أو تمثيل الوحدة في لجان ', 'admin_1_1700590816786.jpg', '2023-11-10', '2023-12-01', 'cvv', '2023-11-21 18:20:16'),
(3, 'تقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة', 'تقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة', 'admin_1_1700635114301.jpg', '2023-11-08', '2023-11-10', 'cvv', '2023-11-22 06:38:34'),
(4, 'تقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة', 'cvv@info.com', 'admin_1_1700635482245.jpeg', '2023-11-23', '2023-11-25', 'cvv', '2023-11-22 06:44:42'),
(5, 'تقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة', 'تقدم المكتبة الرقمية خدمات معلوماتية متميزة سواء لكليات/ معاهد الجامعة', 'admin_1_1700635681478.png', '2023-11-15', '2023-11-30', 'cvv', '2023-11-22 06:48:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
