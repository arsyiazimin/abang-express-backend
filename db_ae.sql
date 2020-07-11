-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Jun 2020 pada 14.19
-- Versi server: 10.4.11-MariaDB
-- Versi PHP: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ae`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `m_menu`
--

CREATE TABLE `m_menu` (
  `MENU_ID` int(11) NOT NULL,
  `TITLE` varchar(200) DEFAULT NULL,
  `ICON` varchar(200) DEFAULT NULL,
  `TYPE` varchar(200) DEFAULT NULL,
  `BADGE_TYPE` varchar(200) DEFAULT NULL,
  `BADGE_VALUE` varchar(200) DEFAULT NULL,
  `ACTIVE` int(11) DEFAULT 0,
  `PATH` varchar(200) NOT NULL,
  `BOOKMARK` int(11) DEFAULT 0,
  `PARENT_ID` int(11) DEFAULT NULL,
  `IS_ACTIVE` int(11) DEFAULT 0,
  `CONDITION` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `m_menu`
--

INSERT INTO `m_menu` (`MENU_ID`, `TITLE`, `ICON`, `TYPE`, `BADGE_TYPE`, `BADGE_VALUE`, `ACTIVE`, `PATH`, `BOOKMARK`, `PARENT_ID`, `IS_ACTIVE`, `CONDITION`) VALUES
(1, 'Dashboard', 'home', 'link', 'primary', 'new', 0, '/dashboard', 1, NULL, 1, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `m_roles`
--

CREATE TABLE `m_roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `m_role_type`
--

CREATE TABLE `m_role_type` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(200) NOT NULL,
  `status_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `m_user`
--

CREATE TABLE `m_user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(500) NOT NULL,
  `last_name` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `status_id` int(11) NOT NULL DEFAULT 0,
  `create_date` date NOT NULL,
  `update_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `m_user`
--

INSERT INTO `m_user` (`user_id`, `first_name`, `last_name`, `email`, `status_id`) VALUES
(1, 'Developer', '', 'dev@gmail.com', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_assign`
--

CREATE TABLE `t_assign` (
  `assign_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `create_id` int(11) NOT NULL,
  `create_date` date NOT NULL,
  `update_id` int(11) NOT NULL,
  `update_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_user_login`
--

CREATE TABLE `t_user_login` (
  `login_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_code` varchar(1000) NOT NULL,
  `login_pass` varchar(1000) NOT NULL,
  `s_pass` varchar(1000) NOT NULL,
  `status_id` int(11) NOT NULL DEFAULT 0,
  `is_dev` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `t_user_login`
--

INSERT INTO `t_user_login` (`login_id`, `user_id`, `login_code`, `login_pass`, `s_pass`, `status_id`, `is_dev`) VALUES
(1, 1, 'dev@gmail.com', '2b42ab75e6481e9d57023028d1b8535ea35a269e709f7cb226511aedc24e6056', '$2b$10$Od2SO.97EmupMRcG8iOmR.pvVd5FvAil9xpACm917zavXE6PEY52m', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `m_menu`
--
ALTER TABLE `m_menu`
  ADD PRIMARY KEY (`MENU_ID`);

--
-- Indeks untuk tabel `m_roles`
--
ALTER TABLE `m_roles`
  ADD PRIMARY KEY (`role_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indeks untuk tabel `m_role_type`
--
ALTER TABLE `m_role_type`
  ADD PRIMARY KEY (`type_id`);

--
-- Indeks untuk tabel `m_user`
--
ALTER TABLE `m_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indeks untuk tabel `t_assign`
--
ALTER TABLE `t_assign`
  ADD PRIMARY KEY (`assign_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `t_user_login`
--
ALTER TABLE `t_user_login`
  ADD PRIMARY KEY (`login_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `m_menu`
--
ALTER TABLE `m_menu`
  MODIFY `MENU_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `m_roles`
--
ALTER TABLE `m_roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `m_role_type`
--
ALTER TABLE `m_role_type`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `m_user`
--
ALTER TABLE `m_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `t_assign`
--
ALTER TABLE `t_assign`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_user_login`
--
ALTER TABLE `t_user_login`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `m_roles`
--
ALTER TABLE `m_roles`
  ADD CONSTRAINT `m_roles_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `m_role_type` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `t_assign`
--
ALTER TABLE `t_assign`
  ADD CONSTRAINT `t_assign_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `m_roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `t_assign_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `m_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `t_user_login`
--
ALTER TABLE `t_user_login`
  ADD CONSTRAINT `t_user_login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `m_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
